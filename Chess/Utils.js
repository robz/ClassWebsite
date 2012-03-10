function Utils() 
{
	var textToImgNameMap = {
		"WP":"white-pawn.png", 
		"WR":"white-rook.png", 
		"WH":"white-knight.png", 
		"WB":"white-bishop.png", 
		"WK":"white-king.png", 
		"WQ":"white-queen.png", 
		"BP":"black-pawn.png", 
		"BR":"black-rook.png", 
		"BH":"black-knight.png", 
		"BB":"black-bishop.png", 
		"BK":"black-king.png", 
		"BQ":"black-queen.png", 
	}
	
	var imgNameToTextMap = {
		"white-pawn.png":	"WP", 
		"white-rook.png":	"WR", 
		"white-knight.png":	"WH", 
		"white-bishop.png":	"WB", 
		"white-king.png":	"WK", 
		"white-queen.png":	"WQ", 
		"black-pawn.png":	"BP", 
		"black-rook.png":	"BR", 
		"black-knight.png":	"BH", 
		"black-bishop.png":	"BB", 
		"black-king.png":	"BK", 
		"black-queen.png":	"BQ", 
	}
	
	var textToPointsMap = {
		'P':1, 
		'R':5, 
		'H':3, 
		'B':3, 
		'K':999, 
		'Q':9, 
	}
	
	this.textToImgName = function(str) {
		return textToImgNameMap[str];
	}
	
	this.imgNameToText = function(str) {
		return imgNameToTextMap[str];
	}
	
	this.charToPoints = function(ch) {
		return textToPointsMap[ch];
	}
	
	this.coordToId = function(coord) {
		return "sq"+(coord[0] * 8 + coord[1]);
	}
	
	this.idToCoord = function(str) {
		var index = parseInt(str.substring(2, str.length));
		return [Math.floor(index/8), index%8]
	}
	
	this.setImage = function(id, url, name) {
		var html = "<img src=\""+url+"\" id=\""+name+"\">";
		if (document.getElementById(id).innerHTML != html) {
			document.getElementById(id).innerHTML = html;
		}
	}
	
	this.clear = function(id) {
		document.getElementById(id).innerHTML = "";
	}
	
	this.imgIDToCoord = function(id) {
		var arr = id.split("_");
		return [parseInt(arr[1]), parseInt(arr[2])];
	}
	
	this.getEventElement = function(event) {
		return event.srcElement;
	}
	
	this.getElemSrcFileName = function(elem) {
		var arr = elem.src.split("/");
		return arr[arr.length-1];
	}
	
	this.setDeselected = function(coord) {
		var id = this.coordToId(coord);
		var elem = document.getElementById(id);
		var num = parseInt(elem.id.substring(2, elem.id.length));
		elem.className = elem.className.replace( /(?:^|\s)selected(?!\S)/ , '' );
		if ( Math.floor(num/8)%2 == 0 )
			elem.className += " row1 ";
		else 
			elem.className += " row2 ";
	}
	
	this.setSelected = function(coord) {
		var id = this.coordToId(coord);
		var elem = document.getElementById(id);
		elem.className = elem.className.replace( /(?:^|\s)row1(?!\S)/ , '' );
		elem.className = elem.className.replace( /(?:^|\s)row2(?!\S)/ , '' );
		elem.className += " selected ";
	}
	
	this.containsCoord = function(arr, obj) {
		var i = arr.length;
		while (i--) {
		   if (arr[i][0] == obj[0] && arr[i][1] == obj[1]) {
			   return true;
		   }
		}
		return false;
	}
}