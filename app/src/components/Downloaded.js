import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ListItem, ListItemText, Box, Button, Grid, TextField } from '@mui/material'
import { FixedSizeList as List } from 'react-window'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/system'


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

function renderRow(props, downloads, sourced, setPrompt) {
    const { index, style } = props
    return (
        <ListItem style={style} key={index} component="div">
            <ListItemText primary={downloads[index].file_id.file_name} secondary={downloads[index].file_id.timeStamp} />
            {typeof sourced[downloads[index].file_id] == "undefined" ? <Button onClick={() => setPrompt(true)}>Source</Button> : <></>}
        </ListItem>
    );
}

// list of files downloaded by user
export default function Downloaded({user_id : user_id}) {
    const [prompt, setPrompt] = useState(false);
    const [downloads, setDownloads] = useState([]);
    const [sourced, setSourced] = useState({});
    useEffect(() => {
        axios.get(`http://localhost:${process.env.REACT_APP_BACK_PORT||9000}/getTransactions`, { params: { user_id: user_id, up: false } })
            .then(response => {
                setDownloads(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching downloads!', error);
            });
        axios.get(`http://localhost:${process.env.REACT_APP_BACK_PORT||9000}/getUserSources`, { params: { user_id: user_id } })
            .then(response => {
            setSourced(response.data.reduce(({map, source}) => ({...map, [source.file_id]: source}), {}));
            })
            .catch(error => {
            console.error('There was an error fetching user sources!', error);
            });
    }, [])
    
    return (
        <>
            {prompt && <SourcePrompt file_id={prompt.file_id} user_id={user_id} closePrompt={() => setPrompt(false)} />}
            <Box sx={{ maxWidth: '30vw' }}>
                {console.log(downloads)}
                <List
                    length={downloads.length}
                    type='uniform'
                    height={500}
                    itemSize={35}
                    itemCount={downloads.length}

                >
                    {(props) => renderRow(props, downloads, sourced, setPrompt)}
                </List>
            </Box>
        </>
    );

    function SourcePrompt({file_id, user_id, closePrompt}) {
        const [link, setLink] = useState('')

        const handleSubmit = () => {
            axios.post(`http://localhost:${process.env.REACT_APP_BACK_PORT||9000}/addUserSource`, { user_id: user_id, file_id: file_id, link: link })
                .then(response => {
                    console.log(response.data)
                    closePrompt()
                })
                .catch(error => {
                    console.error('There was an error adding a source!', error);
                });
        }

        return (
            <Prompt container justifyContent="center" alignItems="center">
                <Backdrop>
                    <h1>Become a Source</h1>
                    <p>Would you like to become a source for this file?</p><br/>
                    <TextField
                        label="Link"
                        variant="outlined"
                        fullWidth
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <IconButton onClick={handleSubmit}>Submit</IconButton>
                    <IconButton onClick={closePrompt}>Close</IconButton>
                </Backdrop>
            </Prompt>
        );
    }
}