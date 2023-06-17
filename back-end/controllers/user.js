

//                      Logique métier des routes user

//      Import des modules dans le script
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

require('dotenv').config();



//      Fonctions exportées dans les routes user mettant en place un processus sécurisé
//      des actions de l'utilisateur sur ses données utilisateur

//  Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    
    //  hashage du mot de passe
    bcrypt.hash(req.body.password, 10)
        
        .then( hash => {
            
            const user = new User({

                email: req.body.email,
                password: hash
                
            });
            
            //  Sauvegarde dans la base
            user.save()
                .then( () => res.status(201).json({ message: 'Utilisateur créé !' }) )
                .catch( error => res.status(400).json({ error }) );
                
        })
        .catch( error => res.status(500).json({ error }) );

};


//  Connexion de l'utilisateur
exports.login = (req, res, next) => {

    //  Recherche dans la base
    User.findOne({ email: req.body.email })
        .then( user => {

            if (!user) {

                return res.status(401).json({ error: 'Utilisateur non trouvé !' });

            }

            //  Comparaison ds mots de passe
            bcrypt.compare(req.body.password, user.password)
                .then( valid => {

                    if (!valid) {

                        return res.status(401).json({ error: 'Mot de passe incorrect !' });

                    }

                    res.status(200).json({
                        statut: "utilsateur connecté",
                        //  Donnée à encoder:
                        userId: user._id,
                        //  Attribution d'un token
                        token: jwt.sign( { userId: user._id }, process.env.SECRETKEY, { expiresIn: '24h' } )

                    })

                } )
                .catch(error => res.status(500).json({ error }));

        } )
        .catch(error => res.status(500).json({ error }));

}; 