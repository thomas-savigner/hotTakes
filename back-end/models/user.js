    
                //  Modèle de données utilisateur



//      Import des modules dans le script

//  plugin pour lier la base de données au script
const mongoose = require('mongoose');

//  plugin pour valider l'email
const validateEmail = function(email) {

    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
    
};

//  plugin pour ne pas créer d'email en doublon dans la base
const uniqueValidator = require('mongoose-unique-validator'); 


//  Création du modèle de données des users
const userSchema = mongoose.Schema({

    email: { 
        
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],

        },

    password: { type: String, required: true }
  
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);