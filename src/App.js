import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Welcome from './components/Welcome';
import About from './components/About';
import Footer from './components/Footer';
import Error from './components/Error'
import Blog from './components/Blog'
import './App.css';
import axios from 'axios'


const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = localStorage.getItem('jwtToken');
  return <Route {...rest} render={(props) => {
      return user ? <Component {...rest} {...props} /> : <Redirect to="/login" />
    }}
  />;
}

function App() {
  
  
  axios.get(process.env.REACT_APP_SERVER_URL).then(response => {
    // console.log('🤗')
    // console.log(response)
  }) 
  
  
  ////////// set state values
  let [currentUser, setCurrentUser] = useState("");
  let [isAuthenticated, setIsAuthenticated] = useState(true);
  
  
  
  useEffect(() => {
    let token;
    if (!localStorage.getItem('jwtToken')) {
      setIsAuthenticated(false);
    } else {
      token = jwt_decode(localStorage.getItem('jwtToken'));
      setAuthToken(localStorage.jwtToken);
      setCurrentUser(token);
      setIsAuthenticated(true);
    }
  }, []);

  const nowCurrentUser = (userData) => {
    console.log('nowCurrentUser is working...');
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (localStorage.getItem('jwtToken')) {
      localStorage.removeItem('jwtToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  }


  console.log(currentUser);
  axios.get(`http://localhost:8000/blog/allBlogs`)
  .then(response => {
      console.log(response.data)
  })
  console.log('Authenicated', isAuthenticated);

  return (
    <div>
      <Navbar handleLogout={handleLogout} isAuth={isAuthenticated} />
        <Switch>
          <Route path="/signup" component={ Signup }/>
          <Route 
            path="/login" 
            render={ (props) => <Login {...props} nowCurrentUser={nowCurrentUser} 
            setIsAuthenticated={setIsAuthenticated} user={currentUser}/>} 
          />
          <Route path='/error' component={ Error } />
          <Route path="/about" component={ About } />


          <PrivateRoute 
            path="/profile" component={ Profile } user={currentUser} 
            render={ <Profile  user={currentUser} />}
          />
          <Route
              exact path="/" 

              render={ () => <Welcome user={currentUser}  />}

          />
          <Route 
          exact path="/blog/:id"  
          render= {() => <Blog user={currentUser} /> }
          />
        </Switch>
      <Footer />
    </div>
  );
}

export default App;
