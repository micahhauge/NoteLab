<?php
	//print_r($_POST);
	if(!is_dir("user_saves/".$_POST["user"]."/"))
		mkdir("user_saves/".$_POST["user"]."/");
	
	file_put_contents("user_saves/".$_POST["user"]."/".$_POST["targetFile"],$_POST["midiContent"]);
?>