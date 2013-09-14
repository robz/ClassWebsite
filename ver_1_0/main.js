var text_arr;
var forum_arr;
var init_forum_text;

function startup() {
	getFile("text.txt", setupText, false);
	getFile("forum.txt", setupForum, false);
	setStartText();
}

function postToForum() {
	var title = document.getElementById("title").value,
		msg = document.getElementById("message").value,
		len = forum_arr.length;

	if (title == "" || msg == "") return;

	forum_arr[len] = title;
	forum_arr[len+1] = msg;

	postFile("forum.txt", true, toFileText(forum_arr));
	setForumStr();
	setText(4);
}

function toFileText(arr) {
	var result = "", pre = "";
	for(var i = 0; i < arr.length; i++) {
		result += pre+arr[i];
		pre = "\n###\n";
	}
	return result;
}


function setupForum(text) {
	if (text.charAt(text.length-1) == '\n') 
		text = text.substring(0,text.length-1);
	forum_arr = text.split("\n###\n"); 
	for(var i = 0; i < forum_arr.length; i++)
		forum_arr[i] = forum_arr[i].replace(/\n/g,"<br/>");
	init_forum_text = text_arr[4];
	setForumStr();
}

function setForumStr() {
	var forum_text = "";
	for(var i = forum_arr.length-1; i >= 0; i-=2) {
		forum_text += "----------<br/>";
		forum_text += "<b>title:</b> "+forum_arr[i-1]+"<br/>";
		forum_text += "<b>message:</b><br/>"+forum_arr[i]+"<br/>";
	}
	text_arr[4] = init_forum_text+"<br/>"+forum_text;
}




function setupText(text) {
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
	if (index >= 0 && index < text_arr.length) {
		bodytext = text_arr[index];
		setCookie("robz-utcs-webpage-index",index);
	}
	document.getElementById("bodytext").innerHTML = bodytext;
}
