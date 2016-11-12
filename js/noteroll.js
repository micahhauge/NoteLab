// global stuff
TweenLite.defaultEase = Linear.easeNone;
// the pitch value of all black notes
var blackNotes = [1,4,6,9,11,13,16,18,21,23,25,28,30,33,35,37,40,42,45,47,49,52,54,57,59,61,64,66,69,71,73,76,78,81,83,85];

// array where each index corresponds to a pitch, and the value at each index is the corresponding Xpos value
var pitchToXPos = [0,1,1,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,12,13,13,14,14,15,15,16,17,17,18,18,19,20,20,21,21,22,22,23,24,24,25,25,26,27,27,28,28,29,29,30,31,31,32,32,33,34,34,35,35,36,36,37,38,38,39,39,40,41,41,42,42,43,43,44,45,45,46,46,47,48,48,49,49,50,50,51];


// define noter role object
function NoteRoll () {
  this.notes = [];
  this.keys = [];
  this.p = getProperties();
  this.playingNotes = [88];
  this.startNotes = [];

  this.createKeys = function () {
    var keys = [];
    for (var i = 0; i < 88; i++) {
      keys.push(new KeyGraphic(i, p));
      // console.log('push', i);
    }
    console.log(keys);
    return keys;
  }

  this.keys = this.createKeys();

  this.playNote  = function (pitch) {
    var note = new Note(pitch, new Date(), null, null);
    note.startTime = new Date();
    note.graphic =  new createNoteGraphic();
    var x, y, width, height;


    if (isBlack(pitch)) {
      x = pitchToXPos[pitch] * p.noteWidth - .4 * p.noteWidth;
    } else {
      x = pitchToXPos[pitch] * p.noteWidth;
    }

    document.body.appendChild(note.graphic);
    this.playingNotes[pitch] = note;
    // this.playingNotes.push(note);
    TweenLite.to(note.graphic, 0, {
      x: x,
      y: p.viewHeight,
      width: p.noteWidth,
      height: 3000,
    });

    note.tl.to(note.graphic, p.noteSpeed, {
      y: 0,
    });
  }

  this.stopNote = function (pitch) {
    var note = this.playingNotes[pitch];
    console.log(note);
    note.stopTime = new Date();
    note.duration = (note.stopTime - note.startTime) / 1000;
    // change he height of note to proper length
    TweenLite.to(this.playingNotes[pitch].graphic, 0, {
      height: note.duration * this.p.yScale,
    });

    // animate the note off the screen
    note.tl.to(note.graphic, note.duration, {
      y: 0 - note.duration * this.p.yScale,
    });

  }
}


function Note(pitch, startTime, duration, velocity, graphic = null) {
  this.pitch = pitch;
  this.startTime = startTime;
  this.duration = duration;
  this.velocity = velocity;
  this.graphic = null;
  this.tl = new TimelineMax();
  // this.noteColor = getRandomColor();

  // if (this.velocity < .1) {
  //   this.noteColor = "#99ff99";
  // } else if (this.velocity < .2) {
  //   this.noteColor = "#80ff80";
  // } else if (this.velocity < .3) {
  //   this.noteColor = "#66ff66";
  // } else if (this.velocity < .4) {
  //   this.noteColor = "#00ff00";
  // } else if (this.velocity < .5) {
  //   this.noteColor = "#00e600";
  // } else if (this.velocity < .6) {
  //   this.noteColor = "#00cc00";
  // } else if (this.velocity < .7) {
  //   this.noteColor = "#00b300";
  // } else if (this.velocity < .8) {
  //   this.noteColor = "#ff0066";
  // } else if (this.velocity < .9) {
  //   this.noteColor = "#ff0000";
  // } else {
  //   this.noteColor = "#cc0000";
  // }

  this.initialX = null;
  this.len = null;


  // animation properties
  this.getAnimationProperties = function(p) {
    this.initialX = pitchToXPos[this.pitch] * p.noteWidth;
    this.len = this.duration * p.yScale;
  }

  // this.stopTime = startTime + noteSpeed;

}


// Function to create a key object
function KeyGraphic (pitch, p) {
  var div = document.createElement('div');
  div.className = "key";
  document.body.appendChild(div);


  if (isBlack(pitch)) {
    this.keyColor = "black";
    TweenLite.set(div, {
      x: pitchToXPos[pitch] * p.noteWidth - .4 * p.noteWidth,
      y: p.viewHeight,
      width: p.noteWidth * .75,
      height: p.keyHeight * .6,
      backgroundColor: 'black',
      zIndex: 10,
    });
  } else {
    this.keyColor = "white";
    TweenLite.set(div, {
      x: pitchToXPos[pitch] * p.noteWidth,
      y: p.viewHeight,
      width: p.noteWidth,
      height: p.keyHeight,
    });
  }
  this.graphic = div;



  return this;
}

// function to create noteGraphic objects
function createNoteGraphics (numberOfGraphics) {
  // array to hold the noteGraphics
  var noteGraphics = [];

  // fills the array with empty divs and adds the divs to the dom
  for (i = 0; i < numberOfGraphics; i++) {
    var div = document.createElement('div');
    div.className = "note";
    document.body.appendChild(div);
    noteGraphics.push(div);
  }

  return(noteGraphics);
}

function createNoteGraphic () {
  var div = document.createElement('div');
  div.className = "note";
  return div;
}

// function to get properties that are essential to the game
// returns an object (effectively an associative array) containing all the required properties
function getProperties () {
  // p is the object that conatins the properties
  p = {};

  // dimentions of the game view
  p.viewWidth = window.innerWidth;
  // establish noteWidth based on viewWidth so that application is scalable
  p.noteWidth = p.viewWidth / 52;
  p.keyHeight = 5 * p.noteWidth;
  p.viewHeight = window.innerHeight - p.keyHeight;
  p.viewCenter = p.viewWidth / 2;


  // the time in seconds that it will take a note to cross the sceen
  p.noteSpeed = 3;

  // yScale is the number of vertical pixels that represent 1 second in game
  // so if a note is 3 seconds long, it's vertical height will be 3 * yScale pixels
  p.yScale = p.viewHeight / p.noteSpeed;

  return p;
}

// function to determine if a key is white or blackNote
function isBlack(pitch) {
  // if the note is black
  if (blackNotes.indexOf(pitch) != -1) {
    return true;
    // alert('hi');
  } else {
    return false;
  }
}
