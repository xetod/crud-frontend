// Function to get customers from the API
const getCustomers = async ({ dispatch, currentPage, searchText = "" }) => {
    // Dispatch a FETCH_START action to indicate that the fetch process has started
    dispatch({ type: "FETCH_START" });
    
    // Log the current page and search text
    console.log(currentPage, searchText);

    // Create URL parameters for the current page and search text
    const params = new URLSearchParams({
        currentPage: currentPage.toString(),
        searchText
    });

    try {
        // Send a GET request to the API endpoint for customers with the specified parameters
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers?${params.toString()}`);
        
        // Parse the response data as JSON
        const data = await response.json();

        // Dispatch a FETCH_CUSTOMERS_SUCCESS action with the retrieved customer data
        dispatch({ type: "FETCH_CUSTOMERS_SUCCESS", payload: data });
    } catch (error) {
        // Dispatch a FETCH_ERROR action with the error message
        dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
};

// Function to get a specific customer from the API
const getCustomer = async (customerId) => {
    try {
        // Send a GET request to the API endpoint for a specific customer
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`);
        
        // Parse the response data as JSON
        const data = await response.json();

        // Return the retrieved customer data
        return data;
    } catch (error) {
        // Handle any errors that occur during the API request
        // You might want to add error handling logic here, such as logging or displaying an error message
        console.error('Error fetching customer:', error);
    }
};

// Function to create a new customer through the API
const createCustomer = async (formData) => {
    try {
        // Send a POST request to the API endpoint for creating a customer
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        // Check if the response indicates success
        if (response.ok) {
            return response;
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        // Throw the error to be handled by the caller
        throw error;
    }
};

// Function to update a customer's information through the API
const updateCustomer = async (formData, customerId) => {
    try {
        // Send a PUT request to the API endpoint for updating a customer's information
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        // Check if the response indicates success
        if (response.ok) {
            return response;
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        // Throw the error to be handled by the caller
        throw error;
    }
};

// Function to delete a customer through the API
const deleteCustomer = async (customerId) => {
    try {
        // Send a DELETE request to the API endpoint for deleting a customer
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Check if the response indicates success
        if (response.ok) {
            return response;
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        // Throw the error to be handled by the caller
        throw error;
    }
};

// Export the customer-related functions
export { getCustomers, createCustomer, getCustomer, updateCustomer, deleteCustomer };
