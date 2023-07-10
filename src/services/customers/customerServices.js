const fetchCustomers = async ({ dispatch, currentPage, searchText = "" }) => {
    dispatch({ type: "FETCH_START" });

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
            return { success: true };
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        // Rethrow the error to the callee
        throw error;
    }
};

export { fetchCustomers, createCustomer };
