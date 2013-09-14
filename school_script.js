function startup() {
	setInitContent();
	manageCounter();
	canvasInit();
}

function manageCounter() {
	var callback = function(contents) {	
		var counter = parseInt(contents)+1;
		postFile("content/counter.txt", true, counter);
		document.getElementById("hits").innerHTML = counter;
	}
	getFile("content/counter.txt", callback, true);
}

function setInitContent() {
	var stored = getCookie("robz-utcs-webpage-index");
	if (!stored) 
		setContent(0);
	else
		setContent(stored);
}

var starting = true;
function setContent(index) {
	var title = "error! ",
		text = "this shouldn't be happening: "+index+" of "+content_arr.length;
	if (index >= 0 && index < content_arr.length) {
		title = content_arr[index]["title"];
		text = content_arr[index]["text"];
		setCookie("robz-utcs-webpage-index",index);
	}
	
	if (!starting) {
		$("#mainContent").fadeOut(150);
		setTimeout(function(){
			setContentAux(title,text);
			$("#mainContent").fadeIn(150);
		}, 150);
	} else {
		starting = false;
		setContentAux(title,text);
	} 
}

function setContentAux(title, text) {
	document.getElementById("contentHeading").innerHTML = title;
	document.getElementById("contentText").innerHTML = text;
}