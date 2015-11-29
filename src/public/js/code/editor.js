// wraps a code
//mirror editor with some UI

import ConfigMenu from '../components/configMenu'

export default class Editor {
    constructor(container, options) {
        this.options = options
        this._id = options.id
        this.toolbar = document.createElement('div')
        this.toolbar.classList.add('toolbar')
        container.appendChild(this.toolbar)
        this.mirror = CodeMirror(container, options)
        if (options.configMenu) {
            this.addButton({className: 'choices', id: options.id})
        }
    }

    addButton(options) {
        let button = document.createElement('div')
        const classes = options.className ? [options.className] : ['btn', 'small']
        button.classList.add(...classes)

        if (options.id) {
            ReactDOM.render(<ConfigMenu id={options.id} choices={this.options.configMenu} title={this.options.title || this.options.mode} />, button)    
        }

        if(options.callback) {
            button.addEventListener(options.on || 'click', options.callback.bind(this))
        }

        if (options.text) {
            let text = document.createTextNode(options.text)
            button.appendChild(text)
        }

        this.toolbar.appendChild(button)
    }

    get settings() {
        return document.getElementById(`config-menu-${this._id}`).value
    }
}