import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const sessionEvents = [
    {
        "event_id": "device1.0",
        "device_id": "device1",
        "button_id": "1",
        "start_time": "2021-04-29T12:30:00.1679734Z",
        "end_time": "2021-04-29T12:30:01.1679734Z"
    },
    {
        "event_id": "device1.1",
        "device_id": "device1",
        "button_id": "1",
        "start_time": "2021-04-29T12:40:00.1679734Z",
        "end_time": "2021-04-29T12:40:01.1679734Z"
    }
];

export default function EventsTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Event Id</TableCell>
            <TableCell>Device Id</TableCell>
            <TableCell>Button Id</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessionEvents.map((sessionEvent) => (
            <TableRow key={sessionEvent.event_id}>
              <TableCell component="th" scope="row">
                {sessionEvent.event_id}
              </TableCell>
              <TableCell align="right">{sessionEvent.device_id}</TableCell>
              <TableCell align="right">{sessionEvent.button_id}</TableCell>
              <TableCell align="right">{sessionEvent.start_time}</TableCell>
              <TableCell align="right">{sessionEvent.end_time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
