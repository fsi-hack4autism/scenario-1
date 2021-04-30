import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Sidebar from './Sidebar.js';
import DashboardMainPanel from './DashboardMainPanel.js';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Dashbaord() {
  const classes = useStyles();

  return (
    <div className={ classes.root }>
      <Sidebar></Sidebar>
      <DashboardMainPanel></DashboardMainPanel>
    </div>
  );
}
export default Dashbaord;