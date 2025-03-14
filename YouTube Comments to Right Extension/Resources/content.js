console.log('content.js loaded...');

document.addEventListener('yt-navigate-finish', (event) => {
    //console.log('YouTube navigate finished');
    
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
        const auto = (response.value == 'false') ? false : true;
        
        const message = {
            type: 'background.js',
            options: {
                action: 'read',
                key: 'force',
                value: null
            }
        }
        
        //Check if this move is forced or not
        browser.runtime.sendMessage(message).then((response) => {
            const force = (response.value == 'true') ? true : false;
            
            if (auto || force) move(800);
        });
    });
});

browser.runtime.onMessage.addListener((request) => {
    //console.log('message received: ', request);
    
    if (request.action == 'move') {
        move(request.interval);
        return Promise.resolve({complete: true});
    }
    
    if (request.action == 'revert') {
        revert();
        return Promise.resolve({complete: true});
    }
});

function move(interval = 0) {
    var comments = document.getElementById('comments');
    var related = document.getElementById('related');
    var parent = comments.parentNode;
    var next = comments.nextSibling === related ? comments : comments.nextSibling;
    
    setTimeout(() => {
        if (parent.id == 'below') {
            related.parentNode.insertBefore(comments, related);
            parent.insertBefore(related, next);
        }
        
        const contents = comments.querySelector('#contents');
        if (contents) {
            const rect = contents.getBoundingClientRect();
            contents.style.height = window.innerHeight - rect.top + 'px';
            contents.style.overflowY = 'auto';
        }
    }, interval);
}

function revert() {
    var comments = document.getElementById('comments');
    var related = document.getElementById('related');
    var parent = comments.parentNode;
    var next = comments.nextSibling === related ? comments : comments.nextSibling;
    
    if (parent.id == 'secondary-inner') {
        related.parentNode.insertBefore(comments, related);
        parent.insertBefore(related, next);
        
        const contents = comments.querySelector('#contents');
        if (contents) {
            contents.style.height = 'auto';
            contents.style.overflowY = 'visible';
        }
    }
}
