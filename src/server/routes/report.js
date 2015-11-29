import db from '../database'

const query = `
SELECT strftime('%d', datetime) day, domain, count(*) as count
FROM tracking
WHERE datetime > datetime('now', '-30 days')
GROUP BY day, domain
ORDER BY day
`

const ip_query = `
SELECT ip_address, count(*) as count
FROM tracking
WHERE datetime > datetime('now', '-30 days')
GROUP BY ip_address
ORDER BY count(*) DESC
LIMIT 3
`

const referer_query = `
SELECT referer, count(*) as count
FROM tracking
WHERE datetime > datetime('now', '-30 days')
GROUP BY ip_address
ORDER BY count(*) DESC
LIMIT 3
`

export default function(req, res) {
    db.serialize(function() {
        let tracks = null
        let referers = null
        db.all(query, function(err, rows) {
            if (!err) tracks = rows
        })
        .all(referer_query, function(err, rows){
            if (!err) referers = rows
        })
        .all(ip_query, function(err, rows) {
            res.render('report', {
                isReports: true,
                ips: rows,
                referers,
                tracks
            })
        })
    })
}
