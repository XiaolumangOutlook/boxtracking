import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { data } from './data.js'

const columns = Object.keys(data[0])

function App() {
  
  const [search, setSearch] = useState('');
  //console.log(data)
  // const sortName = () => {
  //   setContacts(
  //     data.sort((a, b) => {
  //       return a.first_name.toLowerCase() < a.first_name.toLowerCase()
  //         ? -1
  //         : a.first_name.toLowerCase() > a.first_name.toLowerCase()
  //         ? 1
  //         : 0;
  //     })
  //   );
  // };

  return (
    <div>
      <Container>
        <h1 className='text-center mt-4'>Contact Keeper</h1>
        <Form>
          <InputGroup className='my-3'>

            {/* onChange for search */}
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search contacts'
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((col, index)=>(<th key={index}>{col}</th>))}
              
            </tr>
          </thead>
          <tbody>
            {data
             .slice(0,20)
              .filter((item) => {
                return search.toLowerCase() === ''
                  || columns.some(col=>item[col].toLowerCase().includes(search.toLocaleLowerCase()));
              })
              
              .map((item, index) => (
                <tr key={index}>
                  {columns.map((col,colIndex)=>(<td key={colIndex}>{item[col]}</td>))}
                 
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default App;
