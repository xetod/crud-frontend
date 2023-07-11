import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import * as yup from "yup";
import AppStateContext from "../../../context/AppStateContext";
import { createCustomer } from "../../../services"
import Customer from "../Customer/Customer";
import Sale from "../Sale/Sale";
import styles from "./NewCustomer.module.css";

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
        <div className={styles.roundedFormBorder}>
            <Form onSubmit={handleSubmit}>
                <Customer
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                />

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
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button variant="secondary" type="button" className={styles.leftDivider} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default NewCustomer;
