	var reportsOpen = 0;
	var webPagesIds = 0;
	var connections = 0;
    var loggerPack = [];
	var blobs = {};
	var portsFromCS = {};
	var message = {
			string: "",
			settings: {},
			id: 0
	}
	var settings = {
		"interval" : 500,
		"eventAndFlags": {"blur" : 1, "focus" : 1, "focusin" : 1, "focusout" : 1, "load" : 1, "resize" : 1, "scroll" : 1, "unload" : 1, "beforeunload" : 1, "click" : 1, "dblclick" : 1, "mousedown" : 1, "mouseup" : 1, "mousemove" : 1, "mouseover" : 1, "mouseout" : 1, "mouseenter" : 1, "mouseleave" : 1, "change" : 1, "select" : 1, "submit" : 1, "keypress" : 1, "keydown" : 1, "keyup" : 1, "error" : 1, "touchstart" : 1, "touchmove" : 1, "touchend" : 1, "touchcancel" : 1, "gesturestart" : 1, "gesturechange" : 1, "gestureend" : 1, "orientationchange" : 1, "DOMNodeInserted" : 1, "DOMNodeRemoved" : 1, "devicemotion" : 1, "deviceorientation" : 1, "geolocationchange" : 1, "pageview" : 1, "hashchange" : 1},
		"dataType" : "html",
		"columnMarker" : ",",
		"lineMarker" : ";",
		"nullMarker" : "-",
		"escapeMarker" : "\\",
		"recording" : 0,
		"report" : 0
	}; 
	 
	function connected(p) {
		if(p.name == 'port-from-report'){
			reportsOpen++;
			settings.report = 1;
			p.onDisconnect.addListener(function(m){
				reportsOpen--;
				if(reportsOpen == 0){
					settings.report = 0;
				}
				console.log('REPORT CLOSED');
			});
		}
		else if(p.name == 'port-from-cs'){
			connections++;
			currentPort = (webPagesIds++).toString();
			portsFromCS[currentPort] = p;
		
			//Sending the first message to update sender's settings
			message.string = 'init';
			message.settings = settings;
			
			//now sending the tab id, if it is the logger popup sets to 0
			if(p.sender.tab != undefined)
				message.id = p.sender.tab.id;
			else
				message.id = 0
			
			portsFromCS[currentPort].postMessage(message);
		
			portsFromCS[currentPort].onMessage.addListener(function(m) {
				if(m.blob == undefined){
					loggerPack.push(m.line);
				}
				else{
					if(blobs[m.id] == undefined){
						blobs[m.id] = {};
					}
					blobs[m.id][m.pageview] = m.blob;
				}
			});
		}
		else if(p.name == 'port-from-download'){
			p.onMessage.addListener(function(m, port){
				if(m.done == 1){
					
					browser.tabs.remove(port.sender.tab.id);
					
				}
			});
		}
	}

	function callRestartCS(){
		message.string = "restart";
		settings.recording = 0;
		message.settings = settings;
		browser.commands.reset(connected);
		
		//try, maybe switch to if
		for (ports in portsFromCS){
			try{
				portsFromCS[ports].postMessage(message);
			}
			catch(e){
				delete portsFromCS[ports];
				connections--;
			}
		}
	}
	
	function callRecordCS(){
		message.string = "record";
		settings.recording = 1;
		message.settings = settings;
		
		//try, maybe switch to if
		for (ports in portsFromCS){
			try{
				portsFromCS[ports].postMessage(message);
			}
			catch(e){
				delete portsFromCS[ports];
				connections--;
			}
		}
	}
	
	function callPauseCS(){
		message.string = "pause";
		settings.recording = 0;
		message.settings = settings;
		
		//try, maybe switch to if
		for(ports in portsFromCS){
			try{
				portsFromCS[ports].postMessage(message);
			}
			catch(e){
				delete portsFromCS[ports];
				connections--;
			}
		}
	}
	
	function callEventUpdateCS(){
		message.string = "eventUpdate";
		message.settings = settings;
		
		//try, maybe switch to if
		for(ports in portsFromCS){
			try{
				portsFromCS[ports].postMessage(message);
			}
			catch(e){
				delete portsFromCS[ports];
				connections--;
			}
		}
	}
	
	function eventUpdate(eventName){
		settings.eventAndFlags[eventName] = Math.abs( settings.eventAndFlags[eventName] - 1 );
		callEventUpdateCS();
	}
	
	function emptyPack(){
		loggerPack = [];
	}
	
	
	function reportGraph(){
		var reportPage = browser.extension.getURL('report/reportGraph.html');
		console.log( reportPage );
	
		var reportTab = browser.tabs.create({
			url:reportPage
		});			
	}
	
	function reportMp(){
		var reportPage = browser.extension.getURL('report/reportMousePlot.html');
		console.log( reportPage );
	
		var reportTab = browser.tabs.create({
			url:reportPage
		});			
	}
	
	function reportHeatmap(){
		var reportPage = browser.extension.getURL('report/reportHeatmap.html');
		console.log( reportPage );
	
		var reportTab = browser.tabs.create({
			url:reportPage
		});	
	}
	
	function reportPatterns(){
		var reportPage = browser.extension.getURL('report/reportPatterns.html');
		console.log( reportPage );
	
		var reportTab = browser.tabs.create({
			url:reportPage
		});	
	}
	
	function reportIncidents(){
		var reportPage = browser.extension.getURL('report/reportIncidents.html');
		console.log( reportPage );
	
		var reportTab = browser.tabs.create({
			url:reportPage
		});	
	}

	function reportcaResult(){
		var reportPage = browser.extension.getURL('report/reportcaResult.html');
		console.log( reportPage );
	
		var reportTab = browser.tabs.create({
			url:reportPage
		});	
	}
	
	function downloadGraph(){
		var downloadPage = browser.extension.getURL('download/downloadGraph.html');
		console.log( downloadPage );
	
		var downloadTab = browser.tabs.create({
			url:downloadPage
		});
	}
	
	function downloadMousePlot(){
		var downloadPage = browser.extension.getURL('download/downloadMousePlot.html');
		console.log( downloadPage );
	
		var downloadTab = browser.tabs.create({
			url:downloadPage
		});
	}
	
	function downloadHeatmap(){
		var downloadPage = browser.extension.getURL('download/downloadHeatmap.html');
		console.log( downloadPage );
	
		var downloadTab = browser.tabs.create({
			url:downloadPage
		});
		
	}
	
	function downloadPatterns(){
		var downloadPage = browser.extension.getURL('download/downloadPatterns.html');
		console.log( downloadPage );
	
		var downloadTab = browser.tabs.create({
			url:downloadPage
		});
		
	}
	
	function downloadIncidents(){
		var downloadPage = browser.extension.getURL('download/downloadIncidents.html');
		console.log( downloadPage );
	
		var downloadTab = browser.tabs.create({
			url:downloadPage
		});
		
	}

	function downloadcaResult(){
		var downloadPage = browser.extension.getURL('download/downloadcaResult.html');
		console.log( downloadPage );
	
		var downloadTab = browser.tabs.create({
			url:downloadPage
		});
		
	}
	
	function downloadAll(){
		var downloadPage = browser.extension.getURL('download/downloadAll.html');
		console.log( downloadPage );
	
		var downloadTab = browser.tabs.create({
			url:downloadPage
		});
		
	}
	
	function uploadSetup(){
		var page = browser.extension.getURL('upload/setup.html');
		console.log( page );
	
		var tab = browser.tabs.create({
			url:page
		});
	}
	
	browser.runtime.onConnect.addListener(connected);