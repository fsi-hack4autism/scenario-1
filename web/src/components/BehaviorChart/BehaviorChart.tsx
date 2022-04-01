import BehaviorReportDataItem from "../../models/BehaviorReportDataItem";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const BehaviorChart = ({data}: {data: BehaviorReportDataItem[]}) => 
    {
        const xMax = new Date().getTime();
        const xMin = xMax - (1000*60*60*24*30);

        const dateFormatter = (date : number) => {
            return new Date(date).toDateString()
          };
          
        return (
            <ResponsiveContainer width={600} aspect={3}>
                <LineChart width={300} height={100} data={data}>
                    <XAxis dataKey="date" type="number" domain={[xMin, xMax]} tickFormatter={dateFormatter} />
                    <YAxis dataKey="total" type="number" />
                    <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        )
    }

export default BehaviorChart;