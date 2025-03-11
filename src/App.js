import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { data } from './data.js'
import { useEffect } from 'react';




function App() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]); // Store fetched data
  const [columns, setColumns] = useState([]); // Store column names

  useEffect(() => {
    // Fetch data from Azure Web App API
    fetch('https://boxtracking-webapp.azurewebsites.net/api/data')
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setColumns(Object.keys(json[0] || {})); // Set column names dynamically
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Container>
        <h1 className='text-center mt-4'>Box Tracking</h1>
        <Form>
          <InputGroup className='my-3'>
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search contacts'
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((col, index) => (<th key={index}>{col}</th>))}
            </tr>
          </thead>
          <tbody>
            {data
              .slice(0, 20)
              .filter((item) => {
                return search.toLowerCase() === ''
                  || columns.some(col => item[col]?.toString().toLowerCase().includes(search.toLowerCase()));
              })
              .map((item, index) => (
                <tr key={index}>
                  {columns.map((col, colIndex) => (<td key={colIndex}>{item[col]}</td>))}
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default App;
