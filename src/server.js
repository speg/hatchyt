#! /usr/bin/env node

import express from 'express'
import multer from 'multer'
import body from 'body-parser'
import path from 'path'
import site from './server/routes/site'
import hatch from './server/routes/hatch'
import requirements from './server/requirements'
import settings from './shared/settings'
import raven from 'raven'
import prompt from './server/prompt'
import packageJSON from '../package.json'

let ready = requirements()

function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    const msg = process.env.DC_CONFIG === 'dev' ? err.toString() : res.sentry
    res.end("Oops!\n" + msg);
}

let app = express()
let storage = multer()


app.use(function(req, res, next){
    // expose version to the views
    res.locals.version = packageJSON.version
    next()
})
app.use(storage.array())
app.use(body.urlencoded({extended: false}))

app.set('trust proxy', true)
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, '..', 'views'))

app.use('/site', site.routes)
app.use('/', hatch)

if (process.env.DC_CONFIG != 'dev') {
    app.use(raven.middleware.express.requestHandler(settings.SENTRY));
    app.use(raven.middleware.express.errorHandler(settings.SENTRY));
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('output'))
app.use(express.static(path.join(__dirname, '..', 'libs')))

app.use(onError)


function main() {
    app.listen(80).on('error', e => {
        app.listen(settings.PORT)
        console.log(`Hatchyt is running on port ${settings.PORT}!`)
    })
}

if (process.argv.indexOf('--initial') > -1) {
    prompt()
} else {
    !ready ? prompt(main) : main() // Kickoff!
}
