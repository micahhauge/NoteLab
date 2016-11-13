var i, j, k;
var $body = document.body;

// the pitch value of all black notes
var blackNotes = [1,4,6,9,11,13,16,18,21,23,25,28,30,33,35,37,40,42,45,47,49,52,54,57,59,61,64,66,69,71,73,76,78,81,83,85];

// array where each index corresponds to a pitch, and the value at each index is the corresponding Xpos value
var pitchToXPos = [0,1,1,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,12,13,13,14,14,15,15,16,17,17,18,18,19,20,20,21,21,22,22,23,24,24,25,25,26,27,27,28,28,29,29,30,31,31,32,32,33,34,34,35,35,36,36,37,38,38,39,39,40,41,41,42,42,43,43,44,45,45,46,46,47,48,48,49,49,50,50,51];

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



// NoteRoll object stores the array of notes and contains methods to sort
function NoteRoll (numOfGraphics, p) {
  this.p = p;
  this.notes = [];
  this.noteGraphics = createNoteGraphics(numOfGraphics);
  // this.keys = createKeys();
  // console.log(this.noteGraphics);

  // TODO
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
  // console.log(this.keys);


  // function to assign each note to a noteGraphic
  this.assignNoteGraphics = function () {
    // loop to assign each noteObject to a noteGraphic object
    for (i = 0; i < this.notes.length; i++) {
      x = i;
      // reset noteGraphics to 0 when reached last noteGraphic
      while (x >= this.noteGraphics.length) {

        x -= this.noteGraphics.length;
      }
      this.notes[i].graphic = this.noteGraphics[x];
    }
  }

  this.assignAnimationProperties = function () {
    for (i = 0; i < this.notes.length; i++) {
      this.notes[i].getAnimationProperties(p);
    }
  }

  // function to sort the notes based on startTime
  this.sortNotes = function () {
    var len = this.notes.length;
    var min;

    for (i = 0; i < len; i++) {
      // set minimum to this position
      min = i;

      // check the rest of the array to see if there is anythin smaller
      for (j = i+1; j < len; j++) {
        if(this.notes[j].startTime < this.notes[min].startTime) {
          min = j;
        }
      }
      // if the minimum isn't the position, swap it
      if (i != min) {
        swap(this.notes, i, min);
      }
    }
  }
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


// function to create a note object
function Note(pitch, startTime, duration, velocity) {
  this.pitch = pitch;
  this.startTime = startTime;
  this.duration = duration;
  this.velocity = velocity;
  this.graphic = null;
  // this.noteColor = getRandomColor();

  if (this.velocity < .1) {
    this.noteColor = "#99ff99";
  } else if (this.velocity < .2) {
    this.noteColor = "#80ff80";
  } else if (this.velocity < .3) {
    this.noteColor = "#66ff66";
  } else if (this.velocity < .4) {
    this.noteColor = "#00ff00";
  } else if (this.velocity < .5) {
    this.noteColor = "#00e600";
  } else if (this.velocity < .6) {
    this.noteColor = "#00cc00";
  } else if (this.velocity < .7) {
    this.noteColor = "#00b300";
  } else if (this.velocity < .8) {
    this.noteColor = "#ff0066";
  } else if (this.velocity < .9) {
    this.noteColor = "#ff0000";
  } else {
    this.noteColor = "#cc0000";
  }





  this.initialX = null;
  this.len = null;


  // animation properties
  this.getAnimationProperties = function(p) {
    this.initialX = pitchToXPos[this.pitch] * p.noteWidth;
    this.len = this.duration * p.yScale;
  }

  // this.stopTime = startTime + noteSpeed;

}

// GEN
// function to generate animation timeline based on an array of notes and a properties object
function generateTimeline (notes, keys, p) {
  // create timeline for notes
  var tl = new TimelineMax({repeat: 300, paused:true});

  // set eastype to Linear
  TweenLite.defaultEase = Linear.easeNone;

  for (i = 0; i < notes.length; i++) {
    // set initial position, scale, and color of each note
    if (isBlack(notes[i].pitch)) {
      tl.set(notes[i].graphic, {
        backgroundColor: notes[i].noteColor,
        width: p.noteWidth * .6,
        height: notes[i].len,
        x: notes[i].initialX + .7 * p.noteWidth,
        rotation: 0.01,
        visibility: 'visible',
        // display: 'block',
      }, notes[i].startTime - p.noteSpeed);
    } else {
      tl.set(notes[i].graphic, {
        backgroundColor: notes[i].noteColor,
        width: p.noteWidth,
        height: notes[i].len,
        x: notes[i].initialX,
        rotation: 0.01,
        visibility: 'visible',
        // display: 'block',
      }, notes[i].startTime - p.noteSpeed);
    }


    // animate each note downward to the key positions
    tl.fromTo(notes[i].graphic, p.noteSpeed, {
      y: - notes[i].duration * p.yScale,
      // y: -100 ,
      // y: 100 - notes[i].len,
      rotation: 0.01,
      z:0.01
    }, {
      y: p.viewHeight - notes[i].duration * p.yScale,
      rotation: 0.01,
      z:0.01
    }, notes[i].startTime - p.noteSpeed);

    // animate each note off the screen
    tl.to(notes[i].graphic, notes[i].duration, {
      y: p.viewHeight,
    }, notes[i].startTime);


    tl.to(notes[i].graphic, 0, {
      backgroundColor: '#0099FF',
    }, notes[i].startTime);

    // console.log('keys: ');
    tl.to(keys[notes[i].pitch].graphic, .7, {
      // backgroundColor: '#ccff33',
      // backgroundColor: '#ff0000',
      // backgroundColor: '#641478',
      backgroundColor: '#0ae696', // mint green
    }, notes[i].startTime - .9);
    // console.log(keys[i]);
    tl.to(keys[notes[i].pitch].graphic, .05, {
      backgroundColor: '#0099ff',
      // backgroundColor: '#0ae696', // mint green
    }, notes[i].startTime);


    if (isBlack(notes[i].pitch)) {
      tl.to(keys[notes[i].pitch].graphic, 0, {
        backgroundColor: '#000000',
      }, notes[i].startTime + notes[i].duration);
    } else {
      tl.to(keys[notes[i].pitch].graphic, 0, {
        backgroundColor: '#ffffff',
      }, notes[i].startTime + notes[i].duration);
    }

    if (isBlack(notes[i].pitch)) {
      tl.to(keys[notes[i].pitch].graphic, 0, {
        backgroundColor: '#000000',
      }, notes[i].startTime + notes[i].duration);
    } else {
      tl.to(keys[notes[i].pitch].graphic, 0, {
        backgroundColor: '#ffffff',
      }, notes[i].startTime + notes[i].duration);
    }

    // make the note invisible to save resources
    tl.set(notes[i].graphic, {
      // display: 'none',
      visibility: 'hidden',
    }, notes[i].startTime + notes[i].duration);

  }
  return tl;
}

// function to swap two items
function swap(items, firstIndex, secondIndex) {
  var temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}

function getRandomColor () {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function getRandom(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function getRandomBool() {
  return Math.round(Math.random());
}

// Define a function to handle status messages
function display_message(mes) {
  console.log(mes);
};

// wait funciton
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
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

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}
