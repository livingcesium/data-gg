import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function DataView() {
  const [results, setResults] = useState([]);
  const backendPort = process.env.BACK_PORT || 9000;

  useEffect(() => {
    axios.get(`http://localhost:${backendPort}/getResults`)
      .then(res => {
        setResults(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch results', err);
        alert('Failed to fetch results');
      });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Results</h1>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>File Size</th>
            <th>Date Uploaded</th>
            <th>Uploaded By</th>
          </tr>
        </thead>
        <tbody>
          {results.map((entry, index) => (
            <tr key={index}>
              <td>{entry.file_name}</td>
              <td>{entry.file_size + " B"}</td>
              <td>{entry.timestamp + " UTC"}</td>
              <td>{entry.uploader_details.display_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to='/home'>Go Home</Link>
    </div>
  );
}

export default DataView;