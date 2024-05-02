import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { handleDownload } from '../handles';
import CircularProgress from '@mui/material/CircularProgress';
import { FixedSizeGrid as Grid } from 'react-window'
import './App.css';

export default function DataView() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState([])
  const [gotResults, setGotResults] = useState(false)
  const backendPort = process.env.REACT_APP_BACK_PORT||9000
  const loggedIn = localStorage.getItem('loggedInUser')

  const query = new URLSearchParams(useLocation().search)
  useEffect(() => {
    const searchName = query.get('query')
    const searchQuery = query.getAll('tags').length ? JSON.parse(query.getAll('tags')): []
    const defaultSearch = {tag : {name: ".*"}, value : ".*"}

    const searchTags = [...searchQuery, searchName ? {tag: {name: "name"}, value : searchName} : defaultSearch]
    axios.get(`http://localhost:${backendPort}/searchFiles`, { params: { tagPairs: searchTags } })
      .then(res => {
        //Sorts the Results from most recent to least recent 
        const sortedResults = Object.values(res.data).sort((a, b) => new Date(b.file.timestamp) - new Date(a.file.timestamp));
        setResults(sortedResults);
      })
      .catch(err => {
        console.error('Failed to fetch results', err);
        alert('Failed to fetch results');
      })
      .finally(() => {
        setGotResults(true)
      });
  }, []);
  const containerWidth = window.innerWidth
  const containerHeight = window.innerHeight * 0.80
  const itemWidth = 300
  const itemHeight = 300
  return (
    <div className="body">
      <h1 className="title">Results</h1>
      <div> <Link to="/home" className="link">Go Home</Link> </div> 
      
        { !gotResults ? <CircularProgress/> : 
          <Grid
          height={containerHeight}
          width={containerWidth}
          columnCount={Math.floor(containerWidth / (itemWidth))} // number of items per row
          rowCount={Math.ceil(results.length / Math.floor(containerWidth / (itemWidth)))} // number of rows
          columnWidth={itemWidth}
          rowHeight={itemHeight}
          style={{margin: '5px'}}
          >
            {({columnIndex, rowIndex, style}) => {
            const index = rowIndex * Math.floor(containerWidth / itemWidth) + columnIndex;
            if (typeof results[index] === "undefined") return (<div></div>)
            console.log(results[index])
            const {file, tags} = results[index]
            return (
            <div key={index} style={style} className="card-container">
              <div className="card">
                <div className="card-header">{tags["name"].value}</div>
                <div className="card-content">
                  <div className="detail">
                    <div className="detail-label">File Name:</div>
                    <div>{file.file_name}</div>
                  </div>
                  <div className="detail">
                    <div className="detail-label">File Size:</div>
                    <div>{file.file_size} B</div>
                  </div>
                  <div className="detail">
                    <div className="detail-label">Date Uploaded:</div>
                    <div>{new Date(file.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="detail">
                    <div className="detail-label">Uploaded By:</div>
                    <div>{file.uploader.username}</div>
                  </div>
                  <button className="button" onClick={() => {
                    setLoading(loading => {
                      const changed = Array.from(loading)
                      changed[index] = true
                      return changed
                    })
                    handleDownload(file._id, file.file_name, loggedIn, () => {setLoading(loading => {
                      const changed = Array.from(loading)
                      changed[index] = false
                      return changed
                    })})  
                  }}>
                    { loading[index] ? <CircularProgress/> : "Download Dataset"}
                  </button>
                </div>
              </div>
            </div>)
          }}
          </Grid>
      }

        
      
      <Link to="/home" className="link">Go Home</Link>
    </div>
  );
}
