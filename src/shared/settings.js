let SETTINGS = {}

SETTINGS.userConfigured = false
SETTINGS.PORT = 3000

SETTINGS.SENTRY = 'https://7a564535165e461a8971e00595dab6d6:1fa20f4a00974db29f3ec082882ea462@app.getsentry.com/57563'

SETTINGS.get = function(key) {
    return SETTINGS[key]
}

SETTINGS.set = function(key, value) {
    SETTINGS[key] = value
}


export default SETTINGS