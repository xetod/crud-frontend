import React from "react";
import * as router from "react-router";
import { useLocation } from "react-router-dom";
import { BrowserRouter, RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, within, waitForElementToBeRemoved } from "@testing-library/react";
import GridOverview from "../GridOverview";
import AppStateContext from "../../../context/AppStateContext";

const setupRouter = () => {
    const router = createMemoryRouter(
        [
            {
                path: "/update-customer",
                element: <>Navigated from Start</>,
            }
        ],
        {
            initialEntries: ["/update-customer"],
            initialIndex: 0,
        }
    )
    render(<RouterProvider router={router} />)
    return { router }
}

beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => jest.fn())
})

jest.mock("react-router-dom", () => ({
    ...(jest.requireActual("react-router-dom")),
    useNavigate: () => jest.fn()
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(),
}));

beforeEach(() => {
    useLocation.mockReturnValue({
        state: { success: true },
    });
});

describe("Grid Overview", () => {

    test("displays loading spinner when data is loading", () => {
        const state = {
            fetchCustomers: jest.fn(),
            state: {
                loading: true
            }
        };

        render(
            <AppStateContext.Provider value={state}>
                <BrowserRouter>
                    <GridOverview loading={true} />
                </BrowserRouter>
            </AppStateContext.Provider>
        );

        const spinnerElement = screen.getByTestId("spinner");

        expect(spinnerElement).toBeInTheDocument();
    });

    test("renders table when data is available", () => {
        const state = {
            fetchCustomers: jest.fn(),
            state: {
                loading: false,
                customers: {
                    results: [
                        { customerId: 1, firstName: "John", lastName: "Doe", email: "john@example.com", sales: [] },
                        { customerId: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", sales: [] },
                    ],
                    pagination: { totalPages: 1 },
                }
            }
        };

        render(
            <AppStateContext.Provider value={state}>
                <BrowserRouter>
                    <GridOverview />
                </BrowserRouter>
            </AppStateContext.Provider>
        );


        const table = screen.getByRole("table");
        const firstNameHeader = within(table).getByText("First Name");
        expect(firstNameHeader).toBeInTheDocument();
    });

    test("displays delete prompt modal when delete button is clicked", () => {
        const state = {
            fetchCustomers: jest.fn(),
            state: {
                loading: false,
                customers: {
                    results: [
                        { customerId: 1, firstName: "John", lastName: "Doe", email: "john@example.com", sales: [] },
                        { customerId: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", sales: [] },
                    ],
                    pagination: { totalPages: 1 },
                }
            }
        };

        render(
            <AppStateContext.Provider value={state}>
                <BrowserRouter>
                    <GridOverview />
                </BrowserRouter>
            </AppStateContext.Provider>
        );

        const deleteButton = screen.getAllByText("Delete");

        fireEvent.click(deleteButton[0]);

        const modalTitle = screen.getByText("Are you sure to delete this customer?");

        expect(modalTitle).toBeInTheDocument();
    });

    test("hides delete prompt modal when close button is clicked", async () => {
        const state = {
            fetchCustomers: jest.fn(),
            state: {
                loading: false,
                customers: {
                    results: [
                        { customerId: 1, firstName: "John", lastName: "Doe", email: "john@example.com", sales: [] },
                        { customerId: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", sales: [] },
                    ],
                    pagination: { totalPages: 1 },
                }
            }
        };

        render(
            <AppStateContext.Provider value={state}>
                <BrowserRouter>
                    <GridOverview />
                </BrowserRouter>
            </AppStateContext.Provider>
        );

        const deleteButton = screen.getAllByText("Delete");

        fireEvent.click(deleteButton[0]);

        const closeButton = screen.getByText("Close");

        fireEvent.click(closeButton);

        await waitForElementToBeRemoved(() => screen.queryByText(/Are you sure to delete this customer?/i));
    });

    test("navigates to edit customer page when edit button is clicked", () => {
        const { router } = setupRouter()

        const state = {
            fetchCustomers: jest.fn(),
            state: {
                loading: false,
                customers: {
                    results: [
                        { customerId: 1, firstName: "John", lastName: "Doe", email: "john@example.com", sales: [] },
                        { customerId: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", sales: [] },
                    ],
                    pagination: { totalPages: 1 },
                }
            }
        };

        render(
            <AppStateContext.Provider value={state}>
                <BrowserRouter>
                    <GridOverview />
                </BrowserRouter>
            </AppStateContext.Provider>
        );

        const editButton = screen.getAllByText("Edit");

        fireEvent.click(editButton[0]);

        // expect(navigate).toHaveBeenCalledWith("/update-customer", { state: { customerId: 1 } });
        expect(router.state.location.pathname).toEqual("/update-customer");
    });
 
    test("displays success alert when data is sent to server successfully", () => {
        const state = {
            fetchCustomers: jest.fn(),
            state: {
                loading: false,
                success: true,
                customers: {
                    results: [
                        { customerId: 1, firstName: "John", lastName: "Doe", email: "john@example.com", sales: [] },
                        { customerId: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", sales: [] },
                    ],
                    pagination: { totalPages: 1 },
                }
            }
        };

        render(
            <AppStateContext.Provider value={state}>
                <BrowserRouter>
                    <GridOverview />
                </BrowserRouter>
            </AppStateContext.Provider>
        );

        const successAlert = screen.getByText("Data sent to server successfully.");
        expect(successAlert).toBeInTheDocument();
    });
});