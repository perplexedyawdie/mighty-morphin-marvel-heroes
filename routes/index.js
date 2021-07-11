var express = require('express');
var formidable = require('formidable');
const toPNG = require('../services/convert2png.js')
const morphMe = require('../services/morphMe.js')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/morphingtime', function (req, res, next) {

  var form = new formidable.IncomingForm({ keepExtensions: true, multiples: true });
  form.parse(req, function (err, fields, files) {
    toPNG(files)
    .then((userImg) => {
      console.log(userImg)
      return morphMe(userImg, fields.hero)
    })
    .then((morphLoc) => {
      console.log(morphLoc)
      res.sendFile(morphLoc)
    })
    .catch((err) => {
      console.log(err)
      res.send(err)
    });
    
    
  });
});

module.exports = router;


