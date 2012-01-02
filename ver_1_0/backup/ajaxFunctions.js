
function postFile(filename, isAsync, text) {
	var agaxRequest;

	if (window.XMLHttpRequest)
		agaxRequest = new XMLHttpRequest();
	else
		agaxRequest = new ActiveXObject("Microsoft.XMLHTTP");

	agaxRequest.open("POST","write.php",isAsync);
	agaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
	agaxRequest.send("text="+text+"&filename="+filename);
}

function getFile(filename, postfunct, isAsync) {
	var agaxRequest;

	if(window.XMLHttpRequest) 
		agaxRequest = new XMLHttpRequest();
	else
		agaxRequest = new ActiveXObject("Microsoft.XMLHTTP");

	if (isAsync) {
		agaxRequest.onreadystatechange = function() {
			if (agaxRequest.readyState==4 && agaxRequest.status==200) 
				postfunct(agaxRequest.responseText);
		}
	}

	agaxRequest.open("GET", filename, isAsync);
	agaxRequest.send();
	
	if (!isAsync)
		postfunct(agaxRequest.responseText);
}
