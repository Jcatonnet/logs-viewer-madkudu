import React, { useMemo, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useLogs } from '../hooks/useLogs';
import { useFilterOptions } from '../hooks/useFilterOptions';
import LogsTable from './LogsTable';
import LogFilters from './LogsFilters';

interface LogListProps {
    refreshLogs: boolean;
}

const LogsList: React.FC<LogListProps> = ({ refreshLogs }) => {
    const [filters, setFilters] = useState({
        level: '',
        service: '',
        message: '',
        sortBy: 'timestamp',
        order: 'desc',
    });

    const { logs, meta, loading, fetchLogs } = useLogs(filters, refreshLogs);
    const { serviceOptions, levelOptions, loading: optionsLoading } = useFilterOptions();

    const handlePageChange = (pageNumber: number) => {
        fetchLogs(pageNumber);
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
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

    const renderPagination = useMemo(() => {
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
    }, [meta.pages, meta.page]);

    return (
        <div>
            <h4>Log Events</h4>
            <LogFilters
                filters={filters}
                handleFilterChange={handleFilterChange}
                serviceOptions={serviceOptions}
                levelOptions={levelOptions}
                loading={optionsLoading}
            />
            {loading ? (
                <p className="text-center my-5">Loading logs...</p>
            ) : (
                <>
                    <LogsTable logs={logs} handleSortChange={handleSortChange} />
                    <div className="d-flex justify-content-center">
                        <Pagination>{renderPagination}</Pagination>
                    </div>
                </>
            )}
        </div>
    );
};

export default LogsList;
