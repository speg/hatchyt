// (function(){
import Editor from './code/editor'
import {thirdPartyScripts, thirdPartyStyles} from "../../shared/utilities";

const defaultStyles = [
    { id: 1, name: 'Normalize', uri: '//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css'},
    { id: 2, name: 'PureCSS', uri: '//yui.yahooapis.com/pure/0.6.0/pure-min.css'},
    { id: 0, name: 'Bootstrap', uri: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'},
    { id: 3, name: 'Foundation', uri: '//cdnjs.cloudflare.com/ajax/libs/foundation/6.0.1/css/foundation.min.css'},
    { id: 4, name: '960', uri: '//cdnjs.cloudflare.com/ajax/libs/960gs/0/960.min.css'},
    { id: 5, name: 'Bootstrap 4', uri: '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css'},
    { id: 5, name: 'Milligram', uri: '//cdnjs.cloudflare.com/ajax/libs/milligram/1.1.0/milligram.min.css'},
]

const defaultScripts = [
    { id: 0, name: 'jQuery', uri: '//code.jquery.com/jquery-2.2.0.min.js'},
    { id: 1, name: 'React', dependencies: [4], uri: '//cdnjs.cloudflare.com/ajax/libs/react/0.14.3/react.min.js'},
    { id: 2, name: 'Bootstrap', dependencies: [0], uri: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'},
    { id: 3, name: 'Google Analytics', input: 'Enter your GA ID:', dependencies: []},
    { id: 4, name: 'React DOM', dependencies: [1], uri: '//cdnjs.cloudflare.com/ajax/libs/react/0.14.3/react-dom.min.js'},
    { id: 5, name: 'Underscore', dependencies: [], uri: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'},
    { id: 6, name: 'Foundation', dependencies: [0], uri: '//cdnjs.cloudflare.com/ajax/libs/foundation/6.0.1/js/foundation.min.js'},
    { id: 6, name: 'Bootstrap 4', dependencies: [0], uri: '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js'},
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

function textFromTemplates(editor) {
    const templates = JSON.parse(editor.templates).filter(x=>x.checked)
    return templates.map(x=>x.text).join('')
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
    styles += '<style type="text/css">' + textFromTemplates(cssEditor) + cssEditor.mirror.getValue() + '</style>'

    frame.open()
    frame.write(head + styles + '</head>' + body + script + '</script></body></html>')
    frame.close()

    unsavedChanges = true;
}

function mergeOptions(custom, key, original) {   
    // merges the users custom selections with the originals
    if (!custom || !custom[key]) return original
    return original.map(o => {return custom[key].find(c => c.id === o.id) || o}).concat(custom[key].filter(x => x.custom))
}

var title = document.getElementById('title');

var scriptEditor = new Editor(document.getElementById('javascript'), {
    id: 'scripts',
    mode: 'javascript',
    value: site.script || '',
    title: 'JavaScript Library',
    extraKeys: {'Cmd-Enter': update},
    configMenu: mergeOptions(site.config, 'extraScripts', defaultScripts)
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
    templates: mergeOptions(site.config, 'cssTemplates', defaultTemplates),
    configMenu: mergeOptions(site.config, 'extraCSS', defaultStyles)
});

if (console.debug) console.debug('Site debug loaded:', site)


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
        extraScripts: JSON.parse(scriptEditor.settings).filter(x => x.checked),
        extraCSS: JSON.parse(cssEditor.settings).filter(x => x.checked),
        cssTemplates: JSON.parse(cssEditor.templates).filter(x => x.checked)
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
