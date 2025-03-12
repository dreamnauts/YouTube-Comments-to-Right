//console.log('content.js loaded...');

document.addEventListener('yt-navigate-finish', (event) => {
    //console.log('YouTube navigate finished');
    move(2000);
});

browser.runtime.onMessage.addListener((request) => {
    //console.log('message received: ', request);
    
    if (request.action == 'move') {
        move(request.interval);
    }
    
    return Promise.resolve({complete: true});
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
        
        var contents = comments.querySelector('#contents');
        contents.style.height = window.innerHeight - 230 + 'px';
        contents.style.overflowY = 'auto';
    }, interval);
    
    //console.log('comments moved to the right');
}
