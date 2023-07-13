import * as yup from "yup";

// Define the validation schema using Yup
const schema = yup.object().shape({
    // Validate the first name field
    firstName: yup.string().required("First name is required"),

    // Validate the last name field
    lastName: yup.string().required("Last name is required"),

    // Validate the email field
    email: yup.string().email("Invalid email").required("Email is required"),

    // Validate the address field
    address: yup.string().required("Address is required"),

    // Validate the phone number field
    phoneNumber: yup.string().required("Phone number is required"),

    // Validate the sales array
    sales: yup.array().of(
        yup.object().shape({
            // Validate the product ID field
            productId: yup
                .number()
                .required("Product name is required")
                .min(1, "Product should be selected."),

            // Validate the quantity field
            quantity: yup
                .number()
                .required("Quantity is required")
                .min(1, "Quantity must be greater than zero")
                .max(5, "Quantity must be less than 6"),

            // Validate the unit price field
            unitPrice: yup
                .number()
                .required("Unit price is required")
                .min(1, "Unit price must be greater than zero")
                .max(10000, "Unit price must be less than 10000")
        })
    )
});

export default schema;
