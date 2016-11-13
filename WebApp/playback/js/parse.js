var i, j, k;

// array to hold note objects

// function to create an array of notes based on a midi file
function getNotesFromMidi (pathToFile) {
  MidiConvert.load(pathToFile, function(midiData){
      var notes = [];
      notesData = midiData.tracks[1].notes;

      for (i = 0; i < notesData.length; i++) {
        notes.push(new Note(notesData[i].midi - 21, notesData[i].time, notesData[i].duration));
      }
      return notes;
  })

  console.log('returning from parse with note length of ', notes.length);
}
