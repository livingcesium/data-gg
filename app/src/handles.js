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

export const handleUpload = async (file, uploader_id) => {
  const data = new FormData();
  data.append('file', file);
  
  try {
    const res = await axios.post(`http://localhost:${backendPort}/uploadFile/${uploader_id}`, data, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
    alert('Error in uploading file');
  }

};

export const handleCreateTags = async (tagPairs, author_id) => {
  if (!tagPairs.length)
    return []

  const bulk = tagPairs.length > 1
  const endpoint = `http://localhost:${backendPort}/createTag`
  const data = new FormData()
  if (!bulk){
    data.append('author_id', author_id)
    data.append('name', tagPairs[0].tag.name)
    tagPairs[0].tag.description && data.append('description', tagPairs[0].tag.description)
  } else 
    data.append('tags', JSON.stringify(tagPairs.map(tagPair => ({...tagPair.tag, author_id: author_id}) )))
  try {
    const res = await axios.post(endpoint, data)
    console.log(res.data)
    return tagPairs.map(tagPair => ({ tag: bulk ? res.data[tagPair.tag.name] : res.data, value: tagPair.value }))
    
  } catch (err) {
    console.log(err)
    alert('Error in creating tag')
  }   
}

export const handleAttachTags = (tagPairs, file_id) => {
  if (!tagPairs.length)
    return
  const data = new FormData()

  if (tagPairs.length > 1)
    data.append('taggings', JSON.stringify(tagPairs.map(pair => ({ tag_id: pair.tag._id, value: pair.value || ``, file_id: file_id}) )))
  else {
    data.append('tag_id', tagPairs[0].tag._id)
    data.append('value', tagPairs[0].value || ``)
    data.append('file_id', file_id)
  }
  axios.post(`http://localhost:${backendPort}/tagFile`, data)
    .then((res) => {
      console.log(res)
      alert('Tags attached to file')
    })
    .catch((err) => {
      console.log(err)
      alert('Error in attaching tags')
    })
}

export const handleGetTag = async (query) => {
  try {
    const res = await axios.get(`http://localhost:${backendPort}/getTag`, {params: query});
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
    alert('Error in getting tags');
  }
}

export const handleGetTags = async (query) => {
  try {
    const res = await axios.get(`http://localhost:${backendPort}/getTags`, {params: query});
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
    alert('Error in getting tags');
  }
}