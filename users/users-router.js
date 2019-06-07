const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model.js');
const secrets = require('../config/secret.js');
const restricted = require('../auth/restricted-middleware.js');

// for endpoints beginning with /api/
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.session.username = user.username;
     //the cookie is sent by the express-session library 
     const token= generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials, You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


// router.get('/users', restricted, checkRole('Finance'), (req, res) => {
//     Users.find()
//       .then(users => {
//         res.json(users);
//         // res.json({users, decodedToken: req.decodedToken}); this will send back decoded token object
//       })
//       .catch(err => res.send(err));
//   });
  


//destroys session which invalidates key


//HINT FOR functions keep end in mind

//there can be 200 servers configured to work with the token, can scale as many servers
//as you want -- versus only 1 server to use for sessions, 
//also don't need seperate server for sessions
//token is more scalable for serverside.  
//Oath2 different kinds of token 
//dont want access type tokens in URL 
//stripe is 3rd party server that can handle sensitive data like cc info
//NEVER STORE SENSITIVE INFO IN TOKEN, EVEN IF ANOTHER PARTY DOESN'T HAVE 
//THE SIGNATURE, CAN STILL SEE THE PAYLOAD DATA WITHOUT SIG KEY

// router.get('/users', restricted, checkRole('Finance'), async (req, res) => {
//   try{
//     //server trusts the token to store user data..so can use acces token to reveal user data (user roles in this case)
//     const dept = await Users.findByDept(req.decodedToken.roles);
//   if (dept) {
//     res.status(200).json(dept);
//   } else {
//     res.status(403).json({ message: 'Forbidden not allowed to see User Roles' });
//   }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: 'We ran into an error retrieving the users departments' });
//   }
//   });

  router.get('/users', restricted, async (req, res) => {
    try{
      //server trusts the token to store user data..so can use acces token to reveal user data (user roles in this case)
      const dept = await Users.findByDept(req.decodedToken.roles);
    if (dept) {
      res.status(200).json(dept);
    } else {
      res.status(403).json({ message: 'Forbidden not allowed to see User Roles' });
    }
    } catch (error) {
      res
        .status(500)
        .json({ message: 'We ran into an error retrieving the users departments' });
    }
    });
  
  




  function generateToken(user) {
    //payload is data
    //nomrally good to store secret in different file location
    const payload = {
      //docs will show you options for your payload, secret ,options 
      //subject - who is this token identifying
      //docs: npm jsonwebtoken
      subject: user.id, //what the token is describing
      username: user.username,
      roles: user.department, //normally would be found in db user.roles
      };
  
    
  
      const options = {
        expiresIn: '1h',
      };
  
    return jwt.sign(payload, secrets.jwtSecret, options)
  }

  function checkRole(role) {
    return function (req, res, next){
      //where is roles going to be stored?
      //access tokens are supposed to be trusted, dont need to search elsewhere
  //includes is method can call on array
  //&& operators allows you to check presence of each 
  //roles normally would be on table
      if(req.decodedToken && 
        req.decodedToken.roles && 
        req.decodedToken.roles.includes(role)
       ){
       next();
    } else {
        res.status(403).json({message: "can't touch this!"});
    }
  };
  }

module.exports = router;
