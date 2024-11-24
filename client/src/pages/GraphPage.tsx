import React, { useMemo, useState } from 'react';
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

    const processChartData = useMemo(() => {
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
    }, [data, groupBy]);

    const generateTopMessagesData = useMemo(() => {
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
    }, [data, groupBy]);

    const keys = useMemo(() =>
        groupBy === 'service'
            ? ['INFO', 'ERROR', 'WARNING', 'DEBUG', 'CRITICAL']
            : groupBy === 'level'
                ? Array.from(new Set(data.flatMap((item) => Object.keys(item.services || {}))))
                : [],
        [groupBy, data]
    );

    if (loading) return <p className="text-center my-5">Loading...</p>;

    return (
        <div>
            <h2>Graph logs view</h2>
            <Form>
                <div className='mb-4 mt-4'>
                    <Row>
                        <Col xs={12} md={4}>
                            <Form.Group controlId="groupBy">
                                <Form.Label>Select your aggregated view:</Form.Label>
                                <Form.Control as="select" value={groupBy} onChange={handleGroupByChange}>
                                    <option value="service">Service</option>
                                    <option value="level">Level</option>
                                    <option value="message">Message</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </div>

            </Form>
            <div className="d-flex justify-content-center align-items-center mt-5">
                {groupBy === 'message' ? (
                    <div className="d-flex flex-column align-items-center w-100">
                        <p className="mb-3">Top 10 messages</p>
                        <PieChartComponent data={generateTopMessagesData} />
                    </div>
                ) : (
                    <div className="d-flex flex-column align-items-center w-100">
                        {groupBy === 'service' && <p className="mb-3">Levels distribution per service</p>}
                        {groupBy === 'level' && <p className="mb-3">Services distribution per level</p>}
                        <StackedBarChartComponent
                            data={processChartData}
                            keys={keys}
                            colors={COLORS}
                            xAxisKey="group"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraphsPage;
