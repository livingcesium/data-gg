import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';
import { Grid, Box, TextField, Button } from '@mui/material';

function Admin() {
    const [transactions, setTransactions] = useState([]);
    const [fileId, setFileId] = useState('');
    const isAdmin = localStorage.getItem('admin') ? true : false;

    useEffect(() => {
      axios.get(`http://localhost:${process.env.REACT_APP_BACK_PORT || 9000}/getUsersTransactions`)
          .then(response => {
              setTransactions(response.data);
          })
          .catch(error => {
              console.error('There was an error getting the transactions!', error);
          });
    }, []);

    const handleFileIdSubmit = () => {
        if (fileId) {
            axios.post(`http://localhost:${process.env.REACT_APP_BACK_PORT || 9000}/manageFile`, { params: { file_id: fileId }})
                .then(response => {
                    alert('File processed successfully!');
                    
                })
                .catch(error => {
                    console.error('Error processing file ID:', error);
                    alert('Failed to process file ID.');
                });
        }
    };

    return (
      isAdmin && <div className="AppContainer">
        <h1 className='Text'>Admin Dashboard - Transactions</h1>
        <Box maxWidth={1500} margin="auto">
            <Grid container alignItems="stretch" justifyContent="space-evenly" spacing={6}>
                <Grid item xs={12}><Link to='/home'>Go Home</Link></Grid>
                <Grid item xs={12} style={{ marginTop: 20, marginBottom: 20 }}>
                    <TextField
                        label="Enter File ID"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                        variant="outlined"
                        size="small"
                        style={{ marginRight: 10 }}
                    />
                    <Button onClick={handleFileIdSubmit} variant="contained" color="primary">
                        Submit File ID
                    </Button>
                </Grid>
                {transactions.map((transaction, index) => (
                    <Grid item key={index} xs={12} md={6} className="List">
                        <div><strong>Transaction {index + 1}: </strong>{transaction.up ? "Upload" : "Download"}</div>
                        {`${transaction.up ? "Upload": "Download"}`}
                        <div><strong>User Name:</strong> {transaction.user_id ? `${transaction.user_id.firstname} ${transaction.user_id.lastname}` : 'N/A'}</div>
                        <div><strong>Timestamp:</strong> {new Date(transaction.timeStamp).toLocaleString()}</div>
                        <div><strong>File ID:</strong> {transaction.file_id._id}</div>
                    </Grid>
                ))}
            </Grid>
        </Box>
      </div>
    );
}

export default Admin;