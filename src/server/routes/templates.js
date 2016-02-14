import db from '../database'

export default function publish(req, res) {
    db.run('INSERT INTO templates (name, text) VALUES (?, ?)', [
            req.body.name,
            req.body.text
        ],
        (err) => res.end(err || 'template saved.')
    )
}