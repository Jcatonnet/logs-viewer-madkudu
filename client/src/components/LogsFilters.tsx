import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

interface Filters {
    level: string;
    service: string;
    message: string;
}

interface LogFiltersProps {
    filters: Filters;
    handleFilterChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const LogFilters: React.FC<LogFiltersProps> = ({ filters, handleFilterChange }) => (
    <Form>
        <Row>
            <Col>
                <Form.Group controlId="filterService">
                    <Form.Label>Service</Form.Label>
                    <Form.Control
                        type="text"
                        name="service"
                        value={filters.service}
                        onChange={handleFilterChange}
                        placeholder="Service name"
                    />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="filterLevel">
                    <Form.Label>Level</Form.Label>
                    <Form.Control
                        as="select"
                        name="level"
                        value={filters.level}
                        onChange={handleFilterChange}
                    >
                        <option value="">All</option>
                        <option value="INFO">INFO</option>
                        <option value="WARNING">WARNING</option>
                        <option value="ERROR">ERROR</option>
                        <option value="DEBUG">DEBUG</option>
                        <option value="CRITICAL">CRITICAL</option>
                    </Form.Control>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="filterMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        type="text"
                        name="message"
                        value={filters.message}
                        onChange={handleFilterChange}
                        placeholder="Search message"
                    />
                </Form.Group>
            </Col>
        </Row>
    </Form>
);

export default LogFilters;
