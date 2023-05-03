// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

var scheduleContainer = $(".scheduleContainer");

function createSlot(time) {
  var timeBlock = $("<div></div>", {
    class: "row time-block",
  }).appendTo(scheduleContainer);

  var hour = $("<div></div>", {
    class: "col-2 col-md-1 hour text-center py-3",
  }).appendTo(timeBlock);

  var description = $("<textarea></textarea>", {
    class: "col-8 col-md-10 description",
    row: "3",
  }).appendTo(timeBlock);

  var saveBtn = $("<button></button>", {
    class: "btn saveBtn col-2 col-md-1",
    ariaLabel: "save",
  }).appendTo(timeBlock);

  var faSave = $("<i></i>", {
    class: "fas fa-save",
    ariaHidden: "true",
  }).appendTo(saveBtn);

  timeBlock.attr("id", time);

  var h = new Date(time).getHours();

  if (h < 12) {
    hour.text(`${h}AM`);
  } else if (h === 12) {
    hour.text("NOON");
  } else {
    hour.text(`${h - 12}PM`);
  }
}

function handleClick() {
  var timeBlock = $(this).parent();
  var description = timeBlock.find("textarea");

  var time = timeBlock.attr("id");
  var task = description.val();

  var timeArray = [];
  var records = [];

  if (localStorage.getItem("timeArray")) {
    timeArray = JSON.parse(localStorage.getItem("timeArray"));
  }

  if (localStorage.getItem("records")) {
    records = JSON.parse(localStorage.getItem("records"));
  }

  if (timeArray.includes(time)) {
    var ind = timeArray.indexOf(time);
    records[ind].task = task;
  } else {
    timeArray.push(time);
    records.push({
      time: time,
      task: task,
    });
  }

  localStorage.setItem("timeArray", JSON.stringify(timeArray));
  localStorage.setItem("records", JSON.stringify(records));
}

function renderEmptySlots(dateStr) {
  var start = new Date(dateStr).getTime();

  for (i = 8; i < 17; i++) {
    createSlot(start + i * 3600 * 1000);
  }

  $(".saveBtn").on("click", handleClick);
}

function callFromRecord() {
  if (localStorage.getItem("records")) {
    var timeArray = JSON.parse(localStorage.getItem("timeArray"));
    var records = JSON.parse(localStorage.getItem("records"));

    $(".description")
      .filter(function () {
        var timeBlock = $(this).parent();
        return timeArray.includes(timeBlock.attr("id"));
      })
      .val(function () {
        var timeBlock = $(this).parent();
        var ind = timeArray.indexOf(timeBlock.attr("id"));
        return records[ind].task;
      });
  }
}

function createColorIndicator() {
  var currentTime = new Date().getTime();
  currentTime -= currentTime % 3600000;

  $(".time-block")
    .filter(function () {
      return $(this).attr("id") < currentTime;
    })
    .addClass("past");

  $(".time-block")
    .filter(function () {
      return $(this).attr("id") === currentTime;
    })
    .addClass("present");

  $(".time-block")
    .filter(function () {
      return $(this).attr("id") > currentTime;
    })
    .addClass("future");
}

function convertDate(date) {
  const Months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return `${Months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
  var d = new Date();

  var todayStr = convertDate(d);

  $("#currentDay").text(todayStr);

  $("#datepicker").datepicker({
    onSelect: function () {
      var selectedDate = new Date($(this).val());

      $("#currentDay").text(convertDate(selectedDate));
      scheduleContainer.empty();
      renderEmptySlots($(this).val());
      callFromRecord();
      createColorIndicator();
    },
  });

  renderEmptySlots(todayStr);
  callFromRecord();
  createColorIndicator();

  $(".clearBtn").on("click", function () {
    localStorage.removeItem("timeArray");
    localStorage.removeItem("records");
  });
});
