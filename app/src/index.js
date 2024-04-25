import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './components/Home'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import DataView from './components/DataView'
import Nav from './components/Nav'
import Admin from './components/Admin'
import NoPage from './components/NoPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Nav />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/data" element={<DataView />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Home" element={<Home />} />
            <Route path="*" element={<NoPage />} />

        </Routes>
      </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);