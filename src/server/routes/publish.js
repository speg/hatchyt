import fs from 'fs'
import stylus from 'stylus'
import ugly from  'uglify-js'
import db from '../database'
import {thirdPartyScripts, thirdPartyStyles} from "../../shared/utilities";
import path from 'path'

const templatesPath = path.join(__dirname, '..', 'templates')

const bundledScript = fs.readFileSync(path.join(templatesPath, 'bundledScript.js'), {encoding: 'utf-8'})

function saveSite(req) {
    return function(err) {
        if (err) console.log(err)
        db.run('UPDATE sites SET markup = ?, script = ?, style = ?, title = ?, config = ? WHERE id = ?',
            [req.body.markup, req.body.script, req.body.stylesheet, req.body.title, req.body.config, req.body.id])
    }
}

export default function publish(req, res) {
    res.end('published.')
    const settings = JSON.parse(req.body.config)
    const title = req.body.title || ''
    const stylesheets = thirdPartyStyles(JSON.stringify(settings.extraCSS))
    const html = req.body.markup
    const scripts = thirdPartyScripts(JSON.stringify(settings.extraScripts))

    // add style templates (only checked tempaltes are saved, so no need to filter)
    // TODO: lookup templates from DB so we can get changes, pre-req: edit templates
    const styleTemplates = settings.cssTemplates.map(x=>x.text).join('')
    const scriptTemplates = settings.scriptTemplates.map(x=>x.text).join('\n')
    const js = ugly.minify('(function(){' + bundledScript + '\n' + scriptTemplates + '\n' + req.body.script + '\n}())', {fromString: true}).code
    stylus.render(req.body.stylesheet, {filename: 'building.css', compress: true}, function(err, css){
        if (err) css = `/* Error building style: ${err.toString()} */`
        const output = renderHTML(title, styleTemplates + css, stylesheets, html, scripts, js).replace(/\n/g, '')
        const domain = parseRoot(req.body.domain)
        fs.writeFile(`.hatchyt/output/${domain}/index.html`, output, saveSite(req))     
    })
}

export function parseRoot(domain) {
    // check if domain is a root domain (naked, or www)
    domain = domain.toLowerCase()
    let ret = {}
    if (/^www\./.test(domain)) {
        ret.domain = domain.substring(4)
        ret.www = true
    } else if (2 === domain.split('.').length) {
        ret.domain = domain
        ret.naked = true
    }
    ret.toString = function () {
        return this.domain
    }
    return ret;
}

// builds the markup for the page
function renderHTML(title, css, stylesheets, html, scripts, js) {
    return `<!doctype html>
<html><head><title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" /><meta charset="utf-8" />
<style>${css}form._h-sign input[name="name"]{display: none;}</style>
${stylesheets}
</head>
<body>${html}${scripts}
<script type="text/javascript">${js}</script>
</body></html>`
}
