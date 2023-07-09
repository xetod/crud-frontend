const fetchCustomers = async ({ dispatch, currentPage, searchText = "" }) => {
    dispatch({ type: "FETCH_START" });

    const params = new URLSearchParams({
        currentPage: currentPage.toString(),
        searchText
    });

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/customers?${params.toString()}`);
        const data = await response.json();

        dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
};

export default fetchCustomers;
