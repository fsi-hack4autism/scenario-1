import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import moment from "moment";

import ObjectiveData from "../../models/ObjectiveData";

const CounterChart = ({ data }: { data: ObjectiveData[] }) => {

  const dict = data
    .map((d) => ({
      date: moment(d.startTime).startOf("day"),
    }))
    .reduce<{ [key: number]: number }>((result, current) => {
      const key: number = current.date.valueOf();

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
    return moment(date).format("MMM. DD, yy");
  };

  return (
    <div>
      <LineChart width={1200} height={500} data={formattedData}>
        <XAxis
          dataKey="date"
          tickFormatter={dateFormatter}
        />
        <YAxis dataKey="count" />

        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
        />
        <Tooltip
            labelFormatter={dateFormatter}
        />
      </LineChart>
    </div>
  );
};

export default CounterChart;
