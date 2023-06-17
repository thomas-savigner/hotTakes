/*  Fonctionnalité de sécurité: Authenfication de l'utilisateur sur la base du token 
    obtenu au login sur l'application
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {

        //  Vérification de la signature du token
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRETKEY);
        const userId = decodedToken.userId;
        
        /*  En même temps, on insert le token décodé soit le userId dans l'objet auth de la requête
            pour le réutiliser dans les requêtes DELETE et POST pour vérifier que l'utilisateur
            est l'auteur de la sauce
        */
        req.auth = { userId };

        //  Comparaison
        if (req.body.userId && req.body.userId !== userId) {

        throw 'Invalid user ID';

        } else {

            next();

        }

    } catch {

        res.status(401).json( {

            error: new Error( 'Requête non authentifiée!' )

        } );
    
    }

}