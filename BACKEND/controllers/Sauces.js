const sauces = require('../models/Sauces');
const fs = require('fs');

//Create a sauce

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauces)
    delete req.body._id;
    const sauce = new sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    sauce.save()
        .then(() => res.status(201).json({ message: 'user saved' }))
        .catch(error => res.status(400).json({ error }));
    res.status(201).json();
}

//Modify a sauce

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        : { ...req.body };

    sauces.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
}

//Delete a sauce

exports.deleteSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Display all sauces

exports.displaySauce = (req, res, next) => {
    sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//Find one specific sauce

exports.findSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//Like a sauce

exports.likeSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new sauces({
        ...req.body
    })

    sauce.save()
        .then(() => res.status(201).json({ message: 'user choice saved' }))
        .catch(error => res.status(400).json({ error }));
    res.status(201).json();
}