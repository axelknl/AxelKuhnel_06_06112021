const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.newSauce = (req, res, next) => {
  const sauceItem = JSON.parse(req.body.sauce); 
  delete sauceItem._id;
  const sauceCreation = new Sauce({
    ...sauceItem,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauceCreation.save()
    .then(() => res.status(201).json({ message: 'Une nouvelle sauce  débarque !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const url = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`./images/${url}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
        })
      })
      .catch(error => res.status(400).json({ error }));
};

exports.getSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.body.like == 1) {
        Sauce.updateOne({ _id: req.params.id } , {
          $push: { usersLiked: req.body.userId}, $inc: {likes: 1}, _id: req.params.id
        }).then(() => res.status(201).json({ message: 'Sauce liké !'}))
          .catch( error => res.status(400).json({ error }));
      } 
      
      else if (req.body.like == -1) {
        Sauce.updateOne({ _id: req.params.id } , {
          $push: { usersDisliked: req.body.userId}, $inc: {dislikes: 1}, _id: req.params.id
        }).then(() => res.status(201).json({ message: 'Sauce disliké !'}))
          .catch( error => res.status(400).json({ error }));
      } 
      
      else {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id : req.params.id }, {
            $pull: {usersLiked: req.body.userId},
            $inc: {likes:-1},
            _id: req.params.id
          }).then(() => res.status(201).json({ message: 'Like retiré !'}))
            .catch( error => res.status(400).json({ error }));
        }

        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id : req.params.id }, {
            $pull: {usersDisliked: req.body.userId},
            $inc: {dislikes:-1},
            _id: req.params.id
          }).then(() => res.status(201).json({ message: 'Dislike retiré !'}))
            .catch( error => res.status(400).json({ error }));
        }
      }
    })
    .catch(error => res.status(404).json({ error }));
}

exports.changeSauce = (req, res, next) => {
  const sauceFile = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id}, { ...sauceFile, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Modification effectuée !' }))
    .catch(error => res.status(400).json({ error }));
};
