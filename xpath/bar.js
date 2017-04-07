'use strict';

// Constants.
var isActive = true;
var swActive = true;

var MOVE_DOWN_PERIOD_MS = 400;
var X_KEYCODE = 90;

// Global variables.
var Elementquery = document.getElementById('query');
var resultsEl = document.getElementById('results');
var queryboxEl = document.getElementById('query-box');
var bodyboxEl = document.getElementById('body-box');

// Used by handleMouseMove() to enforce a cooldown period on move.
var lastMoveTimeInMs = 0;

var evaluateQuery = function() {
	chrome.runtime.sendMessage({
		type: 'evaluate',
		query: Elementquery.value
	});
};

var setisactive = function () {
	if (swActive === true) {
		isActive = true;
	}
};

var setboxview = function () {
	swActive = false;
	isActive = false;
	if (queryboxEl) {
		queryboxEl.style.backgroundColor = 'white';
		queryboxEl.style.height = '50px';
		queryboxEl.style.display = '';
	}
};
var setboxhide = function () {
	if (queryboxEl) {
		queryboxEl.style.backgroundColor = 'transparent';
		queryboxEl.style.height = '5px';
		queryboxEl.style.display = 'none';
	}
	swActive = true;
	isActive = true;
	chrome.runtime.sendMessage({ type: 'showBar' });
};

//Elementquery.addEventListener('keyup', evaluateQuery);
//Elementquery.addEventListener('mouseup', evaluateQuery);

//Add clipboard listener
document.addEventListener('copy', function(e) {
				e.clipboardData.setData("Text", Elementquery.value);
				e.preventDefault();
});

//Click menu item
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.request === 'setvxpclickh') {
		if (Elementquery.value) {
			document.execCommand("Copy");
		}
	}
	else if (isActive === true && msg.type === 'mousectx') {
		isActive = false;
		window.setTimeout(setisactive, 2500);
	}
	else if (msg.type === 'calcBar') {
		if (Elementquery.value) {
			chrome.runtime.sendMessage({ type: 'nohideBar',  tabid: msg.tabid});
			setboxview();
			document.execCommand("Copy");
			window.setTimeout(setboxhide, 1500);
		}
	}
	else if (isActive === true && msg.type === 'update') {
		if (msg.query !== null) {
			Elementquery.value = msg.query;
		}
		if (msg.results !== null) {
			resultsEl.value = msg.results[0];
			//nodeCountText.nodeValue = msg.results[1];
		}
	}
});
