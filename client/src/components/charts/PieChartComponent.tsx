import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartComponentProps {
    data: { name: string; value: number }[];
}

const generateRandomColors = (count: number): string[] => {
    return Array.from({ length: count }, () =>
        `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
    const pieColors = generateRandomColors(data.length);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={({ name }) => `${name}`}
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartComponent;
