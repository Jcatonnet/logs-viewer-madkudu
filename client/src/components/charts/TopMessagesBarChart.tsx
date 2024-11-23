import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TopMessagesBarChartProps {
    data: { message: string; count: number }[];
    topN: number;
    color: string;
}

const TopMessagesBarChart: React.FC<TopMessagesBarChartProps> = ({ data, topN, color }) => {
    const topData = data.slice(0, topN);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="message" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={color} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TopMessagesBarChart;
