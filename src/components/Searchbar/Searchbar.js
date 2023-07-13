import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import styles from "./Searchbar.module.css";
import AppStateContext from "../../context/AppStateContext";

const Searchbar = () => {
  // Get the navigate function from react-router-dom
  const navigate = useNavigate();

  // Get the getCustomers function from the AppStateContext
  const { state, dispatch } = useContext(AppStateContext);

  // Create state for the search text
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setSearchText(state.searchText);
  }, [state.searchText]);

  // Handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch({ type: "SET_SEARCH_TEXT", payload: searchText });
  };

  // Handle the "New Customer" button click
  const handleNewCustomer = () => {
    // Navigate to the "/new-customer" route
    navigate("/new-customer");
  };

  return (
    <div>
      <Form onSubmit={handleSearch} className="mb-3">
        <Row>
          <Col>
            {/* Input field for searching */}
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchText ?? ""}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            {/* Search button */}
            <Button variant="primary" type="submit">
              Search
            </Button>
            {/* "New Customer" button */}
            <Button
              variant="success"
              onClick={handleNewCustomer}
              className={styles.divider}
            >
              New Customer
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Searchbar;