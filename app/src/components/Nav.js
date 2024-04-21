import { Link } from 'react-router-dom';


export default function Nav({loggedIn, signOut}) {
    const elements = loggedIn ?
      <>
        <button onClick={signOut}>Sign Out</button>
      </>
    :
      <>
        <Link to='/log-in'>Log In</Link>
        <Link to='/sign-up'>Sign Up</Link>
      </>
  
    return (
      <nav>
        <Link to='/data'>Browse</Link>
        {elements}
      </nav>
    )
}