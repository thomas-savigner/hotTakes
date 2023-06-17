
//              Logique métier des routes dédiées aux sauces


//  Import du modèle de données sauce
const Sauce = require('../models/data');

//  Import de file system pour accéder, manipuler les fichiers
const fs = require('fs');


//  Fonction de la route pour importer une sauce
exports.createSauce = (req, res, next) => {

    //  Conversion du format json en objet javascript des données contenues dans la requête
    const sauceObject = JSON.parse(req.body.sauce);

    //  Suppression de l'_id créé par le front-end, MongoDB crééra un id
    delete sauceObject._id;

    //  Organisation des données créées sur le modèle Sauce, trame de la base de données
    const sauce = new Sauce({

        //  Insertion des données du corps la requête 
        ...sauceObject,

        //  Localisation du fichier importé dans le back-end de l'application executée en local
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        //  Initialisation des compteurs likes et dislikes de la sauce à 0,
        //  création de tableaux vides pour enregistrer le like ou le dislike de l'utilisateur
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []

    });

    //  Sauvegarde de la sauce dans la base de données
    sauce.save()
        .then( () => res.status(201).json({ message: 'Sauce importée !'}) )
        .catch( error => res.status(400).json({ error }) )

};


// Fonction de la route pour modifier/mettre à jour une sauce
exports.modifySauce = (req, res, next) => {
  
  //  Recherche de la sauce à modifier dans la base
  Sauce.findOne({ _id: req.params.id })
    .then( sauce => {

        //  Y a-t-il une sauce correspondante dans la base ?
        if ( !sauce ) {

          res.status(404).json( {error: new Error( "La sauce n'existe pas !" )} );

        }

        /*  Autorisation
            Seul l'auteur d'une sauce peut la supprimer. Le token obtenu à l'authenfication
            de l'utilisateur est comparé au userId de la sauce à modifier 
        */
        if (sauce.userId !== req.auth.userId) {

          res.status(403).json( {error: new Error( 'Unauthorized request! ')} );

        }

        //  s'il y a un fichier dans la requête, on supprime l'ancien
        if (req.file) {

          filename = sauce.imageUrl.split('/images/')[1];
            
          fs.unlinkSync(`images/${filename}`);

        } 

        //  Préparation des données modifiées
        const sauceObject = req.file ? {

            /*  Il y a un nouveau fichier:
                    - copie des données contenues dans le body de la requête
                    - dans cette requête, le front n'envoie pas le imageUrl,
                      on procède donc comme à la création: on indique le chemin
                      du nouveau fichier stocké sur la machine de l'utilisateur
            */
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        } : {

            //  Il n'y a pas de fichier, on ne modifie que les données "texte":
              ...req.body,
              imageUrl: sauce.imageUrl 
            
        };
        
        //  Enfin, mise à jour de la sauce en base de donnée
        Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then( () => res.status(200).json({message:'Sauce modifiée!'}) )
            .catch( error => res.status(500).json({error}) )
            
        })
        .catch( error => res.status(400).json({ error }) )

}


//  Fonction de la route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
      
      //  Recherche de la sauce correspondante à supprimer dans la base
      Sauce.findOne({ _id: req.params.id })
          .then( sauce => { 

              //  Y a-t-il une sauce correspondante dans la base ?
              if ( !sauce ) {

                res.status(404).json( {error: new Error( "La sauce n'existe pas !" )} );
          
              }
        
              //  Pour pouvoir supprimer une sauce, il faut en être le créateur
              if (sauce.userId !== req.auth.userId) {

                res.status(403).json( {error: new Error( 'Unauthorized request! ')} );

              }

              //  Extraction du nom de fichier de la donnée imageUrl de la sauce
              const filename = sauce.imageUrl.split('/images/')[1];

              //  Suppression du fichier stocké dans le back-end et suppression des données de la base de données
              fs.unlink(`images/${filename}`, () => {

                  Sauce.deleteOne( { _id: req.params.id } )
                      .then( () => res.status(200).json({ message: 'Sauce supprimée !' }) )
                      .catch( error => res.status(400).json({ error }) )

              })
                 
          })

          .catch( error => res.status(500).json({ error }) )
    
  };


//  Fonction de la route pour récupérer une sauce définie
exports.getOneSauce = (req, res, next) => {

    Sauce.findOne( { _id: req.params.id } )
        .then( sauce => res.status(200).json(sauce) )
        .catch( error => res.status(404).json({ error }) )

};


//  Fonction de la route qui récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {

    Sauce.find()
        .then( sauces => res.status(200).json(sauces) )
        .catch( error => res.status(400).json({ error }) )

};


//  Fonctionnalité "liker-disliker une sauce" 
exports.likeSauce = ( req, res ) => {
    
    switch (req.body.like) {

      //  L'utilisateur like
      case 1:
        //  on met à jour les données "like" de la sauce dans la base
        Sauce.updateOne({ _id: req.params.id }, 
              { 
                //  on incrémente de 1 le nombre total de likes
                $inc: { likes: 1 }, 

                //  on inscrit le userId dans le tableau pour ne pas voter plusieurs fois 
                $push: { usersLiked: req.body.userId }
              
              })

          .then(() => { res.status(201).json({ message: "like enregistré" }); })
          .catch((error) => { res.status(400).json({ error }); });
        break;
      

      // L'utlisateur dislike - même logique que le case 1
      case -1:

        Sauce.updateOne({ _id: req.params.id }, 
              {
                $inc: { dislikes: 1 },
              
                $push: { usersDisliked: req.body.userId }
              
              })

          .then(() => { res.status(201).json({ message: "dislike enregistré" }); })
          .catch((error) => { res.status(400).json({ error }); });
        break;


      //  L'utilisateur annule son vote
      case 0:

        //  Sélection de la sauce dans la base
        Sauce.findOne({ _id: req.params.id })
          .then( sauce => {

            //  On inclut des conditions pour vérifier si l'utilisateur a déjà liké ou disliké la sauce  

            //  Si l'utilsateur a déjà liké
            if (sauce.usersLiked.find( user => user === req.body.userId)) {
              

              Sauce.updateOne({ _id: req.params.id }, 
                  {
                    //  Annulation du like
                    $inc: { likes: -1 },

                    //  On retire l'utilisateur du tableau userLiked
                    $pull: { usersLiked: req.body.userId }
                  })

                .then(() => { res.status(201).json({ message: "like annulé" }); })
                .catch((error) => { res.status(400).json({error}); });
            }

            //  Si l'utilisateur a déjà disliké, même logique que la condition précédente
            if (sauce.usersDisliked.find(user => user === req.body.userId)) { 
              
              Sauce.updateOne({ _id: req.params.id },
                  {
                    $inc: { dislikes: -1 },
                    
                    $pull: { usersDisliked: req.body.userId }
                  })

                .then(() => { res.status(201).json({ message: "dislike annulé" }); })
                .catch((error) => { res.status(400).json({error}); });
            }
          })
          .catch((error) => { res.status(404).json({error}); });
          break;
      
      default:
        console.error("bad request");
    }
  };