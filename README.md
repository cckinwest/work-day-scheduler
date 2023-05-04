# work-day-scheduler

A simple calendar application that allows a user to save events for each hour of the day by modifying starter code. This app will run in the browser and feature dynamically updated HTML and CSS powered by jQuery. I use the Day.js library to work with date and time.

[Link to the project](https://cckinwest.github.io/work-day-scheduler)

## Feature of this app

### Header

The header shows a date in the format of "Month Day, Year". By default the date of today will be shown.

### Work-Day-Schedule

The schedule for a date contains time-blocks from 8am to 4pm. By clicking on the textarea one can input a task scheduled for at a particular hour. By pressing the save button on the right, the task will be saved and presist after refreshing. Moreover, different colours will be used to indicate time-blocks of past, present and future.

### Extra feature

The header contains a datepicker. By clicking it, a calender is popped out. The work-day-schedule for the date selected in the calender will be generated. Finally there is a clear button which can delete all the records saved.

When a task is added to the time-block, press the button to save, then the button will change to edit mode and the textarea is locked. Press the button again to unlock and the button will change back to save.
