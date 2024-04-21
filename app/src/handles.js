import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendPort = process.env.BACK_PORT || 9000;

export const handleLogin = (event, onSuccess) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  axios.get(`http://localhost:${backendPort}/getUser`, {params: data})
    .then((res) => {
      if(res.data){
        alert('Logged in');
        localStorage.clear();
        localStorage.setItem('loggedInUser', res.data._id);
        onSuccess();
      }
      else
        alert('Wrong credentials');
    })
    .catch((err) => {
      console.log(err);
      alert('Error in Login');
    });
};

export const handleSignUp = (event, onSuccess) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  axios.post(`http://localhost:${backendPort}/createUser`, data)
    .then((res) => onSuccess())
    .catch((err) => {
      console.log(err);
      alert('Error in Sign Up');
    });
};

export const handleSignOut = (event, redirect) => {
    event.preventDefault();
    localStorage.clear();
    if(typeof redirect === 'function')
      redirect();
  };

export const handleUpload = (event, file_data) => {
    event.preventDefault()
    axios.post(`http://localhost:${backendPort}/uploadFile`, file_data)
        .then((res) => {
        console.log(res)
        alert('File uploaded into database')
        })
        .catch((err) => {
        console.log(err)
        alert('Error in uploading file')
        })

};


