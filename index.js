var express= require('express');
var app= express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

var port = process.env.PORT || 5000;

var urlencodedParser = bodyParser.urlencoded({extended: false});

mongoose.connect('');

var Schema= mongoose.Schema;

var User = mongoose.model('User', new Schema({
  id: Schema.ObjectId,
  firstname: String,
  lastname: String,
  email: {type: String, unique: true},
  password: String
}));

app.get('/', function(req, res){
  res.render('index');
});
app.get('/login', function(req, res){
  res.render('index');
});

app.post('/login', urlencodedParser, function(req, res){
  User.findOne({email: req.body.email}, function(err, user){
      if(!user){
        res.render('loginfail');
      }
      if(req.body.password === user.password){
        console.log(user.json);
        res.render('account', {fname:user.firstname, lname: user.lastname});
      }
      else{
        res.render('loginfail');
      }
    });
})


app.get('/loginfail', function(req, res){
  res.render('loginfail');
})

app.get('/register', function(req, res){
  res.render('register');
});
app.post('/register', function(req, res){
  var user = new User({
  firstname: req.body.firstName,
  lastname: req.body.lastName,
  email: req.body.email,
  password: req.body.password
});
user.save(function(err){
    if(err){
      console.log('something wrong happened');
      if(err.code === 11000){
        console.log('This email already exists');
      }
      res.render('logReg', {error: error});
    }
    else{
      res.redirect('/');
    }
  });
});

app.listen(port);
