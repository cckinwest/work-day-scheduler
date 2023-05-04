// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

var scheduleContainer = $(".scheduleContainer");
//createSlot function will create a time-block by inputting a time in ms
//so that it becomes more flexible to create the time-blocks
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
  //use the time in ms as id of time-block,
  //so that it becomes easier to manipulate and compare different time-blocks.
  hour.text(dayjs(time).format("hA"));
}

//add function for the click of save button
function handleClick() {
  //if the button is in save mode
  if ($(this).find("i").hasClass("fas fa-save")) {
    var timeBlock = $(this).parent();
    var description = timeBlock.find("textarea");

    description.prop("disabled", true); //turn to edit mode
    $(this).css("background-color", "#F7D060");
    $(this).find("i").removeClass("fas fa-save");
    $(this).find("i").addClass("fa fa-edit");

    var timeinms = timeBlock.attr("id");
    var taskDescription = description.val();

    var timeArray = []; //initialize the array containing the time of record
    var records = []; //initialize the array containing objects of time and task

    if (localStorage.getItem("timeArray")) {
      timeArray = JSON.parse(localStorage.getItem("timeArray"));
    } //if the storage of timeArray is not null, take it.

    if (localStorage.getItem("records")) {
      records = JSON.parse(localStorage.getItem("records"));
    } //if the storage of record is not null, take it.

    if (timeArray.includes(timeinms)) {
      var ind = timeArray.indexOf(timeinms);
      records[ind].task = taskDescription;
    } else {
      timeArray.push(timeinms);
      records.push({
        time: timeinms,
        task: taskDescription,
      });
    } //if the time is already in the timeArray,
    //then modify the task in the respective object
    //otherwise, push a new object

    localStorage.setItem("timeArray", JSON.stringify(timeArray));
    localStorage.setItem("records", JSON.stringify(records));
  } else if ($(this).find("i").hasClass("fa fa-edit")) {
    var timeBlock = $(this).parent();
    var description = timeBlock.find("textarea");

    description.prop("disabled", false); //return to save mode
    $(this).css("background-color", "#06aed5");
    $(this).find("i").removeClass("fa fa-edit");
    $(this).find("i").addClass("fas fa-save");
  } //if the button is in edit mode
}

//create a workday schedule for a given date
function renderEmptySlots(dateStr) {
  var start = dayjs(dateStr).valueOf();

  for (i = 8; i < 17; i++) {
    createSlot(start + i * 3600 * 1000);
  }

  $(".saveBtn").on("click", handleClick);
}

function callFromRecord() {
  if (localStorage.getItem("records")) {
    var timeArray = JSON.parse(localStorage.getItem("timeArray"));
    var records = JSON.parse(localStorage.getItem("records"));

    //if a time and a task is in records, add them to the respective textarea
    $(".description")
      .filter(function () {
        var timeBlock = $(this).parent();
        return timeArray.includes(timeBlock.attr("id"));
      })
      .val(function () {
        var timeBlock = $(this).parent();
        var ind = timeArray.indexOf(timeBlock.attr("id"));
        return records[ind].task;
      })
      .prop("disabled", true);
    //the button of the time-block with record is in edit mode
    $(".saveBtn")
      .filter(function () {
        var timeBlock = $(this).parent();
        return timeArray.includes(timeBlock.attr("id"));
      })
      .css("background-color", "#F7D060");

    $("i")
      .filter(function () {
        var timeBlock = $(this).parent().parent();
        return timeArray.includes(timeBlock.attr("id"));
      })
      .removeClass("fas fa-save")
      .addClass("fa fa-edit");
  }
}

function createColorIndicator() {
  var currentTime = dayjs().valueOf();
  currentTime -= currentTime % 3600000;
  //round down the currentTime to hour

  $(".time-block")
    .filter(function () {
      return $(this).attr("id") < currentTime;
    })
    .addClass("past");
  //if the time of a time-block is less than the current time,
  //then add 'past' style

  $(`.time-block[id=${currentTime}]`).addClass("present");

  $(".time-block")
    .filter(function () {
      return $(this).attr("id") > currentTime;
    })
    .addClass("future");
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
  var todayStr = dayjs().format("MMM D, YYYY");

  $("#currentDay").text(todayStr);
  renderEmptySlots(todayStr);
  //when the page is load the default page is the schedule of today
  callFromRecord();
  createColorIndicator();

  //the datepicker is for selecting the schedule of any day.
  $("#datepicker").datepicker({
    onSelect: function () {
      $("#currentDay").text(dayjs($(this).val()).format("MMM D, YYYY"));
      scheduleContainer.empty();
      renderEmptySlots($(this).val());
      callFromRecord();
      createColorIndicator();
    },
  });

  $(".clearBtn").on("click", function () {
    localStorage.removeItem("timeArray");
    localStorage.removeItem("records");
    scheduleContainer.empty();
    if ($("#datepicker").val()) {
      renderEmptySlots($("#datepicker").val());
    } else {
      renderEmptySlots(todayStr);
    }

    createColorIndicator();
  });
});
