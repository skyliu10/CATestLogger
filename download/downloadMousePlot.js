function getSVGString( svgNode ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var cssStyleText = getCSSStyles( svgNode );
	appendCSS( cssStyleText, svgNode );

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;

	function getCSSStyles( parentElement ) {
		var selectorTextArr = [];

		// Add Parent element Id and Classes to the list
		selectorTextArr.push( '#'+parentElement.id );
		for (var c = 0; c < parentElement.classList.length; c++)
				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
					selectorTextArr.push( '.'+parentElement.classList[c] );

		// Add Children element Ids and Classes to the list
		var nodes = parentElement.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
				selectorTextArr.push( '#'+id );

			var classes = nodes[i].classList;
			for (var c = 0; c < classes.length; c++)
				if ( !contains('.'+classes[c], selectorTextArr) )
					selectorTextArr.push( '.'+classes[c] );
		}

		// Extract CSS Rules
		var extractedCSSText = "";
		for (var i = 0; i < document.styleSheets.length; i++) {
			var s = document.styleSheets[i];
			
			try {
			    if(!s.cssRules) continue;
			} catch( e ) {
		    		if(e.name !== 'SecurityError') throw e; // for Firefox
		    		continue;
		    	}

			var cssRules = s.cssRules;
			for (var r = 0; r < cssRules.length; r++) {
				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
					extractedCSSText += cssRules[r].cssText;
			}
		}
		

		return extractedCSSText;

		function contains(str,arr) {
			return arr.indexOf( str ) === -1 ? false : true;
		}

	}

	function appendCSS( cssText, element ) {
		var styleElement = document.createElement("style");
		styleElement.setAttribute("type","text/css"); 
		styleElement.innerHTML = cssText;
		var refNode = element.hasChildNodes() ? element.children[0] : null;
		element.insertBefore( styleElement, refNode );
	}
}


function svgString2Image( svgString, width, height, format, callback ) {
	var format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	image.onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
			
			//changed - different from the original
			myPort.postMessage({done: 1});
		});

		
	};

	image.src = imgsrc;
	
}

function init(backPage){	
	mousePlot(backPage.loggerPack, backPage.blobs);
	
	var zip = new JSZip();
	
	$('.divVisualization').show();
	
	var blobs = backPage.blobs;
	
	//Create the element	
	var script = document.createElement("script");
	script.innerHTML = "var x; var x1; var bb;";
	
	for(let tab in blobs){
		
		for(let pageview in blobs[tab]){
			
			if(pageview.includes('loggerPopup.html') == false){
  
				var p = document.createElement('p');
				p.appendChild(document.createTextNode(backPage.blobs[tab][pageview]));
				p.style.display = "none";
				p.id = tab + pageview + 'blob';
				document.body.appendChild(p);

				// Add script content	
				script.innerHTML += "console.log('TEST');x = document.getElementById('" + tab + pageview + "' + 'iframe'" + "); x1 = document.getElementById('" + tab + pageview + "' + 'blob'" + ").textContent; bb = new Blob([x1], {type: 'text/html'	});" + "x.src = window.URL.createObjectURL(bb);";
			
			}
		}
	
	}
	
	//Append
	document.body.appendChild(script);
	
	var htmlContent = [(new XMLSerializer()).serializeToString(document)];
	var blob = new Blob(htmlContent, {type: "text/html"});
	//download as html
	
	var date = new Date(); 
    var fileName = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "-mousePlot";
	
	//download as html - zip
	zip.file(fileName + ".html", blob);
	zip.generateAsync({type:"blob"})
			.then(function (blob) {
				saveAs(blob, fileName + ".zip");
				//closing window
				myPort.postMessage({done: 1});
			});
}

var background = browser.runtime.getBackgroundPage();

var myPort = browser.runtime.connect({name:"port-from-download"});

background.then(init);

