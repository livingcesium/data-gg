import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Nav({ loggedIn, signOut, isAdmin }) {
  const elements = loggedIn ? (
    <>
      {isAdmin && <Link to='/admin' className="NavText"><u>Admin</u></Link>}
      <button className="SubmitButton" onClick={signOut}>Sign Out</button>
    </>
  ) : (
    <>
      <Link to='/log-in' className="NavText">Log In</Link>
      <Link to='/sign-up' className="NavText">Sign Up</Link>

      <Outlet />
    </>
  );

  return (
    <>
      <nav>
        <Link to='/data' className="NavText">Browse</Link>
        {elements}
      </nav>

      <Outlet />
    </>
  );
}
