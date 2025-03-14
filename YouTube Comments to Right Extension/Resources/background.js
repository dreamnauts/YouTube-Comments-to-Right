console.log('background.js loaded...');

var lastVideoId = '';
var auto;

//Load config from storage
auto = window.localStorage.getItem('auto');
auto = (auto == 'false') ? false : true;
window.localStorage.setItem('auto', auto);

//Event listener for message receive
browser.runtime.onMessage.addListener((request) => {
    console.log('message received: ', request);
    
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
    
    if (request.type === 'background.js') {
        //Process within background.js
        const action = request.options.action;
        const key = request.options.key;
        const value = request.options.value;
        
        if (action == 'read') {
            const value = window.localStorage.getItem(key);
            console.log('read', key, value);
            return Promise.resolve({value: value});
        }
        
        if (action == 'write') {
            window.localStorage.setItem(key, value);
            console.log('write', key, value);
            return Promise.resolve({complete: true});
        }
    }
});

//Event listener for tab update
browser.tabs.onUpdated.addListener((tabId, change, tab) => {
    var isVideoPage = /.+www.youtube.com\/watch\?.+/.test(tab.url);
    
    if (isVideoPage) {
        var videoId = tab.url.match(/v=([^&]+)/)[1];
        
        if (videoId != lastVideoId) {
            //console.log('new video page opened ...');
            lastVideoId = videoId;
            
            //Sometimes Safari won't inject content.js... reload tab when that happened
            browser.tabs.sendMessage(tab.id, {test: true}).then((response) => {
                if (!response) {
                    //console.log('no response from content.js... reloading tab');
                    browser.tabs.reload(tab.id);
                }
            });
        }
    }
});
