chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({'index':0,'url': 'https://www.linkedin.com/search/results/index/?keywords=&origin=GLOBAL_SEARCH_HEADER','active': true}, function(tab) {	
	});
});
