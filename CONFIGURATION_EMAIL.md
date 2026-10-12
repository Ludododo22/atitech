# Configuration de l’envoi d’emails

Le formulaire appelle `public/api/contact.php`. L’hébergement doit donc prendre en charge PHP 8.1 ou une version ultérieure. PHPMailer 6.10.0 est déjà embarqué dans `public/api/vendor`.

## Variables d’environnement

Configurez ces variables sur le serveur, sans les ajouter au dépôt :

```text
SMTP_HOST=smtp.votre-fournisseur.com
SMTP_PORT=587
SMTP_USERNAME=adresse@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe-smtp
SMTP_ENCRYPTION=tls
SMTP_FROM_ADDRESS=adresse@votre-domaine.com
SMTP_FROM_NAME=Atitech Gabon
CONTACT_RECIPIENT=contact.atitech@gmail.com
```

- `SMTP_ENCRYPTION` accepte `tls`, `ssl` ou `none`.
- Le serveur doit servir le contenu de `dist/` après `pnpm build` et exécuter les fichiers `.php`.
- À chaque envoi valide, Atitech reçoit la demande et le client reçoit automatiquement un accusé de réception.
- Aucun identifiant SMTP n’est inclus dans le projet ou dans l’archive ZIP.

## Installation Composer facultative

PHPMailer est fourni pour que l’archive fonctionne sans Composer. Pour gérer la dépendance avec Composer sur le serveur :

```bash
cd public/api
composer install --no-dev --optimize-autoloader
```
