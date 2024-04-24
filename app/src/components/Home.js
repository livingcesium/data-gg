import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from './Nav'
import { handleSignOut, handleUpload, handleCreateTags, handleGetTag, handleGetTags, handleAttachTags } from '../handles'
import { Grid, Button, TextField } from '@mui/material'
import { styled } from '@mui/system'


function Home() {
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('loggedInUser')
  const redirectAfterSignOut = (event) => handleSignOut(event, () => navigate('/log-in'))
  const [uploadOpen, setUploadOpen] = useState(false)

  const elements = loggedIn ? 
    <>
      <p>{`Welcome ${loggedIn}!`}</p>
      <button type="button" onClick={() => setUploadOpen(true)}>Upload Data</button><br/>
      <br/><SearchBar />
      <button type="button" onClick={redirectAfterSignOut}>Sign Out</button>
    </>
  : 
    <>
      <p>Already have an account? <Link to="/log-in">Login</Link></p> <br/>
      <p>If not, sign up <Link to="/sign-up">here</Link>!</p>
    </>;

  return (
    <div>
      {uploadOpen && <UploadPrompt user_id={loggedIn} closePrompt={() => {setUploadOpen(false)}}/>}
      <Nav loggedIn={loggedIn != null} signOut={redirectAfterSignOut}/>
      <h1>Home</h1>
      {elements}
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
  const [tagOptions, setTagOptions] = useState([])
  const includeTag = ({tag, value}) => {
    console.log(tagOptions)
    setTagOptions([...tagOptions, {tag: tag, value: value}])
  }
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
      <Backdrop item>
        <h1>Upload Data</h1>
        <form onSubmit={ async (event) => {
          console.log(user_id)
          event.preventDefault()
          const nameTag = {tag: {name: "name", description:""/* normally get this value from a field */}, value: event.target.given_name.value}
          
          const tagPairs = await checkTags([...tagOptions, nameTag]) // chosen tags => { existing: [...], new: [...] }
          
          const uploaded = await handleUpload(file, user_id)
          console.log(uploaded)
          
          const created = await handleCreateTags(tagPairs.new, user_id)
          console.log(tagPairs.existing)
          try {
            handleAttachTags(tagPairs.existing.concat(created), uploaded._id)
          } catch (error) { throw error }
          
          closePrompt()
        }}>
          <label>
            <input type="file" onChange={(event) => {
              console.log(event.target.files[0])
              setFile(event.target.files[0])
            }}/>
          </label>
          <input type="text" placeholder="Give your dataset a name" name="given_name"/><br/>
          <button type="submit" disabled={!file}>Upload</button><br/>
        </form>
      </Backdrop>
    </Prompt>
  )
} 





// Search Bar Component
const Bar = styled(TextField)({ // Styling
  minWidth: '123ch',
})
const Submit = styled(Button)({
  height: '100%',
})

function SearchBar() {
  const [values, setValues] = useState({
    query: '',
    tags: [],
    selected: []
  })

  const updateForm = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value
    })
  }

  const navigate = useNavigate()
  const handleSubmit = (event) => {
    const params = new URLSearchParams({
      query: values.query,
    })
    values.selected.forEach(tag => params.append('tags', tag))
    event.preventDefault()
    console.log(values)
    navigate(`/data?${params.toString()}`) // TODO: Make use of this in DataView.js to display results
  }

  return (
    <div className='home-search'>
      <form noValidate autoComplete='off'>
        <Grid container spacing={2} justifyContent = {'center'} alignItems={'stretch'}>
          <Grid item>
            <Bar
              id="search-bar"
              label="Search Datasets"
              variant="outlined"
              type="search"
              value={values.query}
              onChange={updateForm("query")}/>
          </Grid>

          <Grid item>
            <Submit
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}/>
          </Grid>

        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            {/*
              Tag Dropdown
             */}
          </Grid>
          {/* Map selected tags to grid items, with a button to remove each tag */}
        </Grid>
      </form>
    </div>
  )
}

export default Home;