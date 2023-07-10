import React from "react";
import { render, screen, act, waitFor, fireEvent, getByLabelText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Router, RouterProvider, createMemoryRouter } from "react-router-dom";
import NewCustomer from "../NewCustomer";
import AppStateContext from "../../../../context/AppStateContext";
import { createCustomer } from '../../../../services/customers/customerServices';
import GridOverview from "../../../GridOverview/GridOverview";

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const mockAppStateContextValue = {
    state: {
        products: [
            {
                "productId": 1,
                "name": "Gorgeous Leather Bench",
                "price": 660.57
            },
            {
                "productId": 2,
                "name": "Awesome Rubber Coat",
                "price": 595.41
            }
        ]
    }
};

jest.mock('../../../../services/customers/customerServices', () => ({
    createCustomer: jest.fn(),
}));

const setupMyTest = () => {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: <>Navigated from Start</>,
            },
            {
                path: '/starting/path',
                // Render the component causing the navigate to '/'
                element: <GridOverview />,
            },
        ],
        {
            // Set for where you want to start in the routes. Remember, KISS (Keep it simple, stupid) the routes.
            initialEntries: ['/'],
            // We don't need to explicitly set this, but it's nice to have.
            initialIndex: 0,
        }
    )

    render(<RouterProvider router={router} />)

    // Objectify the router so we can explicitly pull when calling setupMyTest
    return { router }
}

describe("NewCustomer", () => {

    it("should render the form fields correctly", () => {

        render(
            <AppStateContext.Provider value={mockAppStateContextValue}>
                <MemoryRouter>
                    <NewCustomer />
                </MemoryRouter>
            </AppStateContext.Provider>
        );

        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Address")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    });

    it("should display validation errors on submit when required fields are empty", async () => {
        render(
            <AppStateContext.Provider value={mockAppStateContextValue}>
                <MemoryRouter>
                    <NewCustomer />
                </MemoryRouter>
            </AppStateContext.Provider>
        );

        const submitButton = screen.getByRole("button", { name: "Submit" });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("First name is required")).toBeInTheDocument();
            expect(screen.getByText("Last name is required")).toBeInTheDocument();
            expect(screen.getByText("Email is required")).toBeInTheDocument();
            expect(screen.getByText("Address is required")).toBeInTheDocument();
            expect(screen.getByText("Phone number is required")).toBeInTheDocument();
        });
    });  
});