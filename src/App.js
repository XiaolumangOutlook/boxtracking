import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "c2cbc9d8-cc4e-4542-b949-8fde03cb3872", // Replace with your Azure AD App Client ID
    authority: "https://login.microsoftonline.com/203ac574-8a90-4b4b-8f8e-d2580096e03a",
    redirectUri: "https://white-beach-0a3c98200.6.azurestaticapps.net",
  },
  cache: {
    cacheLocation: "sessionStorage", // Use session storage to ensure logout on tab close
    storeAuthStateInCookie: true,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const AutoLogin = () => {
  const { instance, accounts } = useMsal();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const login = async () => {
      if (accounts.length === 0) {
        await instance.loginRedirect({ scopes: ["openid", "profile", "email"] });
      } else {
        fetchData();
      }
    };

    login();
  }, [instance, accounts]);

  const fetchData = async () => {
    try {
      const tokenRequest = { scopes: ["User.Read"] };
      const tokenResponse = await instance.acquireTokenSilent(tokenRequest);
      const accessToken = tokenResponse.accessToken;

      const response = await fetch(
        "https://boxtracking-backend-a0aec7e0emh6dwet.canadacentral-01.azurewebsites.net/api/data",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const json = await response.json();
      setData(json);
      setColumns(Object.keys(json[0] || {}));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <h1 className="text-center mt-4">Box Tracking</h1>
      <Form>
        <InputGroup className="my-3">
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts"
          />
        </InputGroup>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .slice(0, 20)
            .filter((item) => {
              return (
                search.toLowerCase() === "" ||
                columns.some((col) =>
                  item[col]?.toString().toLowerCase().includes(search.toLowerCase())
                )
              );
            })
            .map((item, index) => (
              <tr key={index}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{item[col]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

const App = () => (
  <MsalProvider instance={msalInstance}>
    <AutoLogin />
  </MsalProvider>
);

export default App;
