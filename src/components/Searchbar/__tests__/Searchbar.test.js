import React from "react";
import * as router from "react-router";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, RouterProvider, createMemoryRouter } from "react-router-dom";
import AppStateContext from "../../../context/AppStateContext";
import Searchbar from "../Searchbar";

const mockAppStateContextValue = {
    fetchCustomers: jest.fn(),
    dispatch: jest.fn(),
    state: {
        searchText: ""
    }
};

const setupRouter = () => {
    const router = createMemoryRouter(
        [
            {
                path: "/new-customer",
                element: <>Navigated from Start</>,
            }
        ],
        {
            initialEntries: ["/new-customer"],
            initialIndex: 0,
        }
    )
    render(<RouterProvider router={router} />)
    return { router }
}

beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => jest.fn())
})

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
});

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


    it("should update search text when input value changes", () => {
        renderSearchbar();

        const searchInput = screen.getByPlaceholderText("Search");

        fireEvent.change(searchInput, { target: { value: "Test" } });

        expect(searchInput.value).toBe("Test");
    });


    it("should call handleSearch function on form submission", () => {
        renderSearchbar();

        const searchButton = screen.getByRole("button", { name: "Search" });

        fireEvent.click(searchButton);

        expect(mockAppStateContextValue.dispatch).toHaveBeenCalledWith({
            type: "SET_SEARCH_TEXT",
            payload: "",
        });

    });

    it("should navigate to the new customer page on button click", () => {
        const { router } = setupRouter()

        render(
            <AppStateContext.Provider value={mockAppStateContextValue}>
                <MemoryRouter>
                    <Searchbar />
                </MemoryRouter>
            </AppStateContext.Provider>
        );

        const newCustomerButton = screen.getByRole("button", { name: "New Customer", });

        fireEvent.click(newCustomerButton);

        expect(router.state.location.pathname).toEqual("/new-customer");
    });
});