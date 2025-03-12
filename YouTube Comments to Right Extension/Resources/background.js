//console.log('background.js loaded...');

var lastVideoId = '';

browser.runtime.onMessage.addListener((request) => {
    //console.log('message received: ', request);
    
    if (request.type === 'content.js') {
        //Send message to content.js
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, request.options).then((response) => {
                if (!response) {
                    //console.log('no response from content.js... reloading tab');
                    browser.tabs.reload(tabs[0].id);
                } else {
                    return Promise.resolve(response);
                }
            });
        });
    }
});

browser.tabs.onUpdated.addListener((tabId, change, tab) => {
    var isVideoPage = /.+www.youtube.com\/watch\?.+/.test(tab.url);
    
    if (isVideoPage) {
        var videoId = tab.url.match(/v=([^&]+)/)[1];
        
        if (videoId != lastVideoId) {
            //console.log('new video page opened ...');
            lastVideoId = videoId;
            
            browser.tabs.sendMessage(tab.id, {test: true}).then((response) => {
                if (!response) {
                    //console.log('no response from content.js... reloading tab');
                    browser.tabs.reload(tab.id);
                }
            });
        }
    }
});
