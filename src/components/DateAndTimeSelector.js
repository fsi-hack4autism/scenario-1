import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function(props) {
  const classes = useStyles();
  
  return (
    <div>
      <TextField
        id="start-date"
        label={ props.dateLabel }
        type="date"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={ (event) => { props.setDate(event.target.value) } }
      />
      <TextField
        id="start-time"
        label={ props.timeLabel }
        type="time"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
        onChange={ (event) => { props.setTime(event.target.value) } }
      />
    </div>
  );
}