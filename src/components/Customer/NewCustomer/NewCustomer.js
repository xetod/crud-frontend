import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import * as yup from "yup";
import AppStateContext from "../../../context/AppStateContext";
import { createCustomer } from "../../../services"
import Sales from "./Sales";

function NewCustomer() {
    const navigate = useNavigate();
    const { state } = useContext(AppStateContext);
    const { products } = state;
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phoneNumber: "",
        sales: [
            {
                productId: 0,
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
            },
        ]
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        sales: {},
    });

    const schema = yup.object().shape({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        address: yup.string().required("Address is required"),
        phoneNumber: yup.string().required("Phone number is required"),
        sales: yup
            .array(
                yup.object().shape({
                    productId: yup.number()
                        .required("Product name is required")
                        .min(1, "Product should be selected."),
                    quantity: yup.number()
                        .required("Quantity is required")
                        .min(1, "Quantity must be greater than zero")
                })
            )
    });

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        if (name === "productId" || name === "quantity" || name === "date" || name === "unitPrice" || name === "totalPrice") {
            const sales = [...formData.sales];
            sales[index] = {
                ...sales[index],
                [name]: value ?? 0,
            };
            setFormData((prevFormData) => ({
                ...prevFormData,
                sales,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }   
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Disable submit button while submitting
        setSubmitting(true);

        try {
            // Validate form
            await schema.validate(formData, { abortEarly: false });

            // Perform form submission to the server
            var response = await createCustomer(formData);
            // Handle the response from the server
            if (response.success) {
                navigate("/", { state: { success: true } });
            } else {
                console.log("Form submission failed");
            }
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error("Form submission error:", error);
            }
        }

        // Enable submit button after submission
        setSubmitting(false);
    };

    const handleAddSale = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            sales: [...prevFormData.sales, { productId: 0 }],
        }));
    };

    const handleRemoveSale = (index) => {
        setFormData((prevFormData) => {
            const sales = [...prevFormData.sales];
            sales.splice(index, 1);
            return {
                ...prevFormData,
                sales,
            };
        });
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.address}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.phoneNumber}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                </Form.Control.Feedback>
            </Form.Group>

            <Sales
                sales={formData.sales}
                products={products}
                errors={errors}
                submitting={submitting}
                handleChange={handleChange}
                handleAddSale={handleAddSale}
                handleRemoveSale={handleRemoveSale}
            />

            {/* <Form.Group controlId="formSales">
                <Form.Label>Sales</Form.Label>
                {formData.sales.map((sale, index) => (
                    <Row key={index}>
                        <Col>
                            <Form.Control
                                as="select"
                                name="productId"
                                value={sale.productId}
                                onChange={(event) => handleChange(event, index)}
                                isInvalid={!!errors[`sales[${index}].productId`]}
                            >
                                <option value={0}>Select a product</option>
                                {formData.products.map((product) => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.productName}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors[`sales[${index}].productId`]}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xs="auto">
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={sale.quantity}
                                onChange={(event) => handleChange(event, index)}
                                isInvalid={!!errors[`sales[${index}].quantity`]}
                                min="0"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[`sales[${index}].quantity`]}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xs="auto">
                            <Form.Control
                                type="number"
                                name="unitPrice"
                                value={sale.unitPrice}
                                onChange={(event) => handleChange(event, index)}
                                isInvalid={!!errors[`sales[${index}].unitPrice`]}
                                min="0"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[`sales[${index}].unitPrice`]}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xs="auto">
                            <Form.Control
                                type="number"
                                name="totalPrice"
                                value={sale.totalPrice}
                                onChange={(event) => handleChange(event, index)}
                                isInvalid={!!errors[`sales[${index}].totalPrice`]}
                                min="0"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[`sales[${index}].totalPrice`]}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xs="auto">
                            {index === formData.sales.length - 1 && (
                                <Button
                                    variant="secondary"
                                    onClick={handleAddSale}
                                    disabled={submitting}
                                >
                                    Add
                                </Button>
                            )}
                            {index !== formData.sales.length - 1 && (
                                <Button
                                    variant="secondary"
                                    onClick={() => handleRemoveSale(index)}
                                    disabled={submitting}
                                >
                                    Remove
                                </Button>
                            )}
                        </Col>
                    </Row>
                ))}
            </Form.Group> */}

            <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="secondary" type="button" onClick={handleCancel} >
                Cancel
            </Button>
        </Form>
    );
}

export default NewCustomer;
