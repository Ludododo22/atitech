<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $success, string $message): never
{
    http_response_code($status);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

function envValue(string $name, ?string $default = null): ?string
{
    $value = getenv($name);
    return $value === false || $value === '' ? $default : $value;
}

function createMailer(): PHPMailer
{
    $host = envValue('SMTP_HOST');
    $username = envValue('SMTP_USERNAME');
    $password = envValue('SMTP_PASSWORD');
    $fromAddress = envValue('SMTP_FROM_ADDRESS', $username);

    if (!$host || !$fromAddress) {
        throw new RuntimeException('Configuration SMTP incomplète.');
    }

    $mailer = new PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = $host;
    $mailer->Port = (int) envValue('SMTP_PORT', '587');
    $mailer->CharSet = PHPMailer::CHARSET_UTF8;
    $mailer->SMTPAuth = (bool) $username;
    $mailer->Username = $username ?? '';
    $mailer->Password = $password ?? '';

    $encryption = strtolower((string) envValue('SMTP_ENCRYPTION', 'tls'));
    if ($encryption === 'ssl' || $encryption === 'smtps') {
        $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($encryption === 'tls' || $encryption === 'starttls') {
        $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mailer->SMTPAutoTLS = false;
    }

    $mailer->setFrom(
        $fromAddress,
        envValue('SMTP_FROM_NAME', 'Atitech Gabon') ?? 'Atitech Gabon'
    );
    $mailer->isHTML(true);

    return $mailer;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Méthode non autorisée.');
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ?: '', true);

if (!is_array($data)) {
    respond(400, false, 'Requête invalide.');
}

// Honeypot: les visiteurs réels ne voient jamais ce champ.
if (!empty($data['website'])) {
    respond(200, true, 'Message reçu.');
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$service = trim((string) ($data['service'] ?? 'Non précisé'));
$message = trim((string) ($data['message'] ?? ''));

if (
    $name === '' ||
    strlen($name) > 240 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($email) > 190 ||
    $message === '' ||
    strlen($message) > 10000 ||
    strlen($service) > 240
) {
    respond(422, false, 'Veuillez vérifier les informations saisies.');
}

$safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeService = htmlspecialchars($service, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeMessage = nl2br(
    htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
);
$recipient = envValue('CONTACT_RECIPIENT', 'contact.atitech@gmail.com');

try {
    $notification = createMailer();
    $notification->addAddress($recipient);
    $notification->addReplyTo($email, $name);
    $notification->Subject = 'Nouvelle demande Atitech — ' . $service;
    $notification->Body = <<<HTML
        <div style="font-family:Arial,sans-serif;color:#07182d;line-height:1.6">
          <h2 style="color:#1466f5">Nouvelle demande depuis le site Atitech</h2>
          <p><strong>Nom :</strong> {$safeName}</p>
          <p><strong>Email :</strong> {$safeEmail}</p>
          <p><strong>Service :</strong> {$safeService}</p>
          <p><strong>Message :</strong><br>{$safeMessage}</p>
        </div>
        HTML;
    $notification->AltBody = "Nom : {$name}\nEmail : {$email}\nService : {$service}\n\n{$message}";
    $notification->send();

    $receipt = createMailer();
    $receipt->addAddress($email, $name);
    $receipt->Subject = 'Nous avons bien reçu votre demande — Atitech';
    $receipt->Body = <<<HTML
        <div style="font-family:Arial,sans-serif;color:#07182d;line-height:1.7;max-width:620px">
          <h2 style="color:#1466f5">Merci {$safeName},</h2>
          <p>Votre demande concernant <strong>{$safeService}</strong> a bien été reçue.</p>
          <p>Un expert Atitech l'étudie et reviendra vers vous sous 24 heures ouvrées.</p>
          <p style="padding:16px;background:#f3f7fb;border-left:4px solid #25d5c7">
            {$safeMessage}
          </p>
          <p>À très bientôt,<br><strong>L'équipe Atitech Gabon</strong><br>
          +241 74 46 68 62</p>
        </div>
        HTML;
    $receipt->AltBody = "Merci {$name},\n\nVotre demande concernant {$service} a bien été reçue. Un expert Atitech reviendra vers vous sous 24 heures ouvrées.\n\nL'équipe Atitech Gabon";
    $receipt->send();

    respond(200, true, 'Message envoyé avec succès.');
} catch (Exception | RuntimeException $error) {
    error_log('Atitech contact form: ' . $error->getMessage());
    respond(500, false, 'Le message n’a pas pu être envoyé.');
}
