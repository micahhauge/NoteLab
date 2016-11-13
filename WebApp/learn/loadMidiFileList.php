<?php
	$usrMidiDir = "user_saves";
	$fileNameList = array();
	
	if (is_dir($usrMidiDir)){
	  if ($dir = opendir($usrMidiDir)){
		while (($file = readdir($dir)) !== false){
		  if($file != "." && $file != ".."){
			array_push($fileNameList,$file);
		  }
		}
		
		echo(implode($fileNameList,","));
		closedir($dir);
	  }
	}
?>