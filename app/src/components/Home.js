import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from './Nav'
import SearchBar from './SearchBar'
import Downloaded from './Downloaded'
import { handleSignOut, handleUpload, handleCreateTags, handleGetTag, handleGetTags, handleAttachTags } from '../handles'
import { Grid, Button, TextField, CircularProgress } from '@mui/material'
import { Autocomplete, Chip } from '@mui/material'
import { styled } from '@mui/system'
import axios from 'axios'


function Home() {
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('loggedInUser')
  const redirectAfterSignOut = (event) => handleSignOut(event, () => navigate('/log-in'))
  const [uploadOpen, setUploadOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    axios.get(`http://localhost:${process.env.REACT_APP_BACK_PORT||9000}/getAdmin`, { params: { user_id: loggedIn } })
        .then(response => {
            if (response.data) {
                setIsAdmin(true);
                localStorage.setItem('admin', response.data.user_id);
            }
        })
        .catch(error => {
            console.error('There was an error fetching admin data!', error);
        })
  }, [])
  

  const elements = loggedIn ? 
    <Grid container  justifyContent={'center'}>
      
      <Grid xs direction={'column'} container item justifyContent={'center'} alignItems={'stretch'}>
        <h2>Your Downloads</h2>
        <Downloaded user_id={loggedIn}/>
      </Grid>

      <Grid xs={6} direction={'column'} container item justifyContent={'center'} alignItems={'center'}>
        <p>{`Welcome ${loggedIn}!`}</p>
        <button type="button" onClick={redirectAfterSignOut}>Sign Out</button> { }
        <button type="button" onClick={() => setUploadOpen(true)}>Upload Data</button><br/>
      </Grid>

      <Grid xs direction={'column'} container item justifyContent={'center'} alignItems={'center'}>
        
      </Grid>

    </Grid>
  : 
    <>
      <p>Already have an account? <Link to="/log-in">Login</Link></p> <br/>
      <p>If not, sign up <Link to="/sign-up">here</Link>!</p>
    </>;

  return (
    <div>
      {uploadOpen && <UploadPrompt user_id={loggedIn} closePrompt={() => {setUploadOpen(false)}}/>}
      <Nav loggedIn={loggedIn != null} signOut={redirectAfterSignOut} isAdmin={isAdmin}/>
      <h1>Home</h1>
      {elements}<br/>
      <SearchBar />
    </div>
  );
}


const Prompt = styled(Grid)({
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundColor: `rgba(0, 0, 0, 0.5)`,
  zIndex: 1,
})

const Backdrop = styled(Grid)({
  backgroundColor: 'white',
  padding: '2em',
  borderRadius: '1em',
  width: 'fit-content',
  height: 'fit-content',
})

function UploadPrompt({closePrompt, user_id}){
  const [file, setFile] = useState(null)
  const [tags, setTags] = useState({options: [], selected: []})
  const [assigns, setAssigns] = useState(new Map()) // {tag obj -> value}

  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    axios.get(`http://localhost:${process.env.REACT_APP_BACK_PORT || 9000}/getTags`, {params: { name: { $ne: 'name' }}})
    .then(res => {
      console.log(res.data)
      setTags({...tags, options: res.data})
    })
    .catch(error => {
      
    })
  }, []);


  const checkTags = async (tagPairs) => {
    const existing = []
    const newTags = []
    for (const tagPair of tagPairs) {
      const tag = await handleGetTag({name: tagPair.tag.name})
      if (tag) {
        existing.push({tag: tag, value: tagPair.value})
      } else {
        newTags.push(tagPair)
      }
    }
    return {existing: existing, new: newTags}
  }

  const removeTag = (tag) => {
    setTagOptions(tagOptions.map(group => group.filter((tagPair) => tagPair.tag._id !== tag._id)))
  }
  
  return (
    <Prompt container justifyContent="center" alignItems="center">
      
      {loading ? <CircularProgress/> : <Backdrop item>
        <h1>Upload Data</h1>
        <form onSubmit={ async (event) => {
          console.log(user_id)
          event.preventDefault()
          setLoading(true)
          const nameTag = {tag: {name: "name", description:""/* normally get this value from a field */}, value: event.target.given_name.value}
          
          console.log("<<DD>>", [...Array.from(assigns).map(([tag, value]) => ({tag: tag, value: value})) , nameTag])
          const tagPairs = await checkTags([...Array.from(assigns).map(([tag, value]) => ({tag: tag, value: value})) , nameTag]) // chosen tags => { existing: [...], new: [...] }
          console.log(tagPairs)
          const uploaded = await handleUpload(file, user_id)
          console.log(uploaded)
          
          const created = await handleCreateTags(tagPairs.new, user_id)
          console.log(tagPairs.existing)
          try {
            handleAttachTags(tagPairs.existing.concat(created), uploaded._id)
          } catch (error) { throw error }
          setLoading(false)
          closePrompt()}}
        >

          <h3>{"Files < 16 MB supported"}</h3>
          <label>
            <input type="file" onChange={(event) => {
              console.log(event.target.files[0])
              setFile(event.target.files[0])
            }}/>
          </label>
          <input type="text" placeholder="Give your dataset a name" name="given_name"/><br/>
          
          <br/><Autocomplete
            multiple
            id="tags-select"
            options={tags.options}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  {option.name}
                </li>
              )}
            /* MUI tags, not our tags */
            renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option._id} label={option.name} />
              ))}
            renderInput={(params) => <TextField {...params} label="Tags" />}
            onChange={(event, value) => {
              event.preventDefault()
              console.log(value)
              if (value) {
                setTags({...tags, selected: value})
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                setTags({...tags, selected: [...tags.selected, {name: event.target.value, new : true}]})
              }
            }}
          /> <br/>

          <Grid container justifyContent="center" alignItems="center">
            {tags.selected.map((tag, index) => (
              <Grid item key={`${index}-${tag.name}`}>
                <TextField
                  label={`${tag.name} ${tag.new ? "(new)" : ""}`}
                  value={ assigns.get(tag) || "" }
                  onChange={(event) => {
                    const value = event.target.value
                    setAssigns((prev) => new Map(prev.set(tag, value)))
                  }}/>
              </Grid>))
            }
          </Grid>


          <button type="submit" disabled={!file}>Upload</button><br/>  

        </form><br/>
        <button onClick= { () => {
          setFile(null)
          setTags({})
          closePrompt()
        }}>Cancel</button>
      </Backdrop>}
    </Prompt>
  )
} 





export default Home;