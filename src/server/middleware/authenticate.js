import basicAuth from 'basic-auth'
import fs from 'fs'
import settings from '../../shared/settings'

// Babel is trying to evaluate all the settings?
const getSetting = (key) => {
    return settings[key]
}


function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
}

export default function middleware(req, res, next) {
    const {username, password} = getSetting('userOptions')
    const user = basicAuth(req)
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    if(user.name === username && user.pass === password) {
        return next()
    }
    return unauthorized(res);
}
