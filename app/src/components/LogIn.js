import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../handles'; // Ensure this path is correct based on your project structure

function LogIn() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={(event) => handleLogin(event, () => navigate('/home'))}>
        <label htmlFor="userid">User ID:</label><br/>
        <input type="text" id="userid" name="username"/><br/>
        <label htmlFor="password">Password:</label><br/>
        <input type="password" id="password" name="password"/><br/>
        <br/>
        <input type="submit" value="Submit"/>
        <Link to="/sign-up">Don't have an account?</Link><br/>
        <Link to='/home'>Go Home</Link>
      </form>
    </div>
  );
}

export default LogIn;