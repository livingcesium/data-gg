import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { Grid, Button, TextField, Container } from '@mui/material'
import { styled } from '@mui/system'
import axios from 'axios'

// Search Bar Component
const Bar = styled(TextField)({ // Styling
    minWidth: '123ch',
})
const Submit = styled(Button)({
    height: '100%',
})
  
export default function SearchBar() {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        query: '',
        tags: [],
        selected: []
    })

    useEffect(() => {
        axios.get(`http://localhost:${process.env.REACT_APP_BACK_PORT || 9000}/getTags`, {params: { name: { $ne: 'name' }}})
            .then(res => {
            setValues({...values, tags: res.data})
            })
            .catch(error => {
            console.error('Error fetching tags:', error);
            })
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault()
        const params = new URLSearchParams({
            query: values.query,
        })
        params.append('tags', JSON.stringify(values.selected.map((tagData) => ({ tag: {name: tagData.name, _id: tagData._id}, value: tagData.value }))))
        console.log("SUBMITING:", values)
        navigate(`/data?${params.toString()}`) // TODO: Make use of this in DataView.js to display results
    }

    const updateForm = (name) => (selectedOption) => {
        setValues({
            ...values,
            [name]: selectedOption
        })
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
                onChange={(event) => updateForm('query')(event.target.value)}/>
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
                <label htmlFor="tags">Tags:</label><br/>
                <Select
                    isMulti
                    value={values.selected}
                    onChange={updateForm("selected")}
                    options={values.tags.map((tag) => ({name: tag.name, _id: tag._id, value: tag.name}))}
                    getOptionLabel={(option) => option.name}
                />
            </Grid>
            {/* Map selected tags to grid items, with a small text field to enter a value and a button to remove each tag */
            values.selected.map((tag, index) => (
                <Grid item key={index}>
                    <Container>
                        <p>{tag.name}</p>
                        <TextField
                            id={tag._id}
                            label="Value"
                            variant="outlined"
                            onChange={(event) => {
                                const newSelected = values.selected
                                newSelected[index].value = event.target.value
                                setValues({...values, selected: newSelected})
                            }}/>
                    </Container>
                </Grid>
            ))
            }
          </Grid>
        </form>
      </div>
    )
}