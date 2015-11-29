import db from '../database'

// sneak in an extra row (101st) to determine
// if there are "more"
const PAGE_SIZE = 100
const query = `
SELECT domain, email, datetime
FROM signups
ORDER BY datetime DESC
LIMIT ${PAGE_SIZE + 1}
OFFSET ?
`

const downloadQuery = `
SELECT domain, email, datetime
FROM signups
ORDER BY datetime DESC`

// parse the page from the query param
function getPage(req) {
    let input = req.query.page || 1
    input = parseInt(input, 10)
    if (isNaN(input)) {
        input = 1
    }
    return (input - 1) * PAGE_SIZE
}

function main(req, res) {
    const page = getPage(req)
    db.all(query, [page],   function(err, rows){
        const hasMore = rows.length > PAGE_SIZE
        if (hasMore) rows.pop()

        res.render('signups', {
            hasMore,
            page,
            isSignups: true,
            rows: err ? [{domain:"serveR_error", email: err.toString()}]: rows});
    })
}

function download(req, res) {
    db.all(downloadQuery, (err, rows) => {
        res.set({'Content-Disposition':`attachment; filename="download.csv"`});
        res.send(rows.map(row => {
            let fields = []
            for (let field in row) {
                fields.push(row[field])
            }
            return fields.join(', ')
        }).join('\n'))
    })

}

export default {
    main,
    download
}

