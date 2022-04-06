# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).

The app was developed using predominantly mobile-first patterns. All pages should function on a mobile device first, then be modified to work on larger screens second.

## API and Mock API

The application accepts a `REACT_APP_DEMO` variable that will determine whether or not the application should utilize the mocked API or the full backend. By default this is set to true when in development. You will know when the application is running with this value turned on when a banner is displayed at the top of the pages.

## General

TODO:

- The breadcrumbs should be placed into a breadcrumb component instead of a component per page

## Login/Logout

Currently this is a dummy implementation. Any values can be entered into the login form to redirect the user to the patients page. Clicking the logout button will simply redirect the user to the login page.

TODO:

- Hook login into the backend implementation
- Redirect to login page when session does not exist or has expired
- Clear the session when logout is clicked

## Patients

Patients should display a filterable list of patients with the ability to add a new patient and add more details.

TODO:

- Create a desktop view to utilize more of the available space
- Filter should be pushed to the backend to prevent pulling down the entire patient set
- Recent patients should show the recently clicked on patients instead of all
- Add pagination or infinite scrolling to the list

## Patient Details

Displays information about the patient including their name, their sessions, and their behaviors.

TODO:

- Pretty up the sessions display, add filtering or limit result set to recent sessions
- Further improve the behaviors display to reduce spacing between sparklines
- Add ability to edit or remove patients

## Session Details

This page should display the raw data from the session, including all button presses.

TODO:

- Improve display (smaller table, format times to a more readable format)
- Make table sortable
- Add pagination, ideally with the backend's help
- Instead of stop, use "Duration" column
- Add ability to download the values to an XML or CSV

## Behavior Details

Provides a graph representing the trend of the behavior as well as details about the specific behavior.

TODO:

- Add description fields for the behavior, including type and number of data points
- Put graph into a container and pretty up the display
- Create a sub-page that can display all data points from all sessions in a table
  - Should also have the ability to download the data to XML or CSV

## Calendar

Displays a calendar with sessions

TODO:

- Display sessions on calendar and remove placeholders
- Clicking on a session should open that session's details page

## Profile

Displays information about the currently logged in user, including patients and sessions.

TODO:

- Fix list of patients displaying a list of behaviors
- Improve display of list of patients
- Improve display of sessions
- Improve display of profile information
- Add ability to edit profile
