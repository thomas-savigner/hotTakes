
//              Mise en place du routeur Express pour les données de l'API      


//          Import des composants

const express = require('express');
const router = express.Router();

//  Authenfication utilisateur
const auth = require('../middleware/auth');
    
//  Gestion du téléchargement de fichier
const multer = require('../middleware/multer-config');


//  Import logique métier des routes
const sauceCtrl = require ('../controllers/data');



//          Routes

//  route POST - import d'une sauce dans l'application
router.post('/', auth, multer, sauceCtrl.createSauce);

//  route PUT - modifie/met à jour une sauce de la base de données
router.put('/:id', auth, multer, sauceCtrl.modifySauce); 

//  route DELETE - supprime la sauce de l'application
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//  route GET - récupére une sauce spécifique
router.get('/:id', auth, sauceCtrl.getOneSauce);

//  route GET - récupére toutes les objets sauce de la base de la base
router.get('/', auth, sauceCtrl.getAllSauces);

//  route POST - permet à l'utilisateur de liker/disliker une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;