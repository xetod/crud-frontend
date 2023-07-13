import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Customer from "../Customer";

const formData = {
    firstName: "Phill",
    lastName: "Boyce",
    email: "phil.boyce@example.com",
    address: "123 Main St",
    phoneNumber: "555-1234"
};

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
});

describe("Customer", () => {
    test("displays input fields correctly", () => {
        const handleChange = jest.fn();

        const errors = [];

        render(<Customer
            formData={formData}
            errors={errors}
            handleChange={handleChange}
        />);

        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Address")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    });

    test("handles user input and triggers handleChange", () => {
        const handleChange = jest.fn();

        const formData = {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            phoneNumber: ""
        };

        const errors = {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            phoneNumber: ""
        };

        render(
            <Customer
                formData={formData}
                errors={errors}
                handleChange={handleChange}
            />
        );

        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "Phil" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Boyce" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "phil.boyce@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Address"), {
            target: { value: "123 Main St" },
        });
        fireEvent.change(screen.getByLabelText("Phone Number"), {
            target: { value: "555-1234" },
        });

        expect(handleChange).toHaveBeenCalledTimes(5);
    });

    test("displays validation error messages", () => {
        const handleChange = jest.fn();

        const formData = {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            phoneNumber: ""
        };

        const errors = {
            firstName: "First name is required",
            lastName: "Last name is required",
            email: "Invalid email address",
            address: "Address is required",
            phoneNumber: "Invalid phone number"
        };

        render(
            <Customer
                formData={formData}
                errors={errors}
                handleChange={handleChange}
            />
        );

        expect(screen.getByText("First name is required")).toBeInTheDocument();
        expect(screen.getByText("Last name is required")).toBeInTheDocument();
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
        expect(screen.getByText("Address is required")).toBeInTheDocument();
        expect(screen.getByText("Invalid phone number")).toBeInTheDocument();
    });

    test("displays initial form data", () => {
        const handleChange = jest.fn();

        const formData = {
            firstName: "Phil",
            lastName: "Boyce",
            email: "phil.boyce@example.com",
            address: "123 Main St",
            phoneNumber: "555-1234"
        };

        const errors = {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            phoneNumber: ""
        };

        render(
            <Customer
                formData={formData}
                errors={errors}
                handleChange={handleChange}
            />
        );
        expect(screen.getByLabelText("First Name")).toHaveValue("Phil");
        expect(screen.getByLabelText("Last Name")).toHaveValue("Boyce");
        expect(screen.getByLabelText("Email")).toHaveValue("phil.boyce@example.com");
        expect(screen.getByLabelText("Address")).toHaveValue("123 Main St");
        expect(screen.getByLabelText("Phone Number")).toHaveValue("555-1234");
    });

});