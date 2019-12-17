var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/name', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  if (!('name' in req.body)) {
    return res.render('error', { message: 'gamer name attribute not found in request'});
  }
  res.render('gameSelect', { gamer: req.body.name });
});

router.post('/game', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  if (!('name' in req.body)) {
    return res.render('error', { message: 'gamer name attribute not found in request'});
  }
  if (!('game' in req.body)) {
    return res.render('error', { message: 'game attribute not found in request'});
  }
  res.render('game', { gamer: req.body.name, game: req.body.game });
});

router.get('/warehouse', function(req, res, next) {
  res.render('warehouse');
});

module.exports = router;
