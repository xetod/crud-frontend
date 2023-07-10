import React from "react";
import * as router from 'react-router'
import { render, screen, act, waitFor, fireEvent, getByLabelText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Router, RouterProvider, Routes, createMemoryRouter, useNavigate } from "react-router-dom";
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
const navigate = jest.fn();

jest.mock('../../../../services/customers/customerServices', () => ({
    createCustomer: jest.fn().mockResolvedValue({ success: true }),
}));

const setupRouter = () => {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: <>Navigated from Start</>,
            }
        ],
        {
            initialEntries: ['/'],
            initialIndex: 0,
        }
    )
    render(<RouterProvider router={router} />)
    return { router }
}

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

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

    test("removes a sale when the 'Remove Sale' button is clicked", () => {
        render(
            <AppStateContext.Provider value={mockAppStateContextValue}>
                <MemoryRouter>
                    <NewCustomer />
                </MemoryRouter>
            </AppStateContext.Provider>
        );

        fireEvent.click(screen.getByTestId("addSale"));

        fireEvent.click(screen.getAllByText("Remove")[0]);

        expect(screen.getAllByTestId("product").length).toBe(1);
    });

    test("adds a new sale when the 'Add Sale' button is clicked", () => {
        render(
            <AppStateContext.Provider value={mockAppStateContextValue}>
                <MemoryRouter>
                    <NewCustomer />
                </MemoryRouter>
            </AppStateContext.Provider>
        );

        fireEvent.click(screen.getByTestId("addSale"));

        expect(screen.getAllByTestId("product").length).toBe(2);
    });

    test("displays an error message for quantity less than 1", async () => {
        render(
            <AppStateContext.Provider value={mockAppStateContextValue}>
                <MemoryRouter>
                    <NewCustomer />
                </MemoryRouter>
            </AppStateContext.Provider>
        )

        fireEvent.click(screen.getByTestId("addSale"));

        fireEvent.change(screen.getAllByTestId("quantity")[0], {
            target: { value: "0" },
        });

        fireEvent.click(screen.getByText("Submit"))

        expect(screen.getAllByTestId("quantity-error")[0]).toBeInTheDocument();

        expect(createCustomer).not.toHaveBeenCalled();
    });

    test("triggers form submission when all fields are valid", async () => {
        const { router } = setupRouter()

        render(
            <AppStateContext.Provider value={mockAppStateContextValue}>
                <MemoryRouter>
                    <NewCustomer />
                </MemoryRouter>
            </AppStateContext.Provider>
        );

        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Address"), {
            target: { value: "123 Main St" },
        });
        fireEvent.change(screen.getByLabelText("Phone Number"), {
            target: { value: "555-1234" },
        });


        fireEvent.change(screen.getAllByTestId("product")[0], { target: { value: "1" } });
        fireEvent.change(screen.getAllByTestId("quantity")[0], { target: { value: "1" } });
        fireEvent.change(screen.getAllByTestId("unitPrice")[0], { target: { value: "1" } });
        fireEvent.change(screen.getAllByTestId("totalPrice")[0], { target: { value: "1" } });

        fireEvent.click(screen.getByText("Submit"));

        await waitFor(() => expect(createCustomer).toHaveBeenCalled());

        expect(createCustomer).toHaveBeenCalledWith({
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            address: "123 Main St",
            phoneNumber: "555-1234",
            sales: [
                {
                    productId: "1",
                    quantity: "1",
                    unitPrice: "1",
                    totalPrice: "1",
                },
            ],
        });

        await waitFor(() => {
            expect(router.state.location.pathname).toEqual('/')
        })
    });
});