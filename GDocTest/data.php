<?php
	$clientText = $_GET['text'];
	$clientID = $_GET['id'];
	
	$filename = "data.txt";
	$idfile = "id.txt";
	
	$serverID = file_get_contents($idfile);
	$serverText = file_get_contents($filename);
	while($serverID === $clientID || $serverText === $clientText) {
		$serverID = file_get_contents($idfile);
		$serverText = file_get_contents($filename);
		usleep(100000);
	}
	
	echo '{"ID":"'.$serverID.'","clientText":"'.$clientText.'","serverText":"'.$serverText.'"}';
?>