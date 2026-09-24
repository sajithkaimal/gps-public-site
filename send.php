<?php
/* GPS — form handler. Sends every website form to one inbox.
   Works on Hostinger shared hosting (PHP mail()). No dependencies. */
declare(strict_types=1);

const TO = 'info@gpsouth.org';
/* institutional-membership forms copy the membership committee */
const CC_BY_KEY = [
  'membership'    => ['sajithg@gmail.com', 'karegeye@gmail.com', 'hiruteketel@gmail.com'],
  'questionnaire' => ['sajithg@gmail.com', 'karegeye@gmail.com', 'hiruteketel@gmail.com'],
];

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
$formKey  = clean((string)($_POST['_key'] ?? ''));
$inst     = clean((string)($_POST['institution_name'] ?? ''));
$name     = clean((string)($_POST['name'] ?? ''));
$email    = clean((string)($_POST['email'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
  exit;
}

$skip = ['_form', '_key', 'website'];
$lines = [];
foreach ($_POST as $key => $value) {
  if (in_array($key, $skip, true)) continue;
  if (is_array($value)) $value = implode("\n  • ", array_map('strval', $value)) === '' ? '' : "\n  • " . implode("\n  • ", array_map('strval', $value));
  if (!is_array($value) && trim((string)$value) === '') continue;
  $label = ucfirst(str_replace(['_', '-'], ' ', (string)$key));
  $lines[] = $label . ":\n" . trim((string)$value);
}

$body = "New submission from the GPS website\n"
      . "Form: {$formName}\n"
      . 'Received: ' . date('r') . "\n"
      . str_repeat('-', 48) . "\n\n"
      . implode("\n\n", $lines) . "\n";

$subject = 'GPS website — ' . $formName . ($inst !== '' ? ' — ' . $inst : ($name !== '' ? ' — ' . $name : ''));

$headers = [
  'From: GPS Website <no-reply@gpsouth.org>',
  'Reply-To: ' . ($name !== '' ? $name . ' <' . $email . '>' : $email),
  'Content-Type: text/plain; charset=utf-8',
  'MIME-Version: 1.0',
];
$cc = CC_BY_KEY[$formKey] ?? [];
if ($cc) $headers[] = 'Cc: ' . implode(', ', $cc);

$sent = @mail(TO, $subject, $body, implode("\r\n", $headers));

if ($sent && $formKey !== '') {
  /* acknowledgement to the applicant */
  $ack = "Dear " . ($name !== '' ? $name : 'colleague') . ",\n\nThank you. GPS has received your " . $formName . ($inst !== '' ? ' for ' . $inst : '') . ".\n\nOur partnerships team will review it and respond within two weeks. A copy of what you submitted is below for your records.\n\nGlobal Platform for the South\ninfo@gpsouth.org · gpsouth.org\n\n" . str_repeat('-', 48) . "\n\n" . implode("\n\n", $lines) . "\n";
  @mail($email, 'GPS — we received your ' . $formName, $ack, implode("\r\n", ['From: GPS <no-reply@gpsouth.org>', 'Reply-To: info@gpsouth.org', 'Content-Type: text/plain; charset=utf-8', 'MIME-Version: 1.0']));
}

if ($sent) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail delivery failed.']);
}
