import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import styles from "./Searchbar.module.css";
import AppStateContext from "../../context/AppStateContext";

const Searchbar = () => {
    const navigate = useNavigate();
    const { getCustomers } = useContext(AppStateContext);
    const [searchText, setSearchText] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        getCustomers({
            currentPage: 1,
            searchText: searchText
        });
    };

    const handleNewCustomer = () => {
        navigate("/new-customer");
    };

    return (
        <div>
            <Form onSubmit={handleSearch} className="mb-3">
                <Row>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit">
                            Search
                        </Button>
                        <Button variant="success" onClick={handleNewCustomer} className={styles.divider}>
                            New Customer
                        </Button>
                    </Col>
                </Row>

            </Form>
        </div>
    );
};

export default Searchbar;
