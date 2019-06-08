import React from 'react';
import {Route, NavLink, withRouter} from 'react-router-dom';

import './App.css';
import Signin from './auth/signin';
import Users from './users/userslist';

//must import withRouter and Wrap App with it as HOC 
//see below so that React Router props is extended to App
// since 

function App(props) {
  //pass in props in App to use props in logout function below
function logout() {
  localStorage.removeItem('jwt');
 props.history.push('/Signin');
}

  return (
    <>
      <header>
   <NavLink to ="/Signin">Login</NavLink>
   &nbsp; | &nbsp;
   <NavLink to ="/Users">Users</NavLink>
   &nbsp; | &nbsp;
   <button type="button" onClick={logout}>Log Out</button>
   </header>
    <main>
      <Route path='/Signin' component={Signin}></Route>
      <Route path='/Users' component={Users}></Route>
    </main>
    
    </>
  );
}
//must import withRouter and Wrap App with it as HOC 
//see below so that React Router props is extended to App
// since 
export default withRouter(App);
