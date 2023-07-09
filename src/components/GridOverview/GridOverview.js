import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import styles from "./GridOverview.module.css";
import AppStateContext from "../../context/AppStateContext";

const GridOverview = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { state, getCustomers } = useContext(AppStateContext);
  const { data, loading, error } = state;

  useEffect(() => {
    // Fetch customers when the component mounts
    getCustomers({ currentPage: currentPage });
  }, []);

  const handlePageChange = (currentPage) => {
    // Update the current page and fetch customers
    setCurrentPage(currentPage);
    getCustomers({ currentPage: currentPage });
  };

  const handleEditCustomer = (customerId) => {
    // Log the customer ID
    console.log(customerId);
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
      ) : data && data.results.length > 0 ? (
        // Render the table if data is available
        <div>
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
              {data && data.results.map((item) => (
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
            {Array.from({ length: data && data.pagination.totalPages }, (_, index) => index + 1).map(
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
