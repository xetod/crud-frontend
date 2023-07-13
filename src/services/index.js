// Import functions for customer operations
import { getCustomers, createCustomer, getCustomer, updateCustomer, deleteCustomer } from './customers/customerServices';

// Import function for fetching products
import fetchProducts from './products/products';

// Export the imported functions
export {
    // Customer operations
    getCustomers,     // Function to retrieve a list of customers
    createCustomer,   // Function to create a new customer
    getCustomer,      // Function to retrieve a specific customer
    updateCustomer,   // Function to update a customer's information
    deleteCustomer,   // Function to delete a customer

    // Product operations
    fetchProducts     // Function to fetch products
};
