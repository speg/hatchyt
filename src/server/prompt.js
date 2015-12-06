import prompt from 'prompt'
import fs from 'fs'
import settings from '../shared/settings'
import nginxConfig from './templates/nginxconf'
import path from 'path'

const schema = {
    properties: {
        domain: {
            description: "Enter a subdomain for the admin page",
            default: 'admin'
        },
        username: {
            description: "Enter a username",
            message: "Enter a username"
        },
        password: {
            description: "Enter your password",
            hidden: true
        }
    }
}

prompt.message = 'Hatchyt'


export default function prompter(fn) {
    console.log('Welcome to Hatchyt!')
    console.log('We have a few things to set up..')
    prompt.start()
    prompt.get(schema, (err, input)=>{
        if (err) throw err
        settings.userOptions = input
        fs.writeFile('.hatchyt/settings.json', JSON.stringify(input))
        const root = process.cwd()
        const admin = input.domain
        const pathToNginxConfig = path.join(root, '.hatchyt', 'hatchyt.conf')
        fs.writeFile(pathToNginxConfig, nginxConfig({root, admin}))
        console.log(`Hatchyt: Created nginx config file to: ${pathToNginxConfig}`)
        console.log('Hatchyt: Create a symlink in your sites-enabled folder:')
        console.log(`Hatchyt: sudo ln -s ${pathToNginxConfig} /etc/ngninx/sites-enabled/`)
        console.log(`Hatchyt: and then restart nginx.`)
        fn && fn()
    })
}
