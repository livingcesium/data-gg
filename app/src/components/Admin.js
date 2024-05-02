import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box } from '@mui/material';


function Admin() {
    const [transactions, setTransactions] = useState([]);
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

    return (
      isAdmin && <div className="AppContainer">
        <h1 className='Text'>Transactions</h1>
        <Box maxWidth={1500} margin="auto">
            <Grid container alignItems="stretch" justifyContent="space-evenly" spacing={6}>
            <Grid item xs={12}><Link to='/home'>Go Home</Link></Grid><br/>
                {transactions.map((transaction, index) => (
                    <Grid item key={index} className="List">
                        <div><strong>Transaction {index + 1}: </strong>{transaction.up ? "Upload" : "Download"}</div>
                        <div> _______________________________</div>
                        <div><strong>User ID:</strong> {transaction.user_id ? transaction.user_id._id : 'N/A'}</div>
                        <div><strong>User Name:</strong> {transaction.user_id ? <>{transaction.user_id.firstname} {transaction.user_id.lastname}</>: 'N/A'}</div>
                        <div><strong>File ID:</strong> {transaction.file_id}</div>
                        <div><strong>Timestamp:</strong> {new Date(transaction.timeStamp).toLocaleString()}</div><br/>
                    </Grid>
                ))}
            </Grid>
        </Box>
      </div>


    );
  }

  export default Admin;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';
// import { Link } from 'react-router-dom';

// function Admin() {
//     const [transactions, setTransactions] = useState([]);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const loggedIn = localStorage.getItem('loggedInUser')

//     useEffect(() => {
//         axios.get('http://localhost:9000/getAdmin', { params: { user_id: loggedIn } })
//             .then(response => {
//                 if (response.data) {
//                     setIsAdmin(true);
//                 }
//             })
//             .catch(error => {
//                 console.error('There was an error fetching admin data!', error);
//             });

//         axios.get('http://localhost:9000/getTransactions')
//             .then(response => {
//                 setTransactions(response.data);
//             })
//             .catch(error => {
//                 console.error('There was an error fetching transactions!', error);
//             });
//     }, []);

//     return (
//         isAdmin && <div className="AppContainer">
//             <h1 className='Text'>Transactions</h1> 
//             <Link to='/home'>Go Home</Link>
//             {transactions.map((transaction, index) => (

//                 <div className="List" key={index}>

//                     <div><strong>Transaction {index + 1}: {transaction.up ? "Upload" : "Download"}</strong></div> {/* Numbers each transaction in bold */}
//                     <div> ___________________________________</div>  
//                     { typeof transaction.user_id != undefined && typeof transaction.user_id._id != undefined ? <>
//                         <div><strong>User ID:</strong> {transaction.user_id._id}</div>
//                         <div><strong>Username:</strong> {transaction.user_id.username}</div>
//                         <div><strong>User Name:</strong> {transaction.user_id.firstname} {transaction.user_id.lastname}</div>
//                     </> : <>
//                         <strong>Guest User</strong>
//                     </>

//                     }
//                     <div><strong>File ID:</strong> {transaction.file_id}</div>
//                     <div><strong>Timestamp:</strong> {new Date(transaction.timeStamp).toLocaleString()}</div>

//                 </div>

//             ))}
//         </div>
//     );
// }

// export default Admin;
