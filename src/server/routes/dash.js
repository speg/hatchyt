// A tracking module. Records the request in a database.
import db from '../database'
import fs from 'fs'

const query = `
SELECT sites.id, sites.domain, count(tracking.domain) as tracked, signers.signed as signed
FROM sites
LEFT JOIN tracking USING (domain)
LEFT JOIN (
    SELECT domain, count(*) as signed FROM signups
    GROUP BY domain
    ) as signers
USING (domain)
GROUP BY domain
ORDER BY sites.id;`

const SELF_HOSTING = process.env.SELF_HOST || false

export default function(req, res) {
    
    if(SELF_HOSTING) {
        serve(req, res)
    } else {
        db.all(query, function(err, rows){
            res.render('dash', {results: rows, isDash: true});
        })
    }
}

// serves a request from the filesystem
function serve(req, res) {
    console.log(req.hostname, __dirname)
    const filename = `${req.hostname}.html`
    try {
        fs.statSync(`output/${filename}`).isFile() && res.sendFile(filename, {root: 'output'})
    } catch(e) {
        res.status(404).end('Not found.')
    }
}


// get sites within latest month
// select domain, referer, datetime from tracking where datetime > datetime('now', '-1 months');