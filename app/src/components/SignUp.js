import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleSignUp } from '../handles'; // Ensure this path is correct based on your project structure
import './App.css';


function SignUp() {
  const navigate = useNavigate();

  return (
    <div>
        <h1>Sign Up</h1>
        <form onSubmit={() => handleSignUp(handleSignUp, () => navigate('/log-in'))}>

            <div> 
            <input className = "Text1" type="text" id="name-first" name="firstname" placeholder = "User ID" /><br/>
            
            <input className = "Text1" type="text" id="name-last" name="lastname" placeholder = "First Name" /><br/>
          
            <input className = "Text1" type="text" id="userid" name="username" placeholder = "Last Name" /><br/>

            <input className = "Text1" type="password" id="password" name="password" placeholder = "Password" /><br/>
           
            <input className = "SubmitButton" type="submit" value="Submit"/>
            </div>
            <Link to="/log-in">Already have an account?</Link><br/>
            <Link to='/home'>Go Home</Link>
        </form>
    </div>
    );
}

export default SignUp;