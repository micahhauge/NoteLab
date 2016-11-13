var context=null;   // the Web Audio "context" object
var midiAccess=null;  // the MIDIAccess object.
var oscillator=null;  // the single oscillator
var envelope=null;    // the envelope for the single oscillator
var attack=0.05;      // attack speed
var release=0.05;   // release speed
var portamento=0.05;  // portamento/glide speed
var activeNotes = []; // the stack of actively-pressed keys


var recording = true;

window.addEventListener('load', function() {
  // patch up prefixes
  window.AudioContext=window.AudioContext||window.webkitAudioContext;

  context = new AudioContext();
  if (navigator.requestMIDIAccess)
    navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
  else
    alert("No MIDI support present in your browser.  You're gonna have a bad time.")

  // set up the basic oscillator chain, muted to begin with.
  oscillator = context.createOscillator();
  oscillator.frequency.setValueAtTime(110, 0);
  envelope = context.createGain();
  oscillator.connect(envelope);
  envelope.connect(context.destination);
  envelope.gain.value = 0.0;  // Mute the sound
  oscillator.start(0);  // Go ahead and start up the oscillator


  // NoteRoll
  nr = new NoteRoll();


  // make the keyboard
  setupTimer();

});

function onMIDIInit(midi) {
  midiAccess = midi;

  var haveAtLeastOneDevice=false;
  var inputs=midiAccess.inputs.values();
  for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = MIDIMessageEventHandler;
    haveAtLeastOneDevice = true;
  }
  if (!haveAtLeastOneDevice)
    alert("No MIDI input devices present.  You're gonna have a bad time.");
}

function onMIDIReject(err) {
  alert("The MIDI system failed to start.  You're gonna have a bad time.");
}

function MIDIMessageEventHandler(event) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
        // console.log(event.data[1]);
        noteOn(event.data[1], event.data[2] / 127);
        return;
    }
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      noteOff(event.data[1]);
      return;
  }
}

function frequencyFromNoteNumber( note ) {
  return 440 * Math.pow(2,(note-69)/12);
}

function noteOn(noteNumber, velocity) {
  activeNotes.push( noteNumber );
  oscillator.frequency.cancelScheduledValues(0);
  oscillator.frequency.setTargetAtTime( frequencyFromNoteNumber(noteNumber), 0, portamento );
  envelope.gain.cancelScheduledValues(0);
  envelope.gain.setTargetAtTime(1.0, 0, attack);


  TweenLite.to(nr.keys[noteNumber - 21].graphic, .1, {
    backgroundColor: '#0066ff',
  });
  nr.playNote(noteNumber - 21, velocity);
}

function noteOff(noteNumber) {
  nr.stopNote(noteNumber - 21);
  var position = activeNotes.indexOf(noteNumber);
  if (position!=-1) {
    activeNotes.splice(position,1);
  }
  TweenLite.to(nr.keys[noteNumber - 21].graphic, .1, {
    backgroundColor: nr.keys[noteNumber - 21].keyColor,
  });
  if (activeNotes.length==0) {  // shut off the envelope
    envelope.gain.cancelScheduledValues(0);
    envelope.gain.setTargetAtTime(0.0, 0, release );
  } else {
    oscillator.frequency.cancelScheduledValues(0);
    oscillator.frequency.setTargetAtTime( frequencyFromNoteNumber(activeNotes[activeNotes.length-1]), 0, portamento );
  }
}


function setupTimer () {
  nr.globalStartTime = new Date();
  var timerText = document.getElementById('timer');
  var stop = document.getElementById('stop');
  var seconds = 0, minutes = 0, hours = 0, t;

  function add() {
      seconds++;
      if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
              minutes = 0;
              hours++;
          }
      }

      timerText.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
      timer();
  }
  function timer() {
      nr.recording = true;
      t = setTimeout(add, 1000);
  }

  /* Stop button */
  stop.onclick = function() {
    clearTimeout(t);
    nr.exportNotes();
  }


  /* Start button */
  start.onclick = timer;
}
