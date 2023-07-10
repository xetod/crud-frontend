import React from "react";
import { Form, Button, Col, Row } from "react-bootstrap";

function Sales({ sales, products, errors, submitting, handleChange, handleAddSale, handleRemoveSale }) {
  return (
    <div id="salesSection">
      <Form.Group controlId="formSales">
        <Form.Label>Sales</Form.Label>
        {sales.map((sale, index) => (
          <Row key={index}>
            <Col>
              <Form.Label>Product</Form.Label>
              <Form.Control
                as="select"
                name="productId"
                value={sale.productId}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].productId`]}
              >
                <option value={0}>Select a product</option>
                {products && products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors[`sales[${index}].productId`]}
              </Form.Control.Feedback>
            </Col>
            <Col xs="auto">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                data-testid="quantity"
                name="quantity"
                value={sale.quantity}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].quantity`]}
                min="0"
              />
              <Form.Control.Feedback type="invalid">
                {errors[`sales[${index}].quantity`]}
              </Form.Control.Feedback>
            </Col>
            <Col xs="auto">
              <Form.Label>Unit Price</Form.Label>
              <Form.Control
                // type="number"
                name="unitPrice"
                value={sale.unitPrice}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].unitPrice`]}
                min="0"
              />
              <Form.Control.Feedback type="invalid">
                {errors[`sales[${index}].unitPrice`]}
              </Form.Control.Feedback>
            </Col>
            <Col xs="auto">
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                // type="number"
                name="totalPrice"
                value={sale.totalPrice}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].totalPrice`]}
                min="0"
              />
              <Form.Control.Feedback type="invalid">
                {errors[`sales[${index}].totalPrice`]}
              </Form.Control.Feedback>
            </Col>
            <Col xs="auto">
              {index === sales.length - 1 && (
                <Button
                  variant="secondary"
                  onClick={handleAddSale}
                  disabled={submitting}
                >
                  Add
                </Button>
              )}
              {index !== sales.length - 1 && (
                <Button
                  variant="secondary"
                  onClick={() => handleRemoveSale(index)}
                  disabled={submitting}
                >
                  Remove
                </Button>
              )}
            </Col>
          </Row>
        ))}
      </Form.Group>
    </div>
  );
}

export default Sales;
