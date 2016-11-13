<?php
	$midiFileName = $_POST["fileName"];
	$user = $_POST["user"];
	if(file_exists("user_saves/".$user.'/'.$midiFileName))
		$midiFile = file_get_contents("user_saves/".$user.'/'.$midiFileName);
		echo $midiFile;
?>