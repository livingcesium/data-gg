import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../handles'; // Ensure this path is correct based on your project structure

function LogIn() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={(event) => handleLogin(event, () => navigate('/home'))}>
        <div>
        <input className = "Text1" type="text" id="userid" name="username" placeholder = "User ID" /><br/>

        <input className = "Text1" type="password" id="password" name="password" placeholder = "Password"/><br/>
        
        <input className = "SubmitButton" type="submit" value="Submit"/>

        </div>
        <Link to="/sign-up">Don't have an account?</Link><br/>
        <Link to='/home'>Go Home</Link>
      </form>
    </div>
  );
}

export default LogIn;