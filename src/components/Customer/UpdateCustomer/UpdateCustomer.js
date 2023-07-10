import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import * as yup from "yup";
import AppStateContext from "../../../context/AppStateContext";
import { createCustomer, getCustomer, updateCustomer } from "../../../services"; // Assuming you have a service function to get products
import Customer from "../Customer/Customer";
import Sale from "../Sale/Sale";
import styles from "./UpdateCustomer.module.css";

function UpdateCustomer() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = useContext(AppStateContext);
    const { products } = state;
    const [formData, setFormData] = useState({
        customerId: 0,
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phoneNumber: "",
        sales: [
            {
                saleId: 0,
                productId: 0,
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
            },
        ],
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
        sales: yup.array(
            yup.object().shape({
                productId: yup
                    .number()
                    .required("Product name is required")
                    .min(1, "Product should be selected."),
                quantity: yup
                    .number()
                    .required("Quantity is required")
                    .min(1, "Quantity must be greater than zero"),
            })
        ),
    });

    useEffect(() => {
        async function fetchCustomer() {
            try {
                // Make the API call to fetch customer data from the server
                const response = await getCustomer(location.state?.customerId); // Replace 'getCustomerData' with the actual API call

                if (response) {
                    const { customerId, firstName, lastName, email, address, phoneNumber, sales } = response;

                    // Update the form data with the fetched values
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        customerId,
                        firstName,
                        lastName,
                        email,
                        address,
                        phoneNumber,
                        sales: sales.map((sale) => ({
                            saleId: sale.saleId,
                            productId: sale.productId,
                            quantity: sale.quantity,
                            unitPrice: sale.unitPrice,
                            totalPrice: sale.totalPrice,
                        })),
                    }));
                }
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        }

        fetchCustomer();
    }, [location.state?.customerId]);

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        if (
            name === "productId" ||
            name === "quantity" ||
            name === "date" ||
            name === "unitPrice" ||
            name === "totalPrice"
        ) {
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

            var response = location.state?.customerId
                ? await updateCustomer(formData, location.state?.customerId)
                : await createCustomer(formData);

            // Handle the response from the server
            if (response.success) {
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
        <div className={styles.roundedFormBorder}>
            <Form onSubmit={handleSubmit}>
                <Customer
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                />

                <Sale
                    sales={formData.sales}
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

export default UpdateCustomer;
