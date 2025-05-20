# MorphoConseil

MorphoConseil est une application web qui permet aux utilisateurs de découvrir leur type morphologique et de recevoir des conseils personnalisés pour leur style vestimentaire.

## Fonctionnalités

- 🔐 Authentification sécurisée
- 📊 Analyse des mesures corporelles
- 👔 Recommandations vestimentaires personnalisées
- 📈 Suivi de progression
- 📧 Notifications par email

## Technologies Utilisées

### Backend
- Node.js avec Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Nodemailer pour les emails
- Bcrypt pour le hachage des mots de passe

### Frontend
- React
- TypeScript
- Axios pour les requêtes API
- React Router pour la navigation

## Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL
- npm ou yarn

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd morpho-conseil
```

2. Installez les dépendances du serveur :
```bash
cd server
npm install
```

3. Installez les dépendances du client :
```bash
cd ../client
npm install
```

4. Configurez les variables d'environnement :
Créez un fichier `.env` dans le dossier `server` avec les variables suivantes :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/morpho_db"
JWT_SECRET="votre_secret_jwt"
EMAIL_USER="votre_email@gmail.com"
EMAIL_PASSWORD="votre_mot_de_passe_app"
```

5. Initialisez la base de données :
```bash
cd server
npx prisma migrate dev
```

## Démarrage

1. Démarrez le serveur :
```bash
cd server
npm run dev
```

2. Dans un autre terminal, démarrez le client :
```bash
cd client
npm start
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## Structure du Projet

```
morpho-conseil/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── features/      # Fonctionnalités principales
│   │   ├── services/      # Services API
│   │   └── types/         # Types TypeScript
│   └── package.json
│
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── services/      # Services métier
│   │   └── index.ts       # Point d'entrée
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentification
- `POST /register` - Inscription d'un nouvel utilisateur
- `POST /login` - Connexion utilisateur

### Mesures
- `POST /measurements` - Enregistrement des mesures
- `GET /measurements` - Récupération des mesures
- `PUT /measurements` - Mise à jour des mesures

### Analyse
- `POST /analyze` - Analyse des mesures et recommandations

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence ISC.

## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur le repository.
