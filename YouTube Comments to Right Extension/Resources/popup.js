//console.log('popup.js loaded...');

document.getElementById('move').addEventListener('click', (event) => {
    move(0);
});

browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    var isVideoPage = /.+www.youtube.com\/watch\?.+/.test(tabs[0].url);
    
    if (isVideoPage) {
        document.getElementById('oops').style.display = 'block';
    } else {
        document.getElementById('oops').style.display = 'none';
    }
});

function move(interval = 0) {
    const message = {
        type: 'content.js',
        options: {
            action: 'move',
            interval: interval
        }
    }
    
    //Send message to background.js
    browser.runtime.sendMessage(message).then((response) => {
        console.log('');
    });
}
