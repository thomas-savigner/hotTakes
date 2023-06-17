
//      Mise en place du routeur Express sur les données utlisateur      

//  Import des composants
const express = require('express');
const router = express.Router();

//  Import de la logique métier des routes
const userCtrl = require('../controllers/user');

//          Routes disponibles
//  Création de compte utilisateur      
router.post('/signup', userCtrl.signup);

//  Connexion de l'utilisateur sur l'application
router.post('/login', userCtrl.login);

module.exports = router;