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

// determine if requirements are set up (database, directories)
let ready = requirements()
let storage = multer()
let app = express()

app.use(versionView)    // insert version into each view context
app.use(storage.array()) // use multer to handle response body
app.use(body.urlencoded({extended: false})) // use body.urlencode to hande urlecndoed posts

app.set('trust proxy', true) // client’s IP address is understood as the left-most entry in the X-Forwarded-* header
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, '..', 'views'))

app.use('/site', site.routes)   //  internal views
app.use('/', hatch)             //  externam views

// Sentry error logging
if (process.env.HATCHYT_ENV != 'dev') {
    app.use(raven.middleware.express.requestHandler(settings.SENTRY));
    app.use(raven.middleware.express.errorHandler(settings.SENTRY));
}

// Static directories
app.use(express.static(path.join(__dirname, 'public'))) // public javascript and css
app.use(express.static('output'))   // ??
app.use(express.static(path.join(__dirname, '..', 'libs'))) // third-party assets

app.use(onError)

if (process.argv.indexOf('--initial') > -1) {
    prompt()
} else {
    !ready ? prompt(main) : main() // Kickoff!
}

function main() {
    app.listen(80).on('error', e => {
        app.listen(settings.PORT)
        console.log(`Hatchyt is running on port ${settings.PORT}!`)
    })
}

// The error id is attached to `res.sentry` to be returned
// and optionally displayed to the user for support.
function onError(err, req, res, next) {
    const msg = process.env.HATCHYT_ENV === 'dev' ? err.toString() : res.sentry
    res.statusCode = 500;
    res.end("Oops!\n" + msg);
}

// expose version to the views
function versionView(req, res, next){
    res.locals.version = packageJSON.version
    next()
}