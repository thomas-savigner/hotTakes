
//              app.js : script central de l'application


//      Import des composants
//  Framework
const express = require('express');

//  Application Express
const app = express();

//  Plugin cluster
const mongoose = require('mongoose');

//  Variables d'environnement
require('dotenv').config();

//  Accès au serveur
const path = require('path');




//  Connexion du cluster à l'API
mongoose.connect(process.env.DBPROCESSCONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


/*  Implémentation de CORS : ajout des headers qui permettent 
    d'accéder à l'API depuis n'importe quelle origine (*),
    d'ajouter les headers mentionnés aux requêtes envoyées vers notre API,
    d'envoyer des requêtes avec les méthodes mentionnées
*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


/*  Pour gérer les requêtes POST et PUT venant de l'application front-end, 
    on a besoin d'en extraire le corps JSON. Avec ceci, Express prend toutes les requêtes
    qui ont comme Content-Type  application/json  et met à disposition leur  body 
    directement sur l'objet req
*/
app.use(express.json());


//  Gestionnaire de routage pour les fichiers image
app.use('/images', express.static( path.join(__dirname, 'images') ));

//  Import des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/data');

//  Enregistrement du routeur pour toutes les demandes effectuées vers /api/auth
app.use('/api/auth', userRoutes);

//  De même pour les demandes effectuées vers /api/sauces
app.use('/api/sauces', sauceRoutes);

module.exports = app;