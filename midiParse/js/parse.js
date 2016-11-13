function run () {
  var pathToFile;
  var numOfFiles = document.getElementById('numOfFiles').value;
  console.log('numOfFIle: ', numOfFiles);
  for (var i = 0; i < numOfFiles; i++) {
    pathToFile = 'input/' + i + '_.mid';
    parseFile(pathToFile);
  }

  function parseFile (pathToFile) {
    MidiConvert.load(pathToFile, function(midiData) {
      console.log('path: ', pathToFile);
      var str = '';
      var notesData;

      var numOfTracks = midiData.tracks.length;
      // console.log("numOfTracks: ", numOfTracks)

      var startTime, duration, pitch, velocity;
      // loop through all tracks
      for (j = 0; j < numOfTracks; j++) {
        notesData = midiData.tracks[j].notes;
        if (notesData) {
          for (k = 0; k < notesData.length; k++) {
            // nr.notes.push(new Note(notesData[j].midi - 21, notesData[j].time, notesData[j].duration));
            // console.log(notesData[j]);
            startTime = Math.floor(notesData[k].time * 100);
            duration = Math.floor(notesData[k].duration * 100);
            pitch = notesData[k].midi;
            velocity = notesData[k].velocity;

            str +=  startTime + ' ' + duration + ' ' + pitch + ' ' + velocity + '\n';
          }
        }
      }
      // console.log(str);
      console.log('path: ', pathToFile);
      var numb = pathToFile.match(/\d/g);
      numb = numb.join("");
      download('out_' + numb  + '.txt', str);
    });
  }

  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
