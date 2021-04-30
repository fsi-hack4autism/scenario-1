import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  }
}));

export default function Sidebar() {
  const classes = useStyles();
  const patients = ['Patient 1', 'Patient 2', 'Patient 3'];
  const sessions = [
    {id: 1, name:"Session 1", patientid:348902340923},
    {id: 2, name:"Session 2", patientid:90054345}
  ];

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className="header-padding"></div>
        <div className={classes.drawerContainer}>
          <List>
            <ListItem key="Patients">
              <ListItemText primary="Patients" />
            </ListItem>
          </List>
          <Divider />
          <List>
            {patients.map((text, index) => (
              <ListItem button key={text} >
                <ListItemText primary={text}/>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem key="Sessions">
              <ListItemText primary="Therapy Sessions" />
            </ListItem>
          </List>
          <Divider />
          <List>
            {sessions.map((session) => (
              <ListItem button key={session.id}>
                <ListItemText primary={session.name} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
}