import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleSignUp } from '../handles'; // Ensure this path is correct based on your project structure
import './App.css';

function SignUp() {
  const navigate = useNavigate();

  // Update the form when we submit
  const handleSubmit = (event) => {
    event.preventDefault(); 
    handleSignUp(event, () => navigate('/log-in')); 
  };

  return (
    <div className="AppContainer">
        <h1 className="Text">Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <input className="Text1" type="text" name="firstname" placeholder="First Name" /><br/>
                <input className="Text1" type="text" name="lastname" placeholder="Last Name" /><br/>
                <input className="Text1" type="text" name="username" placeholder="Username" /><br/>
                <input className="Text1" type="password" name="password" placeholder="Password" /><br/>
                <button type="submit" className="SubmitButton">Sign Up</button>
            </div>
            <Link to="/log-in">Already have an account? Sign In</Link><br/>
            <Link to='/home'>Go Home</Link>
        </form>
    </div>
  );
}

export default SignUp;
