import React, { createContext, useEffect, useMemo, useReducer } from "react";
import AppStateContext from "../context/AppStateContext";
import fetchCustomers from "../services/customers/customerServices";

// Define the initial state
const initialState = {
    data: null,
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
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.payload
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