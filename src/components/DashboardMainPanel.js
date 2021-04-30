import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EventsTable from './EventsTable.js';

const useStyles = makeStyles((theme) => ({
}));

export default function DashboardMainPanel() {
  const classes = useStyles();

  return (
    <main className={ classes.content }>
    <div className="header-padding" id="mainViewPort"></div>
    <h2>Events for Patient 2</h2>
    <EventsTable></EventsTable>
  </main>
);
}