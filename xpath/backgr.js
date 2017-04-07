'use strict';

function handleRequest(request, sender, cb) {
	// Simply relay the request. This lets content.js talk to bar.js.
	chrome.tabs.sendMessage(sender.tab.id, request, cb);

}

chrome.runtime.onMessage.addListener(handleRequest);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({"title": "Copy xpath to clipboard", "contexts":["all"],
		"id": "xpathclip"});
});



//Click menu item
function onClickHandler(info, tab) {
	if (info.menuItemId == "xpathclip") {
		chrome.tabs.getSelected(null, function (tab) {
			chrome.runtime.sendMessage({ type: 'calcBar', tabid: tab.id });
		});
	}
}

// The onClicked callback function.
chrome.contextMenus.onClicked.addListener(onClickHandler);
