import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

import ObjectiveData from "../../models/ObjectiveData";

const CounterChart = ({ data }: { data: ObjectiveData[] }) => {
  console.log("raw", data);
  const raw = data
    .map((d) => ({
      date: moment(d.startTime).startOf("day").valueOf(),
      duration: moment(d.endTime).diff(moment(d.startTime), "seconds"),
    }))
    .reduce((result, current) => {
      console.log(current.date);
      const exist = result[current.date] != null;
      const min = exist
        ? Math.min(result[current.date][0], current.duration)
        : current.duration;
      const max = exist
        ? Math.max(result[current.date][1], current.duration)
        : current.duration;

      return {
        ...result,
        [current.date]: [min, max],
      };
    }, {} as { [key: number]: number[] });

  const formattedData = Object.keys(raw).map((d) => ({
    date: d,
    duration: raw[Number(d)],
  }));

  console.log("formatted", formattedData);
  const dateFormatter = (date: number) => {
    return moment(Number(date)).format("MMM. DD, yy");
  };

  return (
    <div>
      <BarChart
        width={1200}
        height={250}
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <Bar dataKey="duration" fill="#8884d8" />
        <XAxis dataKey="date" tickFormatter={dateFormatter} />
        <YAxis dataKey="duration" />
        <Tooltip labelFormatter={dateFormatter} />
      </BarChart>
    </div>
  );
};

export default CounterChart;
