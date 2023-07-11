import React from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import styles from "./Sale.module.css";

function Sale({ sales, products, errors, submitting, handleChange, handleAddSale, handleRemoveSale }) {
  return (
    <div>
      <Form.Group controlId="formSales">
        <Form.Label className={`${styles.sectionTitleDivider} ${styles.sectionTitle}`}>Sales</Form.Label>
        {sales.map((sale, index) => (
          <Row key={index} className={styles.salesRow}>
            <Col xs={12} sm={8} md={6} lg={4} xl={4}>
              <Form.Label>Product</Form.Label>
              <Form.Control
                as="select"
                name="productId"
                value={sale.productId}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].productId`]}
                data-testid="product"
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
            <Col xs={6} sm={4} md={3} lg={2} xl={2}>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={sale.quantity || ""}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].quantity`]}
                min="0"
                data-testid="quantity"
              />
              <Form.Control.Feedback type="invalid" data-testid="quantity-error">
                {errors[`sales[${index}].quantity`]}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} xl={2}>
              <Form.Label>Unit Price</Form.Label>
              <Form.Control
                type="number"
                name="unitPrice"
                value={sale.unitPrice || ""}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].unitPrice`]}
                min="0"
                data-testid="unitPrice"
              />
              <Form.Control.Feedback type="invalid">
                {errors[`sales[${index}].unitPrice`]}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} xl={2}>
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="number"
                name="totalPrice"
                value={sale.totalPrice || ""}
                onChange={(event) => handleChange(event, index)}
                isInvalid={!!errors[`sales[${index}].totalPrice`]}
                min="0"
                data-testid="totalPrice"
                disabled
              />
              <Form.Control.Feedback type="invalid">
                {errors[`sales[${index}].totalPrice`]}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2} xl={2} className={styles.removeButtonContainer}>
              {index === sales.length - 1 && (
                <Button
                  variant="success"
                  onClick={handleAddSale}
                  disabled={submitting}
                  data-testid="addSale"
                >
                  Add
                </Button>
              )}
              {index !== sales.length - 1 && (
                <Button
                  variant="danger"
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

export default Sale;
