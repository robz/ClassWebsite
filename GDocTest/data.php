<?php
	$clientText = $_GET['text'];
	$clientID = $_GET['id'];
	
	$filename = "data.txt";
	$idfile = "id.txt";
	
	$serverID = file_get_contents($idfile);
	$serverText = file_get_contents($filename);
	
	$counter = 0;
	while($counter < 50 || $serverID === $clientID || $serverText === $clientText) {
		$serverID = file_get_contents($idfile);
		$serverText = file_get_contents($filename);
		usleep(100000);
		$counter++;
	}
	
	$status = "ripe";
	if ($counter == $timeout)
		$status = "rotten";
	echo '{"status":"'.$status.'","ID":"'.$serverID.'","clientText":"'.$clientText.'","serverText":"'.$serverText.'"}';
?>