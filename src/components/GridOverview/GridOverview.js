import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import styles from "./GridOverview.module.css";
import AppStateContext from "../../context/AppStateContext";
import { useLocation } from "react-router-dom";

const GridOverview = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [saveAlert, setSaveAlert] = useState(false);
  const { state, getCustomers } = useContext(AppStateContext);
  const { customers, loading } = state;

  useEffect(() => {
    // Fetch customers when the component mounts
    getCustomers({ currentPage: currentPage });
  }, []);

  useEffect(() => {
    let timer;
    if (location.state?.success) {
      setSaveAlert(true);

      timer = setTimeout(() => {
        setSaveAlert(false);
        // Set success to false after 8 seconds
      }, 3000);
    }
    return () => {
      window.history.replaceState({}, document.title);

      clearTimeout(timer);
    };
  }, [location.state?.success]);

  const handlePageChange = (currentPage) => {
    // Update the current page and fetch customers
    setCurrentPage(currentPage);
    getCustomers({ currentPage: currentPage });
  };

  const handleEditCustomer = (customerId) => {
    // Log the customer ID
    console.log(location);
  };

  return (
    <div data-testid="grid-overview">
      {loading ? (
        // Show a loading spinner if the data is loading
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : customers && customers.results.length > 0 ? (
        // Render the table if data is available
        <div>
          {saveAlert && (
            <Alert variant="info" className={styles.alert} dismissible>
              Data sent to server successfully. 
            </Alert>
          )}
          <Table striped bordered>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th style={{ width: "20%" }}>Sale</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers && customers.results.map((item) => (
                // Render a row for each customer
                <tr key={item.customerId}>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.sales.map((sale, index) => (
                      // Render a badge for each sale
                      <Badge key={index} bg="info" className={styles.divider}>{sale.productName}</Badge>
                    ))}
                  </td>
                  <td>
                    <Button variant="danger">
                      Delete
                    </Button>
                    <Button variant="secondary" className={styles.divider} onClick={() => handleEditCustomer(item.customerId)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div>
            {Array.from({ length: customers && customers.pagination.totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                // Render pagination buttons
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "primary" : "outline-primary"}
                  onClick={() => handlePageChange(pageNumber)}
                  className={styles.divider}
                >
                  {pageNumber}
                </Button>
              )
            )}
          </div>
        </div>
      ) : (
        // Render a message if no data is available
        <p>No data available.</p>
      )}
    </div>
  );
};

export default GridOverview;
