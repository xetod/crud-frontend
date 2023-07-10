import React, { createContext, useEffect, useMemo, useReducer } from "react";
import AppStateContext from "../context/AppStateContext";
import { fetchCustomers, fetchProducts } from "../services/index";

// Define the initial state
const initialState = {
    customers: null,
    products: null,
    loading: false,
    error: null
};

// Define a reducer function to update the state
const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: null
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
        default:
            return state;
    }
};

// Create the provider component
const AppStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Fetch products when the component mounts
        const fetchInitialData = async () => {
            dispatch({ type: "FETCH_START" }); // Set loading state

            try {
                const products = await fetchProducts();
                dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: products }); // Save products to state
            } catch (error) {
                dispatch({ type: "FETCH_ERROR", payload: error }); // Set error state
            }
        };

        fetchInitialData();
    }, []);

    const getCustomers = async ({ currentPage, searchText = "" }) => {
        await fetchCustomers({ dispatch, currentPage, searchText });
    };

    // Provide the state and fetch function to consuming components
    return (
        <AppStateContext.Provider value={{ state, getCustomers }}>
            {children}
        </AppStateContext.Provider>
    );
};

export default AppStateProvider;