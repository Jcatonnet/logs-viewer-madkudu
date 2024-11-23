import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import StackedBarChartComponent from '../components/charts/StackedBarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import { useAggregatedData } from '../hooks/useAggregatedData';

const COLORS = ['#00C49F', '#FF0000', '#FFBB28', '#0088FE', '#FF8042'];

interface GraphsPageProps {
    refreshLogs: boolean;
}

const GraphsPage: React.FC<GraphsPageProps> = ({ refreshLogs }) => {
    const [groupBy, setGroupBy] = useState<string>('service');
    const { data, loading } = useAggregatedData(groupBy, refreshLogs);

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
                .sort((a, b) => {
                    const aTotal = Object.values(a.levels || {}).reduce((sum, count) => sum + count, 0);
                    const bTotal = Object.values(b.levels || {}).reduce((sum, count) => sum + count, 0);
                    return bTotal - aTotal;
                })
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
                ? Array.from(new Set(data.flatMap((item) => Object.keys(item.services || {}))))
                : [];

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Graphs</h2>
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
                <PieChartComponent data={generateTopMessagesData()} />
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

export default GraphsPage;
