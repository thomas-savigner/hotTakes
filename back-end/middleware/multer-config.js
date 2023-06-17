
/*  Utilisation du package multer pour la prise en charge du fichier contenu
    dans les requêtes POST et PUT sur les sauces
*/

const multer = require('multer');

//  Dictionnaires pour résoudre l'exension de fichier appropriée
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
    
    //  On indique où enregistrer les fichiers
    destination: (req, file, callback) => {

        callback(null, 'images');

    },

    //  On contruit la trame de nom de fichier à reproduire pour avoir des fichiers uniques
    filename: (req, file, callback) => {
        
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    
    }

});

module.exports = multer({storage: storage}).single('image');