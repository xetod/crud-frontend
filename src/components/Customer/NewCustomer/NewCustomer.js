import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import * as yup from "yup";
import AppStateContext from "../../../context/AppStateContext";
import { createCustomer } from "../../../services"
import Customer from "../Customer/Customer";
import Sale from "../Sale/Sale";
import schema from "../../../validations/customer/schema";
import styles from "./NewCustomer.module.css";

/**
 * Component for creating a new customer.
 * This component displays a form for entering a new customer's details and sales information.
 * It communicates with the server to create the new customer and handles form submission.
 */
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

    /**
     * Handles the change event for form inputs.
     * Updates the form data based on the input name and value.
     * If the changed input belongs to a sale item, it recalculates the total price.
     * @param {Event} event - The change event
     * @param {number} index - The index of the sale item (if applicable)
     */
    const handleChange = (event, index) => {
        const { name, value } = event.target;
        if (name === "productId" || name === "quantity" || name === "date" || name === "unitPrice" || name === "totalPrice") {
            const sales = [...formData.sales];
            sales[index] = {
                ...sales[index],
                [name]: value ?? 0,
                totalPrice: name === "quantity" ? value * sales[index].unitPrice : sales[index].quantity * value,
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


    /**
     * Handles the form submission event.
     * Validates the form data using the schema.
     * Sends the new customer data to the server for creation.
     * If the submission is successful, it navigates back to the main page with a success message.
     * If there are validation errors or an API error occurs, it updates the errors state or logs the error to the console.
     * @param {Event} event - The form submission event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Disable submit button while submitting
        setSubmitting(true);

        try {
            // Validate form data
            await schema.validate(formData, { abortEarly: false });

            // Perform form submission to the server
            var response = await createCustomer(formData);

            // Handle the response from the server
            if (response.ok) {
                navigate("/", { state: { success: true } });
            }
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
            setSubmitting(false);
        }
    };


    /**
     * Adds a new sale item to the form data.
     * Sets the product ID of the new sale item to 0.
     */
    const handleAddSale = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            sales: [...prevFormData.sales, { productId: 0 }],
        }));
    };


    /**
     * Removes a sale item from the form data based on its index.
     * @param {number} index - The index of the sale item to be removed
     */
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


    /**
     * Handles the cancel button click event.
     * Navigates back to the main page.
     */
    const handleCancel = () => {
        navigate("/");
    };


    return (
        <div className={styles.roundedFormBorder}>
            <Form onSubmit={handleSubmit}>
                {/* Render the customer form component */}
                <Customer
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                />

                {/* Render the sale component */}
                <Sale
                    sales={formData.sales ? formData.sales : []}
                    products={products}
                    errors={errors}
                    submitting={submitting}
                    handleChange={handleChange}
                    handleAddSale={handleAddSale}
                    handleRemoveSale={handleRemoveSale}
                />

                <div className={styles.topDivider}>
                    {/* Submit button */}
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit"}
                    </Button>
                    {/* Cancel button */}
                    <Button variant="secondary" type="button" className={styles.leftDivider} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default NewCustomer;
