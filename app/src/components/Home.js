import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from './Nav'
import { handleSignOut } from '../handles'
import { Grid, Button, TextField } from '@mui/material'
import { styled } from '@mui/system'


function Home() {
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('loggedInUser')
  const redirectAfterSignOut = (event) => handleSignOut(event, () => navigate('/log-in'))


  const elements = loggedIn ? 
    <>
      <p>{`Welcome ${loggedIn}!`}</p>
      <SearchBar />
      <button type="button" onClick={redirectAfterSignOut}>Sign Out</button>
    </>
  : 
    <>
      <p>Already have an account? <Link to="/log-in">Login</Link></p> <br/>
      <p>If not, sign up <Link to="/sign-up">here</Link>!</p>
    </>;

  return (
    <div>
      <Nav loggedIn={loggedIn != null} signOut={redirectAfterSignOut}/>
      <h1>Home</h1>
      {elements}
    </div>
  );
}

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
    event.preventDefault()
    console.log(values)
    navigate(`/data?query=${values.query}&tags=${values.selected.join(',')}`) // TODO: Make use of this in DataView.js to display results
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