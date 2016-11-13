var host = "";

$(document).ready( function(){
	//loadMidiList();
});

// Save midi file off to the server
function saveMidi(midiContent,user,targetFile){
	$.ajax({
		type: "POST",
		url: host+"savemidi.php",
		success:function(data) {
			alert(data);
		},
		data:{
			midiContent:midiContent,
			targetFile:targetFile,
			user:user
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


function loadMidi(user,midiFile){
	$.ajax({
		type: "POST",
		url: host+"loadMidiContent.php",
		success:function(data) {
			alert(data);
			return data;
		},
		data:{
			fileName:midiFile,
			user:user
		},
		fail:function(data){
			alert("FAIL");
		},
	});
}