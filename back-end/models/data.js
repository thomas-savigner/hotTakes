
//          Modèle de données pour les sauces dans la base de données


// Import
const mongoose = require('mongoose');

//  regex pour la validation
const isAlphaNum = /^[a-zA-Zà-żÀ-Ż-0-9+\s.]+$/i;


const sauceSchema = mongoose.Schema({

    userId: { type: String, require: true },
    name: { type: String, require: true, 
            validate(value) {if (!isAlphaNum.test(value)) {
                                
            console.log('Le champ name ne peut contenir des caractères spéciaux');
            throw new Error('Ce champ ne peut contenir des caractères spéciaux')
        } } },
    manufacturer: { type: String, required: true,
            validate(value) {if (!isAlphaNum.test(value)) {
                                
                console.log('Le champ manufacturer ne peut contenir des caractères spéciaux');
                throw new Error('Ce champ ne peut contenir des caractères spéciaux')
            } } },
    description: { type: String, required: true,
            validate(value) {if (!isAlphaNum.test(value)) {
                                    
                console.log('Le champ description ne peut contenir des caractères spéciaux');
                throw new Error('Ce champ ne peut contenir des caractères spéciaux')
            } } },
    mainPepper: { type: String, required: true,
            validate(value) {if (!isAlphaNum.test(value)) {
                                    
                console.log('Le champ mainPepper ne peut contenir des caractères spéciaux');
                throw new Error('Ce champ ne peut contenir des caractères spéciaux')
            } } },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },

});

module.exports = mongoose.model('Sauce', sauceSchema);

