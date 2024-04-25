import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';


function Admin() {
    const [transactions, setTransactions] = useState([]);
  
    useEffect(() => {
      axios.get('http://localhost:9000/getTransactions')
          .then(response => {
              setTransactions(response.data);
          })
          .catch(error => {
              console.error('There was an error getting the transactions!', error);
          });
    }, []);
  
    return (
      <div className="AppContainer">
        <h1 className='Text'>Transactions</h1>
        <div><Link to='/home'>Go Home</Link></div>
        {transactions.map((transaction, index) => (
            
          <div className="List" key={index}>
            <div><strong>Transaction {index + 1}</strong></div>
            <div> ___________________________________</div>  
            <div><strong>User ID:</strong> {transaction.user_id ? transaction.user_id._id : 'N/A'}</div>
            <div><strong>User Name:</strong> {transaction.user_id ? `${transaction.user_id.firstname} ${transaction.user_id.lastname}` : 'N/A'}</div>
            <div><strong>File ID:</strong> {transaction.file_id}</div>
            <div><strong>Timestamp:</strong> {new Date(transaction.timeStamp).toLocaleString()}</div>
            <div><strong>Uploaded:</strong> {transaction.up ? "Yes" : "No"}</div>
          </div>
        ))}
        
      </div>

      
    );
  }

  export default Admin;