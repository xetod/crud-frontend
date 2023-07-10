const fetchProducts = async () => {

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);        
        const data = await response.json();
        return data;
    } catch (error) {
        // dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
};

export default fetchProducts;
