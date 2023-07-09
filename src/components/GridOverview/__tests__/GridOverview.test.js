import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import GridOverview from "../GridOverview";
import AppStateContext from "../../../context/AppStateContext";

// Mock the context value
const mockContextValue = {
  state: {
    data: {
      results: [
        {
          customerId: 1,
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@example.com",
          sales: [
            { productName: "Product 1" },
            { productName: "Product 2" },
          ],
        },
      ],
      pagination: {
        totalPages: 3,
      },
    },
    loading: false,
    error: null,
  },
  getCustomers: jest.fn(),
};

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("GridOverview", () => {
  beforeEach(() => {
    render(
      <AppStateContext.Provider value={mockContextValue}>
        <Router>
          <GridOverview />
        </Router>
      </AppStateContext.Provider>
    );
  });

  it("renders table with customer data", () => {
    // Check if the table headers are rendered
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Sale")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Check if the customer data is rendered
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("johndoe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("renders pagination buttons", () => {
    // Check if the pagination buttons are rendered
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("changes page on pagination button click", () => {
    const paginationButton = screen.getByRole("button", { name: "2" });

    fireEvent.click(paginationButton);

    expect(mockContextValue.getCustomers).toHaveBeenCalledTimes(2);
    expect(mockContextValue.getCustomers).toHaveBeenCalledWith({
      currentPage: 2,
    });
  });

  it("calls handleEditCustomer on Edit button click", () => {
    const editButton = screen.getByRole("button", { name: "Edit" });

    fireEvent.click(editButton);

    expect(mockContextValue.getCustomers).toHaveBeenCalledTimes(1);
    expect(mockContextValue.getCustomers).toHaveBeenCalledWith({
      currentPage: 1,
    });

    expect(mockContextValue.getCustomers).toHaveBeenCalledWith({
      currentPage: 1,
    });
  });

  it("renders empty state when no data available", () => {
    // Mock the empty state in the context
    const emptyContextValue = {
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        data: null,
      },
    };
    render(
      <AppStateContext.Provider value={emptyContextValue}>
        <Router>
          <GridOverview />
        </Router>
      </AppStateContext.Provider>
    );

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    // Mock the loading state in the context
    const loadingContextValue = {
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        loading: true,
      },
    };
    render(
      <AppStateContext.Provider value={loadingContextValue}>
        <Router>
          <GridOverview />
        </Router>
      </AppStateContext.Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  
});
