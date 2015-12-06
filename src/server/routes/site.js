import db from '../database'
import auth from '../middleware/authenticate'

import express from 'express'
import {parseRoot} from './publish'
import fs from 'fs'
import path from 'path'

const siteRouter = express.Router()

siteRouter.use(auth)

function editSite(req, res) {
    db.get('SELECT id, domain, title, script, markup, style, config FROM sites WHERE id = ?', [req.params.site], function(err, row){
        if(err) console.log(err)
        res.render('editor', {site: row})
    })    
}

function deleteSite(req, res) {
    res.redirect('/');
    db.get('SELECT domain from sites WHERE id = ?', [req.params.site], function(err, row){
        db.exec(`
            DELETE from sites WHERE domain='${row.domain}';
            DELETE from tracking WHERE domain='${row.domain}';
            DELETE from signups WHERE domain='${row.domain}';
        `)
    }
)}

function createSite(req, res) {
    const domain = parseRoot(req.body.domain)
    fs.stat(`output/${domain}`, (err, stats) => {
        if (err) {
            fs.mkdir(`.hatchyt/output/${domain}`, function(e) {
                if(!e)fs.symlink(`${domain}`, `.hatchyt/output/www.${domain}`, (e)=>{if(e) throw new Error('Could not create symlink')})
            })
        }
    })
    db.run('INSERT INTO sites (domain, title) VALUES (?, ?)', [domain.domain, domain.domain], function(e){
        console.log(e ? e : `Inserted site:${this.lastID}`)
        res.redirect(`/site/${this.lastID}/`)
    })
}

function trackSite(req, res) {
    res.cookie('tracked', 'true', {maxAge: '86400000'})
    res.send()
    if (/preview$/.test(req.headers.referer)) return null
    db.run('INSERT INTO tracking (domain, referer, ip_address) VALUES (?, ?, ?)', [req.hostname, req.query.ref, req.ip], function(e){})
}

function signupSite(req, res) {
    res.send()
    if(req.body.name) return
    let domain = req.hostname
    let email = req.body.email
    let misc = JSON.stringify(req.body)
    db.run('INSERT INTO signups (domain, email, misc) VALUES (?, ?, ?)', [domain, email, misc], function(e){})
}

// Wire up the site routes
siteRouter.post('/new', createSite)
siteRouter.get('/:site/', editSite)
siteRouter.get('/:site/delete/', deleteSite)
siteRouter.get('/test/:site/', function(req, res) {
    const domain = req.params.site
    res.sendFile('index.html', {root: path.join(process.cwd(), '.hatchyt', 'output', domain)}, function(e){
        if (e) {
            res.status(404).send('Not found.')
        }
    })  // TODO: fetch root path from settings, someday
})

export default {
    signupSite,
    trackSite,
    routes: siteRouter
}