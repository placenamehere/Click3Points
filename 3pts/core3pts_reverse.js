
var onHold = false;
var clicks=0;
var clickMonitor = new Array();
var currentImg = 0;

// preload images
var imgPreloadHolder = new Array()
for (j=0;j<imgURIs.length;j++) { imgPreloadHolder[j] = new Image(); imgPreloadHolder[j].src = imgURIs[j]; }



function createPetal(iX,iY,iZ,iHscale,iWscale) {

	var petalDiv = document.createElement("DIV");
	petalDiv.setAttribute("id","petal" + iZ);
	// this doesn't seem to work in IE... i'll try after i attach it (below)
	// petalDiv.setAttribute("style","position:absolute; left:" + iX + "; top:" + iY + "; z-index:" + iZ + ";");
	
	
	var realWidth = Math.floor(iWscale*0.01*baseImgWidth);
	var realHeight = Math.floor(iHscale*0.01*baseImgHeight);
	
	// clean up negative dimensions
	
	if (realWidth < 0) {
		iX = iX + realWidth;
		realWidth = realWidth*-1;
	}
	
	if (realHeight < 0) {
		iY = iY + realHeight;
		realHeight = realHeight*-1;
	}
	
	
	// decide which image to use
	currentImg++;
	if (currentImg >= imgURIs.length) { currentImg = 0 }
	
	
	var petalImg = document.createElement("IMG");
	petalImg.setAttribute("src",imgURIs[currentImg]);
	petalImg.setAttribute("width",realWidth);
	petalImg.setAttribute("height",realHeight);
	
	petalDiv.appendChild(petalImg);
	document.getElementsByTagName("body").item(0).appendChild(petalDiv);
	
	document.getElementById("petal" + iZ).style.position = "absolute";	
	document.getElementById("petal" + iZ).style.left = iX;
	document.getElementById("petal" + iZ).style.top = iY;
	document.getElementById("petal" + iZ).style.zIndex = 100 - iZ;
	
	
	/*
	// just some stupid shit
	
	var debugmsg = "node #:" + iZ + " x,y,z,h,w: " + iX + "," + iY + "," + iZ + "," + realWidth + "," + realHeight;
	var debugline = document.createElement("DIV");
	debugline.appendChild(document.createTextNode(debugmsg))
	document.getElementsByTagName("body").item(0).appendChild(debugline);
	*/
}



// don't blame me for the following code.
// i'm just porting spydrs actionscript.
function handleMouseDown(e) {

	clicks++;

	if (window.event) { // MSIE behavior
		clickMonitor[clicks] = [window.event.clientX,window.event.clientY];
	} else { // NN behavior
		clickMonitor[clicks] = [e.pageX,e.pageY];
	}
	
	
	// this next line is not cool yet
	
	
	window.status = "clicks: " + clicks + "; [x,y]: [" + clickMonitor[clicks][0] + "," + clickMonitor[clicks][1] + " ]";
	if (clicks == 3) {
		onHold =true;
		document.getElementsByTagName("body").item(0).style.cursor="wait";
		
		
		// rather then reuse the divs in the body i'll just remove all the
		// current ones and start from scratch
		var numDivs = document.getElementsByTagName('div').length;
		window.status = "DBG: document.getElementsByTagName('div').length: " + document.getElementsByTagName('div').length;
		if (numDivs != 0) { 
			for (i=0;i<numDivs;i++) {
				document.body.removeChild(document.getElementsByTagName('div').item(0));
			}
		}
		
		
		for (i=3; i<=iterations; i++) {
			var x = Math.floor(clickMonitor[1][0]+(i*(clickMonitor[3][0]-clickMonitor[2][0])/40));
			var y = Math.floor(clickMonitor[1][1]+(i*(clickMonitor[3][1]-clickMonitor[2][1])/40));
			var z = i;
			var h = (clickMonitor[1][0]-clickMonitor[2][0])/(i/5);
			var w = (clickMonitor[1][1]-clickMonitor[2][1])/(i/5);
			 

			createPetal(x,y,z,h,w);
		}
		clicks = 0;
		onHold = false;
		document.getElementsByTagName("body").item(0).style.cursor="default";
	}

}

window.onload = new Function("if (window.document.captureEvents!=null) { window.document.captureEvents(Event.MOUSEDOWN) } window.document.onmousedown = handleMouseDown;");
