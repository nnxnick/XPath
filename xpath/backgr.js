'use strict';

function handleRequest(request, sender, cb) {
	// Simply relay the request. This lets content.js talk to bar.js.
	chrome.tabs.sendMessage(sender.tab.id, request, cb);

}

chrome.runtime.onMessage.addListener(handleRequest);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({"title": "Datacol xpath", "contexts":["all"],
		"id": "xpathclip"});
});

// The onClicked callback function.

var vxpath = '';

//Click menu item
function onClickHandler(info, tab) {
	if (info.menuItemId == "xpathclip") {
		chrome.tabs.getSelected(null, function (tab) { //выбирается ид открытого таба, выполняется коллбек с ним
			chrome.runtime.sendMessage({ type: 'calcBar', tabid: tab.id }); //запрос  на сообщение
		});
		//chrome.runtime.sendMessage({type: 'calcBar'});
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);
