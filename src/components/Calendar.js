import React from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import NewEventModal from './NewEventModal';

function Calendar() {
  let [events, setEvents] = React.useState([
    { id: '0', title: 'event 1', start: new Date(), end: new Date(new Date() + 60000 * 120) },
    { id: '1', title: 'event 2', start: new Date(new Date() + 60000 * 30), end: new Date(new Date() + 60000 * 600) }
  ]);
  const [open, setOpen] = React.useState(false);
  const [eventName, setEventName] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [endTime, setEndTime] = React.useState('');

  const closeModal = () => {
    setOpen(false);
  }
  const handleSubmit = () => {
    console.log('hi')
    let newEvents = [...events];
    newEvents.push({
      id: 'temp',
      title: eventName,
      start: Date.parse(`${startDate} ${startTime}`),
      end: Date.parse(`${endDate} ${endTime}`)
    })
    setEvents(newEvents);
    closeModal();
    console.log(newEvents);
  }

  return (
    <div>
      <div className="header-padding"></div>
      <div className="calendar-padding">
        <FullCalendar
          defaultView="timeGridWeek"
          plugins={[ timeGridPlugin ]}
          events={ events }
          allDaySlot={ false }
          contentHeight="auto"
          customButtons={{
            addEvent: {
              text: 'New Event',
              click: () => { setOpen(true) }
            }
          }}
          header={{
            left: 'prev,next today',
            center: 'title',
            right: 'addEvent'
          }}
          buttonText={{ today: 'Today' }}
        />
      </div>
      <NewEventModal
        open={ open }
        closeModal={ closeModal }
        handleSubmit={ handleSubmit }
        setEventName={ setEventName }
        setStartDate={ setStartDate }
        setStartTime={ setStartTime }
        setEndDate={ setEndDate }
        setEndTime={ setEndTime }
      ></NewEventModal>
    </div>
  );
}
export default Calendar;