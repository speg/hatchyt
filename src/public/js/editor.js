// (function(){
import Editor from './code/editor'
import {thirdPartyScripts, thirdPartyStyles} from "../../shared/utilities";

const defaultStyles = [
    { id: 0, name: 'Bootstrap', checked: false, uri: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'},
    { id: 1, name: 'Normalize', checked: false, uri: '//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css'},
]

const defaultScripts = [
    { id: 0, name: 'jQuery', checked: false, uri: '//code.jquery.com/jquery-1.11.3.min.js'},
    { id: 1, name: 'React', checked: false, dependencies: []},
    { id: 2, name: 'Bootstrap', checked: false, dependencies: [0]},
    { id: 3, name: 'Google Analytics', input: 'Enter your GA ID:', checked: false, dependencies: []},
]

site.config = JSON.parse(site.config)

var unsavedChanges;
var frame = document.getElementById('frame').contentWindow.document;

function confirmDelete(e) {
    if (!window.confirm('Are you sure you want to delete this site? This will delete all tracking and signup information as well!')) {
        return false;
    } else {
        window.location = 'delete';
    }
}

function update(e) {
    var head = '<!doctype html><head>';
    var styles = '<style type="text/css">body{background-color:white;}form._h-sign input[name="name"]{display: none;}</style>'
    var script = '<script type="text/javascript">';
    var body = '<body>'

    body += htmlEditor.mirror.getValue()
    script += scriptEditor.mirror.getValue();
    
    body += thirdPartyScripts(scriptEditor.settings)
    styles += thirdPartyStyles(cssEditor.settings)


    styles += '<style type="text/css">' + cssEditor.mirror.getValue() + '</style>'

    frame.open()
    frame.write(head + styles + '</head>' + body + script + '</script></body></html>')
    frame.close()

    unsavedChanges = true;
}


var title = document.getElementById('title');


var scriptEditor = new Editor(document.getElementById('javascript'), {
    id: 'scripts',
    mode: 'javascript',
    value: site.script || '',
    title: 'JavaScript Library',
    extraKeys: {'Cmd-Enter': update},
    configMenu: (site.config && site.config.extraScripts) || defaultScripts
});

var htmlEditor = new Editor(document.getElementById('markup'), {
    // id: 'markup',
    mode: 'xml',
    htmlMode: true,
    value: site.markup || ''
});

var cssEditor = new Editor(document.getElementById('style'), {
    id: 'styles',
    mode: 'css',
    title: 'CSS Library',
    value: site.style || '',
    extraKeys: {'Cmd-Enter': update},
    lineWrapping: true,
    configMenu: (site.config && site.config.extraCSS) || defaultStyles
});

if (console.debug) {
    console.debug('Global site available', site)
} else {
    site = null;
}
cssEditor.mirror.setSize('100%', 500 - 18);

function publish(evnt) {
    const targetElement = event.target
    const form = new FormData()
    targetElement.classList.add('loading')

    form.append('markup', htmlEditor.mirror.getValue())
    form.append('stylesheet', cssEditor.mirror.getValue())
    form.append('script', scriptEditor.mirror.getValue())
    form.append('title', title.value)
    form.append('id', document.getElementById('site-id').value)
    form.append('domain', document.getElementById('site-domain').value)

    // build the configuration settings
    let config = {
        extraScripts: JSON.parse(scriptEditor.settings),
        extraCSS: JSON.parse(cssEditor.settings)
    }
    form.append('config', JSON.stringify(config))

    // send them to the server
    var request = new XMLHttpRequest()
    let now = new Date()
    request.open('post', '/publish/')
    request.send(form)
    request.onreadystatechange = restore
    unsavedChanges = false

    function restore() {
        const text = request.responseText
        const later = new Date()
        if (later - now < 3000) {
            setTimeout(function(){
                targetElement.classList.remove('loading')
            }, 500)
        } else {
            console.log('!')
            targetElement.classList.remove('loading')
        }
    }     
}

function fullscreen() {
    var elem = document.getElementById("frame");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
}

var checkChanges = function checkChanges(e) {
    let result = unsavedChanges ? 'You have unsaved changes. Are you sure you want to exit?' : null;
    if (result) {
        e.returnValue = result;
        return result;
    }
}


document.getElementById('delete').setAttribute('href', 'javascript:(' + confirmDelete.toString() + '())');

scriptEditor.mirror.on('blur', update);
cssEditor.mirror.on('blur', update);
htmlEditor.mirror.on('blur', update);
htmlEditor.mirror.on('keyup', update);

htmlEditor.addButton({
    text: 'Insert Signup Form',
    callback: function (e) {
        this.mirror.replaceSelection('\n<form class="_h-sign" data-_h-success="">\n\t<input name="email" placeholder="email@example.com" type="text" /><input name="name" type="text" />\n\t<input type="submit" value="Submit" />\n</form>\n')
        update()
    }
})


window.addEventListener('beforeunload', checkChanges);
update();

window.publish = publish; //make this global for inline
unsavedChanges = false;

// }());
