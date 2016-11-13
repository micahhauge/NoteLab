var host = "";

$(document).ready( function(){
	//loadMidiList();
});

// Save midi file off to the server
function saveMidi(midiContent, targetFile){
	$.ajax({
		type: "POST",
		url: host+"savemidi.php",
		success:function(data) {
			alert(data);
		},
		data:{
			midiContent:midiContent,
			targetFile:targetFile
		},
		
		fail:function(data){
			alert("FAIL");
		},
	});
}

// Load the list of midi file names
function loadMidiList(){
	$.ajax({
		type: "POST",
		url: host+"loadMidiFileList.php",
		success:function(data) {
			var midiFiles = data.split(",");
			var midiOutList = "";
			
			for(i in midiFiles){
				midiOutList += "<li>" + midiFiles[i] + "</li>";
			}
			//alert(midiOutList);
			$("#midiFiles").append(midiOutList);
		},
		fail:function(data){
			alert("FAIL");
		},
	});
}


function loadMidi(midiFile){
	$.ajax({
		type: "POST",
		url: host+"loadMidiContent.php",
		success:function(data) {
			return data;
		},
		data:{
			fileName:midiFile
		},
		fail:function(data){
			alert("FAIL");
		},
	});
}