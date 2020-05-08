class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
    } 
                  
    // Functions to be implemented 
    // enqueue(item) 
    // dequeue() 
    // front() 
    // isEmpty() 
    // printQueue() 

    // enqueue function 
enqueue(element) 
{     
    // adding element to the queue 
    this.items.push(element); 
} 

dequeue() 
{ 
    // removing element from the queue 
    // returns underflow when called  
    // on empty queue 
    if(this.isEmpty()) 
        return "Underflow"; 
    return this.items.shift(); 
} 

// isEmpty function 
isEmpty() 
{ 
    // return true if the queue is empty. 
    return this.items.length == 0; 
} 

}


function bfs(graph, startNode)
{
	var visited = [];
	var distToSource = [];
	var ecc = 0;
	for(var i = 0; i < graph.getNumberOfNodes() + 1; i++)
	{
		visited[i] = false;
		distToSource[i] = 0;
	}


	var q = new Queue();

	visited[startNode.meandistance + 1] = true;
	q.enqueue(startNode);
	//console.log(startNode);

	while(!q.isEmpty())
	{
		var getElement = q.dequeue();
		var nodeList = getElement.adjList;

		for(let neigh of nodeList)
		{
			//var neigh = nodeList[x];
			//console.log(neigh);
			//console.log(neigh);

			if(!visited[neigh.distance + 1])
			{
				//console.log(neigh.distance + 1);
				visited[neigh.distance + 1] = true;
				distToSource[neigh.distance + 1] += (distToSource[getElement.distance + 1] + 1);
				//console.log(distToSource[neigh.distance + 1]);
				q.enqueue(neigh);

				if (distToSource[neigh.distance + 1] > ecc)
				{
					ecc = distToSource[neigh.distance + 1];
					//console.log("new ecc");
				}
			}
		}
	}

	// var max = 0;
	// for(var y = 0; y < graph.getNumberOfNodes; y++)
	// {
	// 	if(diameter[y] > diameter[max])
	// 	{
	// 		max = y;
	// 	}
	// }

	return ecc;
}

function normalize(value, max, min)
{
	return (value - min) * 1.0 / (max - min);

}

//formatting timestamp -> human readable
function getTimestamp(time){	
	var timehr = '';
	var x = 0;	
	x = Math.floor(time/3600000);
	if(x < 10 && x > -1)
		timehr += '0' + x;
	else	
		timehr += '' + x;
	
	time = time%3600000;
	x = Math.floor(time/60000);
	if(x < 10 && x > -1)
		timehr += ':0' + x;
	else
		timehr += ':' + x;
	
	time = time%60000;
	x = Math.floor(time/1000);
	if(x < 10 && x > -1)
		timehr += ':0' + x;
	else
		timehr += ':' + x;
	
	time = Math.floor(time%1000);
	x = Math.floor(time/1000);
	if(time < 10 && x > -1){
		timehr += '.00' + time;
	}
	else if(time < 100 && x > -1){
		timehr += '.0' + time;
	}
	else{
		timehr += '.' + time;
	}
	return timehr;	
}


function caResult(backPage){
var graph = createGraph(backPage.loggerPack);
var nodes = graph.nodes;
var links = graph.links;
var log = backPage.loggerPack;
	
//getReference(nodes, links);

var clicks = [];

var meanDist = 0.0;
var totalEvents;
var meanSpeed = 0.0;
var numClicks = 0;
var pauseClick = 0.0;
var taskTime;
var ecc = 0;
var meanDeg;
var speed = 0.0;
var lastTime = 0;
var caResult;
var countSpeed = 0;

nodes.sort(function(a, b){return a.tabId - b.tabId || b.occurrences - a.occurrences;});

for(let node of nodes)
{
	meanDist = meanDist + node.meanDistance;
	speed = node.meanDistance / node.meanTimestamp;
	
	
	if(!Number.isNaN(speed) && Math.sign(speed) != -1)
	{
		countSpeed++;
		console.log(speed);
		var flSpeed = parseFloat(speed);
		meanSpeed = flSpeed + meanSpeed;
}
	//meanSpeed = meanSpeed + (node.meanDistance / node.meanTimestamp);
	if(node.eventName == "click" || node.eventName == "dblclick")
	{
		numClicks++;
		pauseClick = pauseClick + (node.meanTimestamp - lastTime);
		lastTime = node.meanTimestamp;
	}
	taskTime = node.meanTimestamp;
	

}

pauseClick = pauseClick / numClicks;

meanDist = meanDist / nodes.length;

totalEvents = nodes.length

meanDeg = (graph.links.length * 2) / nodes.length;

meanSpeed = meanSpeed / countSpeed;
ecc = bfs(graph, graph.getNode("start"));

//normalization
meanDist = normalize(meanDist, 4391.227331, 575.1835744);
totalEvents = normalize(totalEvents, 2387, 434);
var taskhms = getTimestamp(taskTime);
var task = taskhms.split(':')
var secTask = (+task[0]) * 60 * 60 + (+task[1]) * 60 + (+task[2]);
taskTime = normalize(secTask, 139.47, 26.592)
meanSpeed = normalize(meanSpeed, 0.062037253, 0.029197404);
numClicks = normalize(numClicks, 34, 7);
ecc = normalize(ecc, 126, 12);
var pausehms = getTimestamp(pauseClick);
var pause = pausehms.split(':')
var pauseTask = (+pause[0]) * 60 * 60 + (+pause[1]) * 60 + (+pause[2]);
pauseClick = normalize(pauseTask, 10.682, 3.505)
meanDeg = normalize(meanDeg, 2.72392124, 2.470046);

	document.getElementById("body1Ca").innerHTML = meanDist.toFixed(2);

	document.getElementById("body2Ca").innerHTML = totalEvents.toFixed(2);

	
	document.getElementById("body3Ca").innerHTML = taskTime.toFixed(2);
	

	document.getElementById("body4Ca").innerHTML = meanSpeed.toFixed(2);


	document.getElementById("body5Ca").innerHTML = numClicks.toFixed(2);


	document.getElementById("body6Ca").innerHTML = ecc.toFixed(2);
 
	document.getElementById("body7Ca").innerHTML = pauseClick.toFixed(2);

	document.getElementById("body8Ca").innerHTML = meanDeg.toFixed(2);

	caResult = calcResult(meanDist.toFixed(2), totalEvents.toFixed(2), meanSpeed.toFixed(2), numClicks.toFixed(2), pauseClick.toFixed(2), taskTime.toFixed(2), ecc.toFixed(2), meanDeg.toFixed(2))

	document.getElementById("body0Ca").innerHTML = caResult;


}



function calcResult(meanDist, totalEvents, meanSpeed, numClicks, pauseClick, taskTime, peaks, meanDeg){

// 0 = no, 1 = moderate, 2 = high
var caResult = 0;


if(meanDist < 0.32)
{
	if(totalEvents < 0.18)
	{
		caResult = 2;
		document.getElementById("recommend").innerHTML = "Results indicate high level of CA, look at Total Events.";
		return caResult;
	}
	else
	{
		if(meanSpeed < 0.19)
		{
			caResult = 0;
			document.getElementById("recommend").innerHTML = "Results indicate no level of CA.";
			return caResult;
		}
		else
		{
			if(numClicks < 0.34)
			{
				caResult = 0;
				document.getElementById("recommend").innerHTML = "Results indicate no level of CA.";
				return caResult;
			}
			else
			{
				caResult = 2;
				document.getElementById("recommend").innerHTML = "Results indicate high level of CA, look at Number of Clicks.";
				return caResult;
			}
		}
	}
}
else
{
	if(pauseClick < 0.12)
	{
		if(taskTime > 0.15)
		{
			caResult = 2;
			document.getElementById("recommend").innerHTML = "Results indicate high level of CA, look at Task Time.";
			return caResult;
		}
		else
		{
			if(peaks < 0.05)
			{
				caResult = 1;
				document.getElementById("recommend").innerHTML = "Results indicate moderate level of CA.";
				return caResult;
			}
			else
			{
				caResult = 0;
				document.getElementById("recommend").innerHTML = "Results indicate no level of CA.";
				return caResult;
			}
		}
	}
	else
	{
		if(meanDeg < 0.66)
		{
			caResult = 1; 
			document.getElementById("recommend").innerHTML = "Results indicate moderate level of CA.";
			return caResult;
		}
		else
		{
			caResult = 0;
			document.getElementById("recommend").innerHTML = "Results indicate no level of CA.";
			return caResult;
		}
	}
}
}
