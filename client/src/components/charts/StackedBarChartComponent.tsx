import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StackedBarChartComponentProps {
    data: any[];
    keys: string[];
    colors: string[];
    xAxisKey: string;
}

const StackedBarChartComponent: React.FC<StackedBarChartComponentProps> = ({ data, keys, colors, xAxisKey }) => (
    <ResponsiveContainer width="80%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
                <Bar key={key} dataKey={key} stackId="a" fill={colors[index % colors.length]} />
            ))}
        </BarChart>
    </ResponsiveContainer>
);

export default StackedBarChartComponent;
