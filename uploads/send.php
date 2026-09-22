<?php
/* GPS — form handler. Sends every website form to one inbox.
   Works on Hostinger shared hosting (PHP mail()). No dependencies. */
declare(strict_types=1);

const TO = 'info@gpsouth.org';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

/* honeypot — bots fill hidden fields, humans do not */
if (!empty($_POST['website'])) {
  echo json_encode(['ok' => true]);
  exit;
}

function clean(string $v): string {
  return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v));
}

$formName = clean((string)($_POST['_form'] ?? 'Website form'));
$name     = clean((string)($_POST['name'] ?? ''));
$email    = clean((string)($_POST['email'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
  exit;
}

$skip = ['_form', 'website'];
$lines = [];
foreach ($_POST as $key => $value) {
  if (in_array($key, $skip, true)) continue;
  if (is_array($value)) $value = implode(', ', $value);
  $label = ucfirst(str_replace(['_', '-'], ' ', (string)$key));
  $lines[] = $label . ":\n" . trim((string)$value);
}

$body = "New submission from the GPS website\n"
      . "Form: {$formName}\n"
      . 'Received: ' . date('r') . "\n"
      . str_repeat('-', 48) . "\n\n"
      . implode("\n\n", $lines) . "\n";

$subject = 'GPS website — ' . $formName . ($name !== '' ? ' — ' . $name : '');

$headers = [
  'From: GPS Website <no-reply@gpsouth.org>',
  'Reply-To: ' . ($name !== '' ? $name . ' <' . $email . '>' : $email),
  'Content-Type: text/plain; charset=utf-8',
  'MIME-Version: 1.0',
];

$sent = @mail(TO, $subject, $body, implode("\r\n", $headers));

if ($sent) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail delivery failed.']);
}
