import React, { useEffect, useReducer } from "react";
import AppStateContext from "../context/AppStateContext";
import { getCustomers, fetchProducts } from "../services/index";

// Define the initial state for the application
const initialState = {
    customers: null,
    products: null,
    loading: false,
    error: null,
    currentPage: 1,
    searchText: "",
    refreshCustomers: false
};

// Define the reducer function to handle state updates
const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: null,
                refreshCustomers: false
            };
        case "FETCH_PRODUCTS_SUCCESS":
            return {
                ...state,
                loading: false,
                products: action.payload
            };
        case "FETCH_CUSTOMERS_SUCCESS":
            return {
                ...state,
                loading: false,
                customers: action.payload
            };
        case "FETCH_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case "SET_CURRENT_PAGE":
            return {
                ...state,
                currentPage: action.payload
            };
        case "SET_SEARCH_TEXT":
            return {
                ...state,
                searchText: action.payload,
                currentPage: 1
            };
        case "REFRESH_CUSTOMERS":
            return {
                ...state,
                refreshCustomers: action.payload
            };
        default:
            return state;
    }
};

// Define the AppStateProvider component
const AppStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchInitialData = async () => {
            dispatch({ type: "FETCH_START" });
            try {
                // Fetch initial data, such as products
                const products = await fetchProducts();
                dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: products });
            } catch (error) {
                dispatch({ type: "FETCH_ERROR", payload: error });
            }
        };

        // Fetch initial data when the component mounts
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            // Fetch customers based on the current page and search text
            await getCustomers({
                dispatch: dispatch,
                currentPage: state.searchText ? 1 : state.currentPage,
                searchText: state.searchText
            });
        };

        // Fetch customers when the current page or search text changes
        fetchCustomers();
    }, [state.currentPage, state.searchText]);

    useEffect(() => {
        const fetchCustomers = async () => {
            // Fetch customers when the refreshCustomers flag is set
            if (!state.refreshCustomers) return;

            await getCustomers({
                dispatch: dispatch,
                currentPage: state.searchText ? 1 : state.currentPage,
                searchText: state.searchText
            });
        };

        // Fetch customers when the refreshCustomers flag changes
        fetchCustomers();
    }, [state.refreshCustomers]);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
};

export default AppStateProvider;
