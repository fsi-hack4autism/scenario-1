import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import moment from "moment";

import ObjectiveData from "../../models/ObjectiveData";

const CounterChart = ({ data }: { data: ObjectiveData[] }) => {
  const dict = data
    .map((d) => ({
      date: moment(d.startTime).startOf("day"),
    }))
    .reduce<{ [key: number]: number }>((result, current) => {
      const key: number = current.date.unix();

      return {
        ...result,
        [key]: (result[key] ?? 0) + 1,
      };
    }, {});

  const formattedData = Object.keys(dict).map((key) => ({
    date: Number(key),
    count: dict[Number(key)],
  }));

  formattedData.sort((a, b) => a.date - b.date);

  const dateFormatter = (date: number) => {
    return new Date(date).toDateString();
  };

  return (
    <ResponsiveContainer aspect={3}>
      <LineChart width={300} height={100} data={data}>
        <XAxis
          dataKey="date"
          type="number"
          domain={[
            formattedData[0].date,
            formattedData[formattedData.length].date,
          ]}
          tickFormatter={dateFormatter}
        />
        <YAxis dataKey="count" type="number" />
        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CounterChart;
