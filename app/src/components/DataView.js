import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { handleDownload } from '../handles';

function DataView() {
  const [results, setResults] = useState([])
  const backendPort = process.env.BACK_PORT || 9000
  
  const query = new URLSearchParams(useLocation().search)
  useEffect(() => {
    console.log(results)
    const searchName = query.get('query')
    const searchQuery = query.getAll('tags').length ? query.getAll('tags'): []
    const searchTags = [...searchQuery, searchName ? {tag_id: {name: "name"}, value : searchName} : {tag_id : {name: ""}, value : ""}]
    axios.get(`http://localhost:${backendPort}/searchFiles`, {params: {tagPairs: searchTags}})
      .then(res => {
        console.log(Object.values(res.data))
        setResults(Object.values(res.data))
      })
      .catch(err => {
        console.error('Failed to fetch results', err)
        alert('Failed to fetch results')
      })
    
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Results</h1>
      <table>
        <thead>
          <tr>
            <th>Given Name</th>
            <th>File Name</th>
            <th>File Size</th>
            <th>Date Uploaded</th>
            <th>Uploaded By</th>
            <th>Download</th>
          </tr>
        </thead>
        <Results content={results}/>
      </table>
      <Link to='/home'>Go Home</Link>
    </div>
  );
}

function Results({content}){
  return (
    <tbody>
      {content.map(({file, tags}) => (
        file && tags && <tr key={file._id}>
          <td>{tags["name"].value}</td>
          <td>{file.file_name}</td>
          <td>{file.file_size + " B"}</td>
          <td>{file.timestamp + " UTC"}</td>
          <td>{file.uploader.username}</td>
          <td><button onClick={(event) => {
            event.preventDefault()
            handleDownload(file._id, file.file_name)
          }}>Download Dataset</button></td>

        </tr>
      ))}
    </tbody>
  )
}

export default DataView;