import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import moment from "moment";

import ObjectiveData from "../../models/ObjectiveData";
import { Card, CardBody, CardText } from "reactstrap";

const CounterChart = ({ data }: { data: ObjectiveData[] }) => {
  const raw = data
    .map((d) => ({
      date: moment(d.startTime).startOf("day").valueOf(),
      duration: moment(d.endTime).diff(moment(d.startTime), "seconds"),
    }))
    .reduce((result, current) => {
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
    date: Number(d),
    duration: raw[Number(d)],
  }));

  formattedData.sort((a, b) => a.date - b.date);

  const dateFormatter = (date: number) => {
    return moment(Number(date)).format("MMM. DD, yy");
  };

  const latest = formattedData[formattedData.length - 1];

  return (
    <div>
      <Card>
        <CardBody>
          <CardText>
            <strong>
              Latest range for {dateFormatter(Number(latest.date))}:
            </strong>{" "}
            Low of {latest.duration[0]} seconds, high of {latest.duration[1]} seconds
          </CardText>
        </CardBody>
      </Card>
      <BarChart
        width={1200}
        height={250}
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <Bar dataKey="duration" fill="#8884d8" />
        <XAxis dataKey="date" tickFormatter={dateFormatter} order="asc" />
        <YAxis dataKey="duration" />
        <Tooltip labelFormatter={dateFormatter} />
      </BarChart>
    </div>
  );
};

export default CounterChart;
