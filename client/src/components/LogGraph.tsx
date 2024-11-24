import React, { useEffect, useState, useCallback } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import apiClient from '../services/apiClient';
import useAuth from '../hooks/useAuth';
import StackedBarChartComponent from './charts/StackedBarChartComponent';
import PieChartComponent from './charts/PieChartComponent';

const COLORS = ['#198754', '#FF0000', '#FFC107', '#0D6EFD', '#212529'];

interface AggregatedData {
    group: string;
    levels?: { [key: string]: number };
    services?: { [key: string]: number };
}

interface LogGraphProps {
    refreshLogs: boolean;
}

const LogGraph: React.FC<LogGraphProps> = ({ refreshLogs }) => {
    const { getAccessToken } = useAuth();
    const [groupBy, setGroupBy] = useState<string>('service');
    const [data, setData] = useState<AggregatedData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAggregatedData = useCallback(async () => {
        setLoading(true);
        try {
            const token = await getAccessToken();
            const response = await apiClient.get('/logs/aggregate', {
                headers: { Authorization: `Bearer ${token}` },
                params: { groupBy },
            });
            setData(response.data || []);
        } catch (error) {
            console.error('Error fetching aggregated data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [getAccessToken, groupBy]);

    useEffect(() => {
        fetchAggregatedData();
    }, [fetchAggregatedData, refreshLogs]);

    const handleGroupByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupBy(e.target.value);
    };

    const processChartData = () => {
        if (groupBy === 'service') {
            return data.map((item) => ({
                group: item.group,
                ...item.levels,
            }));
        } else if (groupBy === 'level') {
            return data.map((item) => ({
                group: item.group,
                ...item.services,
            }));
        }
        return [];
    };

    const generateTopMessagesData = () => {
        if (groupBy === 'message') {
            return data
                .sort((a, b) => (b.levels?.total || 0) - (a.levels?.total || 0))
                .slice(0, 10)
                .map((item) => ({
                    name: item.group,
                    value: Object.values(item.levels || {}).reduce((sum, count) => sum + count, 0),
                }));
        }
        return [];
    };

    const keys =
        groupBy === 'service'
            ? ['INFO', 'ERROR', 'WARNING', 'DEBUG', 'CRITICAL']
            : groupBy === 'level'
                ? Array.from(
                    new Set(
                        data.flatMap((item) =>
                            Object.keys(item.services || {})
                        )
                    )
                )
                : [];

    if (loading) return <p className="text-center my-5">Loading...</p>;

    return (
        <div>
            <Form>
                <Row>
                    <Col xs={12} md={4}>
                        <Form.Group controlId="groupBy">
                            <Form.Label>Aggregate By</Form.Label>
                            <Form.Control as="select" value={groupBy} onChange={handleGroupByChange}>
                                <option value="service">Service</option>
                                <option value="level">Level</option>
                                <option value="message">Message</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {groupBy === 'message' ? (
                <PieChartComponent
                    data={generateTopMessagesData()}
                />
            ) : (
                <StackedBarChartComponent
                    data={processChartData()}
                    keys={keys}
                    colors={COLORS}
                    xAxisKey="group"
                />
            )}
        </div>
    );
};

export default LogGraph;
