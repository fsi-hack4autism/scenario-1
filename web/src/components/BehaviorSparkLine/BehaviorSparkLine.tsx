import React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import BehaviorSparkLineProps from "./BehaviorSparkLineProps";

const BehaviorSparkLine = ({ data, behavior }: BehaviorSparkLineProps) => {

    const xMax = new Date().getTime();
    const xMin = xMax - (1000 * 60 * 60 * 24 * 30);

    const dateFormatter = (date: number) => {
        return new Date(date).toDateString()
    };

    return (
        <ResponsiveContainer aspect={3}>
            <LineChart data={data} style={{ cursor: "pointer" }}>
                <XAxis hide dataKey="date" type="number" domain={[xMin, xMax]} tickFormatter={dateFormatter} />
                <YAxis hide dataKey="total" type="number" />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BehaviorSparkLine;