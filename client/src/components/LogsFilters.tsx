import React, { memo } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

interface Filters {
    level: string;
    service: string;
    message: string;
}

interface LogFiltersProps {
    filters: Filters;
    handleFilterChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    serviceOptions: string[];
    levelOptions: string[];
    loading: boolean;
}

const LogFilters: React.FC<LogFiltersProps> = memo(({
    filters,
    handleFilterChange,
    serviceOptions,
    levelOptions,
    loading,
}) => (
    <Form>
        <Row className='mb-4'>
            <Col>
                <Form.Group controlId="filterService">
                    <Form.Label>Service</Form.Label>
                    <Form.Control
                        as="select"
                        name="service"
                        value={filters.service}
                        onChange={handleFilterChange}
                        disabled={loading}
                    >
                        <option value="">All</option>
                        {serviceOptions.map((service, idx) => (
                            <option key={idx} value={service}>
                                {service.toLowerCase()}
                            </option>
                        ))}
                    </Form.Control>
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
                        disabled={loading}
                    >
                        <option value="">All</option>
                        {levelOptions.map((level, idx) => (
                            <option key={idx} value={level}>
                                {level.toLowerCase()}
                            </option>
                        ))}
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
));

export default LogFilters;
