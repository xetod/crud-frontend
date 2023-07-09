import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import AppStateContext from "../../../context/AppStateContext";
import Searchbar from "../Searchbar";

// Mock the value of the AppStateContext
const mockAppStateContextValue = {
    getCustomers: jest.fn(),
};

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

// Helper function to render the Searchbar component with the necessary context
const renderSearchbar = () => {
    return render(
        <AppStateContext.Provider value={mockAppStateContextValue}>
            <Searchbar />
        </AppStateContext.Provider>
    );
};

describe("Searchbar", () => {
    it("renders the search input and buttons", () => {
        renderSearchbar();
        expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "New Customer" })).toBeInTheDocument();
    });

    it("calls getCustomers with the correct parameters when searching", () => {
        renderSearchbar();
        const searchInput = screen.getByPlaceholderText("Search");
        const searchButton = screen.getByRole("button", { name: "Search" });

        fireEvent.change(searchInput, { target: { value: "example" } });
        fireEvent.click(searchButton);

        expect(mockAppStateContextValue.getCustomers).toHaveBeenCalledWith({
            currentPage: 1,
            searchText: "example",
        });
    });

    it('navigates to "/new-customer" when the "New Customer" button is clicked', () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        renderSearchbar();
        const newCustomerButton = screen.getByRole("button", { name: "New Customer" });

        fireEvent.click(newCustomerButton);

        expect(useNavigate).toHaveBeenCalledWith();
        expect(mockNavigate).toHaveBeenCalledWith("/new-customer");
    });
});

