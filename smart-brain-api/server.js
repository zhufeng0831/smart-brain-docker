const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();

//cors is express middleware, modify req and then to next steps like calls next app.get
//use bodyParser to parse and have access to the request dot body [req.body] to read JSON and form data.
app.use(cors())  
app.use(bodyParser.json());
app.use(morgan('combined'));

//refresh webpage is using GET request
//put for update
//post for add
app.get('/', (req, res)=> { res.send(db.users) }) //to 'localhost:3000'
//app.post('/signin', signin.handleSignin(db, bcrypt)) //to 'localhost:3000/signin'
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})   //关于listen(3000) 监听反应: https://expressjs.com/zh-cn/starter/hello-world.html
