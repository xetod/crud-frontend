const getCustomers = async ({ dispatch, currentPage, searchText = "" }) => {
    dispatch({ type: "FETCH_START" });
console.log(currentPage, searchText);
    const params = new URLSearchParams({
        currentPage: currentPage.toString(),
        searchText
    });

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers?${params.toString()}`);
        const data = await response.json();

        dispatch({ type: "FETCH_CUSTOMERS_SUCCESS", payload: data });
    } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
};

const getCustomer = async (customerId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`);
        const data = await response.json();
        return data;
    } catch (error) {
    }
};

const createCustomer = async (formData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        // Check if the request was successful (status 2xx)
        if (response.ok) {
            // Return the response
            return response;
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        // Rethrow the error to the callee
        throw error;
    }
};

const updateCustomer = async (formData, customerId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        // Check if the request was successful (status 2xx)
        if (response.ok) {
            // Return the response
            return response;
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        // Rethrow the error to the callee
        throw error;
    }
};

const deleteCustomer = async (customerId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Check if the request was successful (status 2xx)
        if (response.ok) {
            // Return the response            
            return response;
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        // Rethrow the error to the callee
        throw error;
    }
};

export { getCustomers, createCustomer, getCustomer, updateCustomer, deleteCustomer };
