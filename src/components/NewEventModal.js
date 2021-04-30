import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateAndTimeSelector from './DateAndTimeSelector';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  }
}));

export default function NewEventModal(props) {
  const classes = useStyles();

  const body = (
    <div className={ classes.paper }>
      <h2 id="simple-modal-title">New Event</h2>
      <div>
        <FormControl className={classes.container} noValidate>
          <TextField label="Event Name" onChange={ (event) => { props.setEventName(event.target.value) } } />
          <div className="date-selector-padding">
            <DateAndTimeSelector
              dateLabel="Start Date"
              timeLabel="Start Time"
              setDate={ props.setStartDate }
              setTime={ props.setStartTime }
            />
            <DateAndTimeSelector
              dateLabel="End Date"
              timeLabel="End Time"
              setDate={ props.setEndDate }
              setTime={ props.setEndTime }
            />
          </div>
          <div>
            <Button
              onClick={ props.handleSubmit }
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        className={ classes.modal }
        open={ props.open }
        onClose={ props.closeModal }
      >
        { body }
      </Modal>
    </div>
  );
}