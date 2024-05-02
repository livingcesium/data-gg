import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import Home from './components/Home'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import DataView from './components/DataView'
import Admin from './components/Admin'
// import CreateProject from './components/CreateProject';
// import CreateTeam from './components/CreateTeam';
// import TeamsView from './components/TeamsView';
// import TeamRoster from './components/TeamRoster';
// import NewUserStory from './components/NewUserStory';
import { BrowserRouter, Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'


const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/data" element={<DataView />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      {/* <Route path="/create-project" element={<CreateProject />} />
      <Route path="/teams" element={<TeamsView/>} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/roster" element={<TeamRoster />} />
      <Route path="/user-story" element={<NewUserStory />} /> */}
      <Route path="/" element={<Home />} />
    </>
  )
);

root.render(
  <React.StrictMode>
    <RouterProvider router = {router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);