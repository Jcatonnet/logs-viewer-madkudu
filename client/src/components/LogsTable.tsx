import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import { levelVariant } from '../helpers/formatter';

interface LogEvent {
    id: number;
    timestamp: string;
    service: string;
    level: string;
    message: string;
    lineNumber: number;
}

interface LogsTableProps {
    logs: LogEvent[];
    handleSortChange: (sortField: string) => void;
}

const LogsTable: React.FC<LogsTableProps> = ({ logs, handleSortChange }) => (
    <Table striped bordered hover>
        <thead>
            <tr>
                <th onClick={() => handleSortChange('id')}>ID</th>
                <th onClick={() => handleSortChange('timestamp')}>Timestamp</th>
                <th onClick={() => handleSortChange('service')}>Service</th>
                <th onClick={() => handleSortChange('level')}>Level</th>
                <th>Message</th>
            </tr>
        </thead>
        <tbody>
            {logs.map((log) => (
                <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.service}</td>
                    <td>
                        <Badge pill bg={levelVariant(log.level)}>
                            {log.level}
                        </Badge></td>
                    <td>{log.message}</td>
                </tr>
            ))}
        </tbody>
    </Table>
);

export default LogsTable;
