// Function to fetch products from the API
const fetchProducts = async () => {
    try {
        // Send a GET request to the API endpoint for products
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
        
        // Parse the response data as JSON
        const data = await response.json();

        // Return the retrieved product data
        return data;
    } catch (error) {
        // Handle any errors that occur during the API request
        // You might want to add error handling logic here, such as logging or displaying an error message
        console.error('Error fetching products:', error);
    }
};

// Export the fetchProducts function as the default export of the module
export default fetchProducts;
