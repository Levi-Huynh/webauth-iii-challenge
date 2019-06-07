const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex') (session); 


const usersRouter = require('../users/users-router.js');

const server = express();

//for how long session be valid on server can configure
const sessionConfig = {
  name: 'monster', //by default would be sid
  secret: 'Shh this is the secret here!', //encrypt not infallable adds a layer of security
 cookie: {
   httpOnly: true, //true means prevent access from JavaScript code, including node modules?
   maxAge: 1000 * 60 * 20, //in milliseconds here is one moine 1000*6 *6 *24 is 24 hours
   secure: false, //true means only send the cookie over https (every app that goes to production should be running over)
   //https. channel of info is protected.  THis is for dev only so dont do this now.  When in production
   //true when running production. Make this dynamiclly change for production by using processdotenv 
 },
 resave:false, //resave session even if it didn't change?
 saveUninitialized: true, //create new sessions automatically, make sure to comply with law
 
 //* saveUninitialized: for complying with laws that require permission before setting a cookie
 //dont keep ^ true willynilly on Client -have pop up that asks if its ok by user to use cookies = true, otherwise
 //flag false
 //below is the key for store mechanism you're using (based on docs)
 //different for mongo and each different backend tool 
 store: new KnexSessionStore ({
   // knex(knexConfig.development);
   knex: require('../database/dbConfig.js'),
   createtable: true,
clearInterval: 1000 * 60 *20, //clearn out expire sessions in milliseconds
 })
}

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());


server.use('/api', usersRouter);

server.get('/', (req, res) => {
  const username = req.session.username || 'stranger';
  res.send(`Hello ${username}!`);
});

server.get('/logout', (req, res )=> {
    if (req.session) {
      req.session.destroy(err => {
        if(err) {
          res.send('error signing out');
        } else {
          res.send('bye');
        }
      });
    }else{
      res.send('already logged out');
    }
    
    });

module.exports = server;
