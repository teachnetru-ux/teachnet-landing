<?php
/**
 * TeachNet — приём заявки с лендинга и отправка в Telegram (Bot API).
 * Поля формы: name, phone, age, consent + honeypot (website).
 *
 * ┌─ ЗАПОЛНИТЬ ─────────────────────────────────────────────────────────────┐
 * │ Создайте бота у @BotFather, получите токен. Узнайте chat_id (напр.       │
 * │ через @getmyid_bot или @userinfobot).                                    │
 * │ Значения хранятся ВНЕ веб-корня в файле send_config.php (см. ниже),       │
 * │ который создаётся вручную на сервере и не попадает в репозиторий/деплой.  │
 * │ Формат send_config.php:                                                   │
 * │   <?php return ['bot_token' => '1234567890:AA...', 'chat_id' => '...'];   │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
// Конфиг с секретами лежит выше веб-корня (вне зоны FTP-деплоя).
// Путь '/../../' может потребовать подгонки под реальное размещение на хостинге.
$cfg = @include __DIR__ . '/../../send_config.php';
if (!is_array($cfg)) {
    $cfg = [];
}
$BOT_TOKEN = $cfg['bot_token'] ?? '';
$CHAT_ID   = $cfg['chat_id']   ?? '';
// Дополнительные каналы (необязательны): БД и email
$DB_HOST   = $cfg['db_host']   ?? 'localhost';
$DB_NAME   = $cfg['db_name']   ?? '';
$DB_USER   = $cfg['db_user']   ?? '';
$DB_PASS   = $cfg['db_pass']   ?? '';
$EMAIL_TO  = $cfg['email_to']  ?? '';

// --- только POST ---
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// --- honeypot: поле website должно быть пустым (его заполняют боты) ---
if (!empty(trim($_POST['website'] ?? ''))) {
    // тихо «успех», ничего не отправляя
    echo json_encode(['ok' => true]);
    exit;
}

// --- сбор и базовая валидация ---
$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$age     = trim($_POST['age'] ?? '');
$consent = trim($_POST['consent'] ?? '');

// доп. поля источника трафика и идентификаторы Яндекса (необязательные)
$utm_source   = trim($_POST['utm_source'] ?? '');
$utm_medium   = trim($_POST['utm_medium'] ?? '');
$utm_campaign = trim($_POST['utm_campaign'] ?? '');
$utm_term     = trim($_POST['utm_term'] ?? '');
$utm_content  = trim($_POST['utm_content'] ?? '');
$yclid        = trim($_POST['yclid'] ?? '');
$ym_client_id = trim($_POST['ym_client_id'] ?? '');

$digits = preg_replace('/\D/', '', $phone);

if (mb_strlen($name) < 2 || strlen($digits) !== 11 || $age === '' || $consent === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

if ($BOT_TOKEN === '' || $CHAT_ID === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'not_configured']);
    exit;
}

// --- блок «Источник» (только непустые поля; используется в Telegram и email) ---
$sourceFields = [
    'utm_source'   => $utm_source,
    'utm_medium'   => $utm_medium,
    'utm_campaign' => $utm_campaign,
    'utm_term'     => $utm_term,
    'utm_content'  => $utm_content,
    'yclid'        => $yclid,
    'ym_client_id' => $ym_client_id,
];
$sourceLines = [];
foreach ($sourceFields as $k => $v) {
    if ($v !== '') {
        $sourceLines[] = $k . ': ' . $v;
    }
}
$sourceText = $sourceLines ? implode("\n", $sourceLines) : 'нет данных';

// --- дата/время по Москве (таймзона задана явно, не зависит от настроек сервера) ---
$now = new DateTime('now', new DateTimeZone('Europe/Moscow'));
$timeText = $now->format('d.m.Y H:i') . ' (МСК)';

// --- запись в БД ДО Telegram, чтобы получить номер заявки (lastInsertId) ---
// best-effort: если БД недоступна — $leadId останется null, Telegram всё равно уйдёт.
$leadId = null;
if ($DB_NAME !== '' && $DB_USER !== '') {
    try {
        $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT            => 5,
        ]);
        $stmt = $pdo->prepare(
            'INSERT INTO leads (name, phone, child_age, created_at, source, '
            . 'utm_source, utm_medium, utm_campaign, utm_term, utm_content, yclid, ym_client_id) '
            . 'VALUES (:name, :phone, :child_age, NOW(), :source, '
            . ':utm_source, :utm_medium, :utm_campaign, :utm_term, :utm_content, :yclid, :ym_client_id)'
        );
        $stmt->execute([
            ':name'         => $name,
            ':phone'        => $phone,
            ':child_age'    => $age,
            ':source'       => 'website',
            ':utm_source'   => $utm_source,
            ':utm_medium'   => $utm_medium,
            ':utm_campaign' => $utm_campaign,
            ':utm_term'     => $utm_term,
            ':utm_content'  => $utm_content,
            ':yclid'        => $yclid,
            ':ym_client_id' => $ym_client_id,
        ]);
        $leadId = (int) $pdo->lastInsertId();
    } catch (Throwable $e) {
        error_log('TeachNet lead: ошибка записи в БД — ' . $e->getMessage());
    }
}

// --- сообщение (источник + время + номер заявки внизу) ---
$text =
    "Новая заявка с лендинга TEACHNET\n\n" .
    "Имя: " . $name . "\n" .
    "Телефон: " . $phone . "\n" .
    "Возраст ребёнка: " . $age .
    "\n\n— Источник —\n" . $sourceText .
    "\n\nВремя: " . $timeText;
if ($leadId) {
    $text .= "\nЗаявка #" . $leadId;
}

// --- отправка в Telegram ---
$url = "https://api.telegram.org/bot{$BOT_TOKEN}/sendMessage";
$payload = http_build_query([
    'chat_id' => $CHAT_ID,
    'text'    => $text,
    'disable_web_page_preview' => true,
]);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_TIMEOUT        => 15,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'telegram_failed']);
    exit;
}

// ─── Email-дубль (best-effort) ─────────────────────────────────────────────
// Telegram доставлен (основной канал). Письмо — вспомогательное: ошибки
// логируются, но НЕ влияют на успешный ответ пользователю.
if ($EMAIL_TO !== '') {
    try {
        $host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $subject = '=?UTF-8?B?' . base64_encode('Новая заявка с лендинга TEACHNET') . '?=';
        $body    =
            "Имя: " . $name . "\n" .
            "Телефон: " . $phone . "\n" .
            "Возраст ребёнка: " . $age .
            "\n\n— Источник —\n" . $sourceText .
            "\n\nВремя: " . $timeText .
            ($leadId ? "\nЗаявка #" . $leadId : '');
        $headers =
            "From: no-reply@" . $host . "\r\n" .
            "Content-Type: text/plain; charset=utf-8\r\n";
        @mail($EMAIL_TO, $subject, $body, $headers);
    } catch (Throwable $e) {
        error_log('TeachNet lead: ошибка отправки email — ' . $e->getMessage());
    }
}

echo json_encode(['ok' => true]);
