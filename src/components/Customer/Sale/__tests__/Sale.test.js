import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Sale from "../Sale";

const sales = [
  {
    productId: 1,
    quantity: 5,
    unitPrice: 10,
    totalPrice: 50,
  },
  {
    productId: 2,
    quantity: 3,
    unitPrice: 15,
    totalPrice: 45,
  },
];

const products = [
  {
    productId: 1,
    name: "Product 1",
  },
  {
    productId: 2,
    name: "Product 2",
  },
];

const handleChange = jest.fn();
const handleAddSale = jest.fn();
const handleRemoveSale = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

describe("Sale", () => {
  it("renders sales form correctly", async () => {
    render(
      <Sale
        sales={sales}
        products={products}
        errors={{}}
        submitting={false}
        handleChange={handleChange}
        handleAddSale={handleAddSale}
        handleRemoveSale={handleRemoveSale}
      />
    );

    // Check if sales form elements are rendered correctly
    expect(screen.getByLabelText("Sales")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("triggers handleChange when a product is selected", () => {
    render(
      <Sale
        sales={sales}
        products={products}
        errors={{}}
        submitting={false}
        handleChange={handleChange}
        handleAddSale={handleAddSale}
        handleRemoveSale={handleRemoveSale}
      />
    );

    const productSelects = screen.getAllByRole("combobox");

    fireEvent.change(productSelects[0], { target: { value: "1" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "productId", value: "1" }),
      }),
      0
    );
  });

  it("triggers handleChange when a quantity is entered", async () => {
    const handleChange = jest.fn();

    render(
      <Sale
        sales={sales}
        products={products}
        errors={{}}
        submitting={false}
        handleChange={handleChange}
        handleAddSale={handleAddSale}
        handleRemoveSale={handleRemoveSale}
      />
    );

    const quantityInputs = screen.getAllByLabelText("Quantity");

    fireEvent.change(quantityInputs[0], { target: { value: "10" } });

    expect(handleChange).toHaveBeenCalled();

    expect(quantityInputs[0].value).toBe("1");
  });

  it("triggers handleAddSale when 'Add' button is clicked", () => {
    render(
      <Sale
        sales={sales}
        products={products}
        errors={{}}
        submitting={false}
        handleChange={handleChange}
        handleAddSale={handleAddSale}
        handleRemoveSale={handleRemoveSale}
      />
    );

    var addButton = screen.getByText("Add")

    fireEvent.click(addButton);

    expect(handleAddSale).toHaveBeenCalled();
  });

  it("triggers handleRemoveSale when 'Remove' button is clicked", () => {
    render(
      <Sale
        sales={sales}
        products={products}
        errors={{}}
        submitting={false}
        handleChange={handleChange}
        handleAddSale={handleAddSale}
        handleRemoveSale={handleRemoveSale}
      />
    );

    const removeButtons = screen.getAllByText("Remove");

    fireEvent.click(removeButtons[0]);

    expect(handleRemoveSale).toHaveBeenCalledWith(0);
  });
});
