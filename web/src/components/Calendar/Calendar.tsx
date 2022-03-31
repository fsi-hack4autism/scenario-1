import React from "react";


import { Calendar as CalendarComponent, dateFnsLocalizer, Event } from 'react-big-calendar'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})


const tempevents = [
    {
      id: 0,
      title: 'Board meeting',
      start: new Date(2022, 2, 29, 9, 0, 0),
      end: new Date(2022, 2, 29, 13, 0, 0),
      resourceId: 1,
    },
    {
      id: 1,
      title: 'MS training',
      allDay: true,
      start: new Date(2022, 3, 1, 14, 0, 0),
      end: new Date(2022, 3, 1, 16, 30, 0),
      resourceId: 2,
    },
    {
      id: 2,
      title: 'Team lead meeting',
      start: new Date(2022, 2, 5, 8, 30, 0),
      end: new Date(2022, 2, 5, 12, 30, 0),
      resourceId: 3,
    },
    {
      id: 11,
      title: 'Birthday Party',
      start: new Date(2022, 3, 2, 7, 0, 0),
      end: new Date(2022, 3, 2, 10, 30, 0),
      resourceId: 4,
    },
  ]

const Calendar = () => (
    <div>
    <div>Calendar View</div>
    <CalendarComponent
      localizer={localizer}
      events={tempevents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '80vh' }}
    />
    </div>
);

export default Calendar;
