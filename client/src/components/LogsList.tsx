import React, { useEffect, useState } from 'react';
import { Table, Pagination, Form, Row, Col, Button } from 'react-bootstrap';
import apiClient from '../services/apiClient';
import useAuth from '../hooks/useAuth';

interface LogEvent {
    id: number;
    timestamp: string;
    service: string;
    level: string;
    message: string;
    lineNumber: number;
}

interface MetaData {
    total: number;
    page: number;
    pages: number;
}

const LogsList: React.FC = () => {
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [meta, setMeta] = useState<MetaData>({ total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState<boolean>(false);
    const { getAccessToken } = useAuth();

    const [filters, setFilters] = useState({
        level: '',
        service: '',
        message: '',
        sortBy: 'timestamp',
        order: 'desc',
    });

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const token = await getAccessToken();
            const response = await apiClient.get('/logs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page,
                    limit: 25,
                    ...filters,
                },
            });

            setLogs(response.data.data);
            setMeta(response.data.meta);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    const handlePageChange = (pageNumber: number) => {
        fetchLogs(pageNumber);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSortChange = (sortField: string) => {
        setFilters({
            ...filters,
            sortBy: sortField,
            order: filters.order === 'asc' ? 'desc' : 'asc',
        });
    };

    const renderPagination = () => {
        const items = [];
        for (let number = 1; number <= meta.pages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === meta.page}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <div>
            <h2>Log Events</h2>
            <Form>
                <Row>
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
                                <option value="WARN">WARN</option>
                                <option value="ERROR">ERROR</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
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
                    <Col className="d-flex align-items-end">
                        <Button variant="primary" onClick={() => fetchLogs()}>
                            Apply Filters
                        </Button>
                    </Col>
                </Row>
            </Form>
            {loading ? (
                <p>Loading logs...</p>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th onClick={() => handleSortChange('id')}>ID</th>
                                <th onClick={() => handleSortChange('timestamp')}>Timestamp</th>
                                <th onClick={() => handleSortChange('service')}>Service</th>
                                <th onClick={() => handleSortChange('level')}>Level</th>
                                <th>Message</th>
                                <th onClick={() => handleSortChange('lineNumber')}>Line Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.id}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.service}</td>
                                    <td>{log.level}</td>
                                    <td>{log.message}</td>
                                    <td>{log.lineNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>{renderPagination()}</Pagination>
                </>
            )}
        </div>
    );
};

export default LogsList;
