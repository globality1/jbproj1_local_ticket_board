// General onclick function activation calls
document.forms.taskBoardFiller.clearNote.onclick =  function () { clearNote(); };
document.forms.taskBoardFiller.saveNote.onclick =  function () { validationOfForm(); };


// Depends on amount of buttons inside of the form - in this case I used 2 buttons inside
var formLength = document.forms.taskBoardFiller.length-2;
const merhaot = '"'
var noteId;
var noteDetails = new Object();

function validationOfForm() {
  var validationPoints = 0;
  // Function that is reponsible to mark out the unfilled locations.
  function alertError(errorLoc) {
    // if field is empty - gives error that field is empty by replacing bordercolor and placeholder of the input field
    document.forms.taskBoardFiller[errorLoc].placeholder = document.forms.taskBoardFiller[errorLoc].title + " must be filled";
    document.forms.taskBoardFiller[errorLoc].style.borderColor = "red";
    validationPoints++;
  };
  // this function is just showing alert if there is an error
  function errorAlert() {
    alert("Please correct errors");
    validationPoints = 0;
  };
  function dateError() {
    alert("Please enter valid date that is " + getToday() + " and above");
    document.forms.taskBoardFiller.dateTarget.style.borderColor = "red";
    validationPoints++
  }
  for ( var z=1; z<=formLength; z++) {
    // if field is empty - calls to alertFunction() function, otherwise changes field into green color
    (document.forms.taskBoardFiller[z].value.length == 0) ? alertError(z) : document.forms.taskBoardFiller[z].style.borderColor = "green";
  }
  var todayDate = new Date(getToday());
  var enteredDate = new Date(document.forms.taskBoardFiller.dateTarget.value);
  ( enteredDate < todayDate ) ? dateError() : validationPoints = validationPoints;
    // if validation points are above 0 - nulify validation and don't do nothing, otherwise call to submitDetails() function
  ( validationPoints > 0 ) ? errorAlert() : saveNote();
};

// this function is saving the details in the local storage as json string as part of an object
// Function that is responsible to collect data from the form
function saveNote() {
  noteId = getNoteId();
  noteDetails = createNoteDetails(document.forms.taskBoardFiller.dateTarget.value, document.forms.taskBoardFiller.timeTarget.value, document.forms.taskBoardFiller.taskContent.value);
  localStorage.setItem("Note No." + noteId, noteDetails);
  localStorage.setItem("ticket_html_no" + noteId, addNewTicket());
  noteId++;
  localStorage.setItem("noteId", noteId);
};

// function that creates object for task from the enetered details
function createNoteDetails(targetDate,targetTime,noteContent) {
    noteDetails = {
    "target_date" : targetDate,
    "target_time" : targetTime,
    "note_content": noteContent.replace(/\n/ig, '<br>')
  }
  return noteDetails;
};

// this function is responsible to clean the form from anything typed in
function clearNote() {
  for( i=0; i<formLength; i++) {
    document.forms.taskBoardFiller[i].value = '';
  }
};

// creates new daw of ticket in html format
function addNewTicket() {
  var htmlTicketDisplay = "<div class=" + merhaot + "col-sm noteDisplay" + merhaot + "id=" + merhaot + "noteNumber" + noteId + merhaot + "><button id='closeNo" + noteId + "' onClick=" + merhaot + "removeNoteId(" + noteId + ")" + merhaot + "><span class=" + merhaot + "glyphicon glyphicon-remove" + merhaot + "></span></button><div><b>Date Created: </b>" + getToday() + "<br/><br/><div id=" + merhaot + "noteContent" + merhaot + "><span>" + noteDetails.note_content +"</span></div></div><b>Target Date: </b>" + noteDetails.target_date + "</br><b>Target Time: </b>" + noteDetails.target_time + "</div>";
  document.getElementById("taskToDisplay").innerHTML += htmlTicketDisplay;
  doOpacityEffect();
  return htmlTicketDisplay;
};

// draws all notes in html format from local sotrage that is saved  
function drawAllNotes() {
  noteId = getNoteId();
  document.getElementById("taskToDisplay").innerHTML = "<br>";
  for(var h=0; h<=noteId; h++) {
    var ticketNumber = new String();
    ticketNumber = "ticket_html_no";
    ticketNumber += h;
    ( localStorage.getItem(ticketNumber) == null ) ? document.getElementById("taskToDisplay").innerHTML=document.getElementById("taskToDisplay").innerHTML : document.getElementById("taskToDisplay").innerHTML += localStorage.getItem(ticketNumber);
  }
  // function for time picker from https://cdnjs.com/libraries/bootstrap-timepicker
  $('#timepicker1').timepicker();
};

// gets most updated noteId from localStorage
function getNoteId() {
  function nullifyNoteNumber() {
    localStorage.setItem("noteId", 0);
    noteId=0;
  }
  noteId = localStorage.getItem("noteId");
  (localStorage.getItem("noteId") == null)  ? nullifyNoteNumber() : noteId=noteId;
  return noteId;
};

// removes the closed ticket from the local storage
function removeNoteId(noteNumberToRemove) {
  var itemToRemove = "ticket_html_no";
  itemToRemove += noteNumberToRemove;
  localStorage.removeItem(itemToRemove);
  itemToRemove = "Note No.";
  itemToRemove += noteNumberToRemove;
  localStorage.removeItem(itemToRemove);
  drawAllNotes();
};

// gets today and converts it onto simple date format
function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '/' + mm + '/' + dd;
  return today;
}

// function that is responsible to replace the class name for the opacity to work when new note is added
function doOpacityEffect() {
   var e = document.getElementById("noteNumber" + noteId);
   e.className = 'new';
   window.getComputedStyle(e).opacity;
   setTimeout(function() {e.className = 'col-sm noteDisplay';},500);
}