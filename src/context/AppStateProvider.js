import React, { useEffect, useReducer } from "react";
import AppStateContext from "../context/AppStateContext";
import { getCustomers, fetchProducts } from "../services/index";

// Define the initial state
const initialState = {
    customers: null,
    products: null,
    loading: false,
    error: null,
    currentPage: 1,
    searchText: "",
    refreshCustomers: false
};

// Define a reducer function to update the state
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

const AppStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchInitialData = async () => {
            dispatch({ type: "FETCH_START" });
            try {
                const products = await fetchProducts();
                dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: products });
            } catch (error) {
                dispatch({ type: "FETCH_ERROR", payload: error });
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {            
            await getCustomers({
                dispatch: dispatch,
                currentPage: state.searchText ? 1 : state.currentPage,
                searchText: state.searchText
            });
        };

        fetchCustomers();
    }, [state.currentPage, state.searchText]);    
    
    useEffect(() => {
        const fetchCustomers = async () => {
            if (!state.refreshCustomers) return;
            
            await getCustomers({
                dispatch: dispatch,
                currentPage: state.searchText ? 1 : state.currentPage,
                searchText: state.searchText
            });
        };

        fetchCustomers();
    }, [state.refreshCustomers]);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
};

export default AppStateProvider;