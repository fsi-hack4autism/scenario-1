import React, { Component } from 'react';
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


class EventsTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://autismhackathon2021apinet3.azurewebsites.net/api/GetButtonEventsForSession?code=UzXXjTrKL6V8HRwVpKhVdTu3Wf22uP3W9/PxPJR/u/GmZSYqAGoMog==&session_id=session1")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <TableContainer component={Paper}>
          <Table className="table" aria-label="simple table">
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
              {items.map((sessionEvent) => (
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
  }
}

export default EventsTable;