<?php
/**
 * TeachNet — приём заявки с лендинга и отправка в Telegram (Bot API).
 * Поля формы: name, phone, age, consent + honeypot (website).
 *
 * ┌─ ЗАПОЛНИТЬ ─────────────────────────────────────────────────────────────┐
 * │ Создайте бота у @BotFather, получите токен. Узнайте chat_id (напр.       │
 * │ через @getmyid_bot или @userinfobot). Впишите значения ниже.             │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
$BOT_TOKEN = '';   // заполнить: токен бота от @BotFather, напр. '1234567890:AA...'
$CHAT_ID   = '';   // заполнить: id чата/группы, напр. '123456789' или '-1001234567890'

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

// --- сообщение ---
$text =
    "Новая заявка с лендинга TEACHNET\n\n" .
    "Имя: " . $name . "\n" .
    "Телефон: " . $phone . "\n" .
    "Возраст ребёнка: " . $age;

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

echo json_encode(['ok' => true]);
