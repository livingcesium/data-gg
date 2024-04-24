import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Admin() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9000/getTransactions')
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching transactions!', error);
            });
    }, []);

    return (
        <div className="AppContainer">
            <h1 className='Text'>Transactions</h1>
            {transactions.map((transaction, index) => (

                <div className="List" key={index}>

                    <div><strong>Transaction {index + 1}</strong></div> {/* Numbers each transaction in bold */}
                    <div> ___________________________________</div>  
                    <div><strong>User ID:</strong> {transaction.user_id._id}</div>
                    <div><strong>User Name:</strong> {transaction.user_id.firstname} {transaction.user_id.lastname}</div>
                    <div><strong>File ID:</strong> {transaction.file_id}</div>
                    <div><strong>Timestamp:</strong> {new Date(transaction.timeStamp).toLocaleString()}</div>
                    <div><strong>Uploaded:</strong> {transaction.up ? "Yes" : "No"}</div>

                </div>

            ))}
        </div>
    );
}

export default Admin;
