
// extras the third party scripts from the settings
// returns a string of script tags
export function thirdPartyScripts(config) {
    
    let parsed = JSON.parse(config) || []

    if (!config) {
        return ''
    }
    return parsed.filter(s => s.checked).map(s => `<script type="text/javascript" src="${s.custom ?  s.name : s.uri}"></script>`).join('')
}


export function thirdPartyStyles(config) {
    let parsed = JSON.parse(config) || []

    if (!config) {
        return ''
    }
    return parsed.filter(s => s.checked).map(s => `<link rel="stylesheet" type="text/css" href="${s.custom ? s.name : s.uri}">`).join('')
}