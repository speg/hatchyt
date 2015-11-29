function track(e) {
    window.removeEventListener('mouseover', track);
    document.body.removeEventListener('touchstart', track);
    var request = new XMLHttpRequest();
    request.open('post', '/track/?ref=' + encodeURIComponent(document.referrer));
    request.send();
    track=null;
}
if(!/tracked=true/.test(document.cookie)){
    document.body.addEventListener('touchstart', track);
    window.addEventListener('mouseover', track);
}
function signForm(evnt) {
    evnt.preventDefault();
    var request = new XMLHttpRequest();
    request.open('post', this.action || '/sign/');
    request.send(new FormData(this));
    var successDiv = document.createElement('div');
    successDiv.classList.add('_h-success');
    successDiv.appendChild(document.createTextNode(this.getAttribute('data-_h-success') || 'Thank you!'));
    this.parentNode.replaceChild(successDiv, this);
    return false;
}
var forms = document.getElementsByClassName('_h-sign');
for(var i=0; i < forms.length; i++){
    forms[i].addEventListener('submit', signForm)
}
