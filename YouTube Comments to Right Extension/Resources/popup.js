console.log('popup.js loaded...');

window.addEventListener('load', (event) => {
    //console.log('popup window loaded...');
    
    const message = {
        type: 'background.js',
        options: {
            action: 'read',
            key: 'auto',
            value: null
        }
    }
    
    //Send message to background.js
    browser.runtime.sendMessage(message).then((response) => {
        //console.log('response received from background.js', response);
        
        const checkBox = document.getElementById('auto');
        checkBox.checked = (response.value == 'false') ? false : true;
    });
});

document.getElementById('move').addEventListener('click', (event) => {
    move(0);
});

document.getElementById('revert').addEventListener('click', (event) => {
    revert();
});

document.getElementById('auto').addEventListener('change', (event) => {
    console.log('checkbox value changed', event.target.checked);
    
    const message = {
        type: 'background.js',
        options: {
            action: 'write',
            key: 'auto',
            value: event.target.checked
        }
    }
    
    //Send message to background.js
    browser.runtime.sendMessage(message).then((response) => {
        //console.log('response received from background.js', response);
    });
});

browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const isVideoPage = /.+www.youtube.com\/watch\?.+/.test(tabs[0].url);
    
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
        //console.log('response for move received from background.js');
    });
}

function revert() {
    console.log('revert function executed');
    const message = {
        type: 'content.js',
        options: {
            action: 'revert'
        }
    }
    
    //Send message to background.js
    browser.runtime.sendMessage(message).then((response) => {
        //console.log('response for revert received from background.js');
    });
}
