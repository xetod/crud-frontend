import * as yup from "yup";

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
                    .max(5, "Quantity must be less than 6"),
                unitPrice: yup.number()
                    .required("Unit price is required")
                    .min(1, "Unit price must be greater than zero")
                    .max(10000, "Unit price must be less than 10000")
            })
        )
});

export default schema;