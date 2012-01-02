function startup() {
	setInitContent();
	manageCounter();
}

function manageCounter() {
	var callback = function(contents) {
		var counter = parseInt(contents)+1;
		postFile("counter.txt", true, counter);
		document.getElementById("hits").innerHTML = counter;
	}
	getFile("counter.txt", callback, true);
}

function setInitContent() {
	var stored = getCookie("robz-utcs-webpage-index");
	if (stored==null) 
		setContent(0);
	else
		setContent(stored);
}

function setContent(index) {
	var title = "error! ",
		text = "this shouldn't be happening: "+index;
	if (index >= 0 && index < 4) {
		title = content_arr[index]["title"];
		text = content_arr[index]["text"];
		setCookie("robz-utcs-webpage-index",index);
	}
	document.getElementById("contentHeading").innerHTML = title;
	document.getElementById("contentText").innerHTML = text;
}