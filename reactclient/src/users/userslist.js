import React from 'react';
import axios from 'axios';
import requiresAuth from '../auth/requiresAuth';


class Users extends React.Component {
    state = {
        users: []
    };


render() {
    return (
        <div>
        <h2>Users</h2>
        <ul>
            {this.state.users.map(u=> (
                <li key={u.id}>{u.username}, {u.department}</li>
            ) )}
            </ul>
      </div>
    );
}

componentDidMount () {
    const endpoint = '/users';
    // const endpoint = 'http://localhost:5000/api/users';

        //MUST MUST MUST GRAB THE TOKEN FROM MEMORY, LOCAL STORAGE, (WHEREVER STORED)
    //AND MUST ASSEMBLE THE HEADERS LIKE BELOW FOR EACH CLIENT 
    // const token = localStorage.getItem('jwt');




    // const requestConfig = {
    //     headers: {
    //         authorization: token,
    //     },
    // };
    axios
    // .get(endpoint, requestConfig)
    .get(endpoint)
    .then(res => {
        //client passes back token each time
       
        this.setState({users: res.data});
    })
    .catch(err=> console.error(err));
}
}

export default requiresAuth(Users);

//what if we have 20 more users that need tokens to be sent 
//Authenticated is whats actually is rendered if using requiresAuth HOC function
