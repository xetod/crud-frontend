import React from "react";
import { Form } from "react-bootstrap";
import styles from "./Customer.module.css";

function Customer({ formData, errors, handleChange }) {
    return (
        <div>
            <Form.Group controlId="formFirstName" className={styles.divider}>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid" role="error-message">
                    {errors.firstName}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formLastName" className={styles.divider}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid" role="error-message">
                    {errors.lastName}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail" className={styles.divider}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid" role="error-message">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formAddress" className={styles.divider}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid" role="error-message">
                    {errors.address}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPhoneNumber" className={styles.divider}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.phoneNumber}
                />
                <Form.Control.Feedback type="invalid" role="error-message">
                    {errors.phoneNumber}
                </Form.Control.Feedback>
            </Form.Group>
        </div>
    );
}

export default Customer;
