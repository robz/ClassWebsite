var OUTPUT_FILENAME = "gdocdata.txt";
var counter = 0;
window.onload = init();

function init() {
	continuousGetFile(OUTPUT_FILENAME, placeText, true);
}

function placeText(text) {
	//alert(text);
	document.getElementById("textarea").innerHTML = text;
	writeBackText(text);
}

function writeBackText(text) {
	document.getElementById("debug").innerHTML = text;
	postFile(OUTPUT_FILENAME, true, text);
}

// should be async (it would be silly to do it syncr)
function continuousGetFile(filename, postfunct) {
	var agaxRequest;

	if(window.XMLHttpRequest) 
		agaxRequest = new XMLHttpRequest();
	else
		agaxRequest = new ActiveXObject("Microsoft.XMLHTTP");

	agaxRequest.onreadystatechange = function() {
		if (agaxRequest.readyState==4 && agaxRequest.status==200) {
			postfunct(agaxRequest.responseText);
			counter++;
			document.getElementById("counter").innerHTML = 
				"# of times updated so far: "+counter;
			// recursive step: 
			// (but another way to think about it is this 
			//	"resets of the interrupt enable")
			var sendRequest = function() {
				agaxRequest.open("GET", filename, true);
				agaxRequest.send();
			}
			//setTimeout(sendRequest,500);
		}
	}

	agaxRequest.open("GET", filename, true);
	agaxRequest.send();
}

function postFile(filename, isAsync, text) {
	var params = "text="+text+"&filename="+filename;
	var ajaxRequest;

	if (window.XMLHttpRequest)
		ajaxRequest = new XMLHttpRequest();
	else
		ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
	
	if (isAsync) {
		// Call a function when the state changes.	
		ajaxRequest.onreadystatechange = function() {
			if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
				//alert(ajaxRequest.responseText);
			}
		}
	}

	ajaxRequest.open("POST","write.php",isAsync);
	ajaxRequest.setRequestHeader("Content-type",
		"application/x-www-form-urlencoded");
	ajaxRequest.send(params);
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
