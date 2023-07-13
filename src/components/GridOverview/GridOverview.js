import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Badge, Spinner, Alert, Modal } from "react-bootstrap";
import styles from "./GridOverview.module.css";
import AppStateContext from "../../context/AppStateContext";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteCustomer } from "../../services/";

const GridOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(0);
  const [saveAlert, setSaveAlert] = useState({ show: false, message: "" });
  const { state, dispatch } = useContext(AppStateContext);
  const { customers, loading } = state;

  useEffect(() => {
    setCurrentPage(state.currentPage);
  }, [state.currentPage]);


  useEffect(() => {
    let timer;

    const showAlertMessage = location.state?.success || saveAlert.show;
    const alertMessage = location.state?.success
      ? "Data sent to server successfully."
      : saveAlert
        ? saveAlert.message
        : "";

    if (showAlertMessage) {
      setSaveAlert({ show: true, message: alertMessage });
      timer = setTimeout(() => {
        setSaveAlert({ show: false, message: "" });
        navigate(location.pathname, {});
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [location.state?.success, saveAlert.show]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const handleEditCustomer = (customerId) => {
    navigate("/update-customer", { state: { customerId: customerId } });
  };

  const handleDeleteCustomer = async () => {
    var response = await deleteCustomer(deleteCustomerId);
    if (response.ok) {
      setSaveAlert({ show: true, message: "Customer was deleted successfully." });
      setDeletePrompt(false);
      dispatch({ type: "REFRESH_CUSTOMERS", payload: true });
    } 
  };

  const handleClosePrompt = () => setDeletePrompt(false);

  const handleShowPrompt = (customerId) => {
    setDeleteCustomerId(customerId);
    setDeletePrompt(true);
  }

  return (
    <div data-testid="grid-overview">
      <Modal show={deletePrompt} onHide={handleClosePrompt}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this customer?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePrompt}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDeleteCustomer()}>
            Delete Customer
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        // Show a loading spinner if the data is loading
        <div className={styles.spinnerContainer} data-testid="spinner">
          <Spinner animation="border" role="status" >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : customers && customers.results.length > 0 ? (
        // Render the table if data is available
        <div>
          {saveAlert.show && (
            <Alert variant="info" className={styles.alert} dismissible>
              {saveAlert.message}
            </Alert>
          )}
          <Table striped bordered>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Products</th>
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
                    <Button variant="danger" onClick={() => handleShowPrompt(item.customerId)}>
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
