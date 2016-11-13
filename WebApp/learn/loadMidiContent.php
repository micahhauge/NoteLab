<?php
	$midiFileName = $_POST["fileName"];
	$midiFile = file_get_contents("user_saves/".$midiFileName);
	echo $midiFile;
?>