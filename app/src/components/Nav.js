import React from "react";
import { Outlet, Link } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <nav>
      <Link to='/log-in'>Log In</Link>
      <Link to='/sign-up'>Sign Up</Link>
      <Link to='/Admin'>Admin</Link>
      <Link to='/data'>Browse</Link>
      </nav>

      <Outlet />
    </>
  );
};

export default Nav;

