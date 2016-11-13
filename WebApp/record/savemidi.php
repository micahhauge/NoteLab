<?php
	//print_r($_POST);
	file_put_contents("user_saves/".$_POST["targetFile"],$_POST["midiContent"]);
?>