
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
      return knex('users').insert([
        {username:'Sade', password:'pass',  department:'HR'},
        {username:'June', password:'pass2',  department: 'Marketing'},
        {username:'Tom', password:'pass3',  department: 'Finance'},
        {username:'Wade', password:'pass4',  department:'Communication'},
        {username:'Sal', password:'pass1',  department: 'Engineering'},
        {username:'Rich', password:'pass2',  department: 'Finance'},
        {username:'Jen', password:'pass4',  department:'HR'},
        {username:'Tony', password:'pass1',  department: 'Marketing'},
        {username:'Susan', password:'pass2',  department: 'Engineering'},
        {username:'Allison', password:'pass4',  department:'HR'},
        {username:'Jim', password:'pass1',  department: 'Engineering'},
        {username:'Hal', password:'pass2',  department: 'Finance'},
      ]);
  
};
