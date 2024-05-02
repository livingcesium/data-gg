import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { handleDownload } from '../handles';
import './App.css';

function DataView() {
  const [results, setResults] = useState([]);
  const backendPort = process.env.BACK_PORT || 9000;
  const loggedIn = localStorage.getItem('loggedInUser');

  const query = new URLSearchParams(useLocation().search);
  useEffect(() => {
    const searchName = query.get('query')
    const searchQuery = query.getAll('tags').length ? JSON.parse(query.getAll('tags')): []
    const defaultSearch = searchQuery ? [] : [{tag : {name: ""}, value : ""}]

    const searchTags = [...searchQuery, ...(searchName ? [{tag: {name: "name"}, value : searchName}] : defaultSearch)]
    axios.get(`http://localhost:${backendPort}/searchFiles`, { params: { tagPairs: searchTags } })
      .then(res => {
        
//Sorts the Results from most recent to least recent 
        const sortedResults = Object.values(res.data).sort((a, b) => new Date(b.file.timestamp) - new Date(a.file.timestamp));
        setResults(sortedResults);
      })
      .catch(err => {
        console.error('Failed to fetch results', err);
        alert('Failed to fetch results');
      });
  }, []);

  return (
    <div className="body">
      <h1 className="title">Results</h1>
      <Link to="/home" className="link">Go Home</Link>
      <div className="card-container">
        {results.map(({ file, tags }, index) => (
          <div key={index} className="card">
            <div className="card-header">{tags["name"].value}</div>
            <div className="card-content">
              <div className="detail">
                <span className="detail-label">File Name:</span>
                <span>{file.file_name}</span>
              </div>
              <div className="detail">
                <span className="detail-label">File Size:</span>
                <span>{file.file_size} B</span>
              </div>
              <div className="detail">
                <span className="detail-label">Date Uploaded:</span>
                <span>{new Date(file.timestamp).toLocaleString()}</span>
              </div>
              <div className="detail">
                <span className="detail-label">Uploaded By:</span>
                <span>{file.uploader.username}</span>
              </div>
              <button className="button" onClick={() => handleDownload(file._id, file.file_name, loggedIn)}>Download Dataset</button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/home" className="link">Go Home</Link>
    </div>
  );
}

export default DataView;