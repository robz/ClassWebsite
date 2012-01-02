var text_arr;

function startup() {
	loadTextSync();
	setStartText();
}

function loadTextSync() {
	var xmlhttp;

	if(window.XMLHttpRequest) 
		xmlhttp = new XMLHttpRequest();
	else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

	xmlhttp.open("GET","text.txt",false);
	xmlhttp.send();
	
	storeText(xmlhttp.responseText);
}

function storeText(text) {
	text_arr = text.split("###\n");
	for(var i = 0; i < text_arr.length; i++)
		text_arr[i] = text_arr[i].replace(/\n/g,"<br/>");
}

function setStartText() {
	var stored = getCookie("robz-utcs-webpage-index");
	if (stored==null) 
		setText(0);
	else
		setText(stored);
}

function setText(index) {
	var bodytext = "this shouldn't be happening: "+index;
	if (index >= 0 && index < text_arr.length)
		var bodytext = text_arr[index];
	document.getElementById("bodytext").innerHTML = bodytext;
	setCookie("robz-utcs-webpage-index",index);
}

function setCookie(name,value) {
	document.cookie = name + "=" + value;
}

function getCookie(name) {
	var i, x, y, cookies_arr = document.cookie.split(";");
	for (i = 0; i < cookies_arr.length; i++) {
		x = cookies_arr[i].substr(0, cookies_arr[i].indexOf("="));
		y = cookies_arr[i].substr(cookies_arr[i].indexOf("=")+1);
		x = x.replace(/^\s+|\s+$/g,"");
		if (x == name) 
			return unescape(y);
	}
}
