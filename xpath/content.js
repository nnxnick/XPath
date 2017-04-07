'use strict';

// Extension namespace.
var xpathhandler = xpathhandler || {};

////////////////////////////////////////////////////////////
// Generic helper functions and constants 

xpathhandler.SHIFT_KEYCODE = 16;
xpathhandler.X_KEYCODE = 90;

xpathhandler.elementsShareFamily = function(primaryEl, siblingEl) {
	var p = primaryEl, s = siblingEl;
	return (p.tagName === s.tagName &&
		(!p.className || p.className === s.className) &&
		(!p.id || p.id === s.id));
};

xpathhandler.getElementIndex = function(el) {
	var index = 1;	// XPath is one-indexed
	var sib;
	for (sib = el.previousSibling; sib; sib = sib.previousSibling) {
		if (sib.nodeType === Node.ELEMENT_NODE && xpathhandler.elementsShareFamily(el, sib)) {
			index++;
		}
	}
	if (index > 1) {
		return index;
	}
	for (sib = el.nextSibling; sib; sib = sib.nextSibling) {
		if (sib.nodeType === Node.ELEMENT_NODE && xpathhandler.elementsShareFamily(el, sib)) {
			return 1;
		}
	}
	return 0;
};

xpathhandler.removenumberpart = function (xstr, whr) {
	var retv = '';
	var xstrid = whr + '=\'' + xstr + '\'';
	var strid = xstr;
	var arr20 = strid.split(' ');
	if (arr20.length > 1)
	{
		xstrid = '';
		for (var n = 0; n < arr20.length; n++) {
			var arrmn = arr20[n].split('-');
			if (arrmn.length > 1) {
				arr20[n] = '';
				for (var xi = 0; xi < arrmn.length; xi++) {
					var xnnumstr = arrmn[xi].replace(/[^\d]/g, '');
					if (xnnumstr === '') {
						if (arr20[n] === '') {
							arr20[n] += arrmn[xi];
						}
						else {
							arr20[n] += '-' + arrmn[xi];
						}
					}
					else {
						xnnumstr = arrmn[xi].replace(/[\d]/g, '');
						if (xnnumstr !== '') {
							if (arr20[n] === '') {
								arr20[n] += arrmn[xi];
							}
							else {
								arr20[n] += '-' + arrmn[xi];
							}
						}
					}
				} //for arrmn
			} //arrmn
			else {
				var xanumstr = arr20[n].replace(/[\d]/g, '');
				if (xanumstr === '') {
					arr20[n] = '';
				}
			} //else arrmn
			if (arr20[n] !== '') {
				if (xstrid === '') {
					xstrid += 'contains(' + whr + ',\'' + arr20[n] + '\')';
				}
				else {
					xstrid += ' and contains(' + whr + ',\'' + arr20[n] + '\')';
				}
			}
		} //for arr20
	} //arr20
	else {
		var arrmn = strid.split('-');
		if (arrmn.length > 1) {
			strid = '';
			for (var xi = 0; xi < arrmn.length; xi++) {
				var xnnumstr = arrmn[xi].replace(/[^\d]/g, '');
				if (xnnumstr === '') {
					if (strid === '') {
						strid += arrmn[xi];
					}
					else {
						strid += '-' + arrmn[xi];
					}
				}
				else {
					xnnumstr = arrmn[xi].replace(/[\d]/g, '');
					if (xnnumstr !== '') {
						if (strid === '') {
							strid += arrmn[xi];
						}
						else {
							strid += '-' + arrmn[xi];
						}
					}
				}
			} //for arrmn
			if (strid !== '' && strid !== xstr) {
				xstrid = 'contains(' + whr + ',\'' + strid + '\')';
			}
		} //arrmn
	} // else arr20
	retv = xstrid;
	return retv;
};

xpathhandler.makeOptimizedForElement = function(el, wi, fe, w3) {
	var query = '';
	var xw3 = 0;
	var first = true;
	//console.log(el.tagName);
	for (; first === true && el && el.nodeType === Node.ELEMENT_NODE; el = el.parentNode) {
		var component = el.tagName.toLowerCase();
		var index = xpathhandler.getElementIndex(el);
		var addquery = true;
		if (component === 'html' || component === 'body') {
			addquery = false;
		}
		if (addquery === true) {
			if (el.id) {
				var xstrid = xpathhandler.removenumberpart(el.id, '@id');
				if (xstrid !== '') {
					component += '[' + xstrid + ']';
					if (fe === true) {
						first = false;
					}
					xw3++;
					if (w3 === true && xw3 === 3) {
						first = false;
					}
				}
			} //el.id
			else if (el.className) {
				var xstrid = xpathhandler.removenumberpart(el.className, '@class');
				if (xstrid !== '') {
					component += '[' + xstrid + ']';
					if (fe === true) {
						first = false;
					}
					xw3++;
					if (w3 === true && xw3 === 3) {
						first = false;
					}
				}
			} //el.className
			if (index >= 1 && wi === false) {
				component += '[' + index + ']';
			}
			// If the last tag is an img, the user probably wants img/@src.
			if (query === '' && el.tagName.toLowerCase() === 'img') {
				component += '/@src';
			}
			query = '/' + component + query;
		} //addquery
	} //for
	if (query !== '') {
		query = '/' + query;
	}
	return query;
};

xpathhandler.makeQueryForElement = function(el) {
	var query = '';
	for (; el && el.nodeType === Node.ELEMENT_NODE; el = el.parentNode) {
		var component = el.tagName.toLowerCase();
		var index = xpathhandler.getElementIndex(el);
		if (el.id) {
			component += '[@id=\'' + el.id + '\']';
		} else if (el.className) {
			component += '[@class=\'' + el.className + '\']';
		}
		if (index >= 1) {
			component += '[' + index + ']';
		}
		// If the last tag is an img, the user probably wants img/@src.
		if (query === '' && el.tagName.toLowerCase() === 'img') {
			component += '/@src';
		}
		query = '/' + component + query;
	}
	return query;
};

xpathhandler.highlight = function(els) {
	for (var i = 0, l = els.length; i < l; i++) {
		els[i].classList.add('xh-highlight');
	}
};

xpathhandler.clearHighlights = function() {
	var els = document.querySelectorAll('.xh-highlight');
	for (var i = 0, l = els.length; i < l; i++) {
		els[i].classList.remove('xh-highlight');
	}
};

// Returns [values, nodeCount]. Highlights result nodes, if applicable. Assumes
// no nodes are currently highlighted.
xpathhandler.evaluateQuery = function(query) {
	var xpathResult = null;
	var str = '';
	var nodeCount = 0;
	var toHighlight = [];

	try {
		xpathResult = document.evaluate(query, document, null,
																		XPathResult.ANY_TYPE, null);
	} catch (e) {
		str = '[INVALID XPATH EXPRESSION]';
		nodeCount = 0;
	}

	if (!xpathResult) {
		return [str, nodeCount];
	}

	if (xpathResult.resultType === XPathResult.BOOLEAN_TYPE) {
		str = xpathResult.booleanValue ? '1' : '0';
		nodeCount = 1;
	} else if (xpathResult.resultType === XPathResult.NUMBER_TYPE) {
		str = xpathResult.numberValue.toString();
		nodeCount = 1;
	} else if (xpathResult.resultType === XPathResult.STRING_TYPE) {
		str = xpathResult.stringValue;
		nodeCount = 1;
	} else if (xpathResult.resultType ===
				XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
		for (var node = xpathResult.iterateNext(); node;
			node = xpathResult.iterateNext()) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				toHighlight.push(node);
			}
			if (str) {
				str += '\n';
			}
			str += node.textContent;
			nodeCount++;
		}
		if (nodeCount === 0) {
			str = '[NULL]';
		}
	} else {
		// Since we pass XPathResult.ANY_TYPE to document.evaluate(), we should
		// never get back a result type not handled above.
		str = '[INTERNAL ERROR]';
		nodeCount = 0;
	}

	xpathhandler.highlight(toHighlight);
	return [str, nodeCount];
};

////////////////////////////////////////////////////////////
// xpathhandler.Bar class definition

xpathhandler.Bar = function() {
	this.boundHandleRequest_ = this.handleRequest_.bind(this);
	this.boundMouseMove_ = this.mouseMove_.bind(this);
	this.boundMouseCtx_ = this.mousectx_.bind(this);
	this.boundKeyDown_ = this.keyDown_.bind(this);

	this.isActive = true;

	this.ecode = '';

	this.inDOM_ = false;
	this.currEl_ = null;

	this.query_ = '';

	this.barFrame_ = document.createElement('iframe');
	this.barFrame_.src = chrome.runtime.getURL('bar.html');
	this.barFrame_.id = 'xh-bar';
	
	document.addEventListener('keydown', this.boundKeyDown_);
	document.addEventListener('mousemove', this.boundMouseMove_);
	document.addEventListener('contextmenu', this.boundMouseCtx_);
	chrome.runtime.onMessage.addListener(this.boundHandleRequest_);
	this.showBar_();
};

xpathhandler.Bar.prototype.hidden_ = function() {
	return this.barFrame_.classList.contains('hidden');
};

xpathhandler.Bar.prototype.updateQueryAndBar_ = function(el) {
	this.ecode = '';

	try {
		this.query_ = xpathhandler.makeOptimizedForElement(el, true, false, true);
	}
	catch (ex) {
		this.ecode += '| ' + ex.name + ' : ' + ex.mesage + ' : ' + ex.stack;
	}
	this.updateBar_(true);
};

xpathhandler.Bar.prototype.updateBar_ = function(updateQuery) {
	var results = [this.ecode, 0];
	chrome.runtime.sendMessage({
		type: 'update',
		query: this.query_,
		results: results
	});
};

xpathhandler.Bar.prototype.showBar_ = function() {
	var that = this.barFrame_;
	function impl() {
		that.classList.remove('nohidden');
		that.updateBar_(true);
	}
	if (!this.inDOM_) {
		this.inDOM_ = true;
		document.body.appendChild(this.barFrame_);
	}
	window.setTimeout(impl, 0);
};

xpathhandler.Bar.prototype.nohideBar_ = function() {
	var that = this.barFrame_;
	function impl() {
		that.classList.add('nohidden');
		xpathhandler.clearHighlights();
	}
	window.setTimeout(impl, 0);
};

xpathhandler.Bar.prototype.toggleBar_ = function() {
};

xpathhandler.Bar.prototype.handleRequest_ = function(request, sender, cb) {
	if (request.type === 'evaluate') {
		xpathhandler.clearHighlights();
		this.query_ = request.query;
		this.updateBar_(false);
	} else if (request.type === 'moveBar') {
		// Move iframe to a different part of the screen.
		this.barFrame_.classList.toggle('bottom');
	} else if (request.type === 'showBar') {
		this.showBar_();
	} else if (request.type === 'nohideBar') {
		this.nohideBar_();
	} else if (request.type === 'xxtoggleBar') {
		this.toggleBar_();
	}
};

xpathhandler.Bar.prototype.mouseMove_ = function(e) {
	if (this.currEl_ === e.toElement) {
		return;
	}
	this.currEl_ = e.toElement;
	this.updateQueryAndBar_(this.currEl_);
};

xpathhandler.Bar.prototype.mousectx_ = function(e) {
	chrome.runtime.sendMessage({
		type: 'mousectx'
	});
};

xpathhandler.Bar.prototype.keyDown_ = function(e) {
};

////////////////////////////////////////////////////////////
// Initialization code

if (location.href.indexOf('acid3.xpath.acidtests.org') === -1) {
	window.xhBarInstance = new xpathhandler.Bar();
}
