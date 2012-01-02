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
