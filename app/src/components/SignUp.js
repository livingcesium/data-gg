import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleSignUp } from '../handles'; // Ensure this path is correct based on your project structure

function SignUp() {
  const navigate = useNavigate();

  return (
    <div>
        <h1>Sign Up</h1>
        <form onSubmit={(handleSignUp) => handleSignUp(handleSignUp, () => navigate('/log-in'))}>
            <label htmlFor="name-first">First Name</label><br/>
            <input type="text" id="name-first" name="firstname"/><br/>
            <label htmlFor="name-last">Last Name</label><br/>
            <input type="text" id="name-last" name="lastname"/><br/>
            <br/>
            <label htmlFor="userid">User ID</label><br/>
            <input type="text" id="userid" name="username"/><br/>

            <label htmlFor="password">Password</label><br/>
            <input type="password" id="password" name="password"/><br/>
            <br/>
            <input type="submit" value="Submit"/>

            <Link to="/log-in">Already have an account?</Link><br/>
            <Link to='/home'>Go Home</Link>
        </form>
    </div>
    );
}

export default SignUp;