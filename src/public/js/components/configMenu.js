

// Automatically bind all handlers to the component.
function autoBind(context, ...handlers) {
    if (handlers.length === 0) {
        const proto = Object.getPrototypeOf(context)
        handlers = Object.getOwnPropertyNames(proto).filter(x => x.startsWith('handle')).map(x => context[x])   // map all properties begining with handle to their function
    }
    handlers.forEach(h => context[h.name] = h.bind(context))
}

export default class configMenu extends React.Component {
    constructor(props) {
        super(props)
        autoBind(this)
        let loadedItems = props.choices || JSON.parse(localStorage.getItem('items') || [])
        this.state = {items: loadedItems, enabled: false}
    }

    render() {
        let tableRows = this.state.items.map((obj, index) => <CheckItem id={this.props.id + obj.id}
            deleteHandler={this.handleRemove.bind(this, index)}
            clickHandler={this.handleClick.bind(this, index)}
            key={index}
            isInline={obj.inline}
            isChecked={obj.checked}
            isCustom={obj.custom}
            text={obj.name} 
        />)

        return <div className={"thingList " + (this.state.enabled ? "" : "closed")}>
            <div className="config-menu btn small" onClick={this.handleToggle}><span className={"icon " + (this.state.enabled ? "icon-triangle-down" : "closed icon-triangle-right")}></span>{this.props.title}</div>
            <table className="someThings">
                <thead>
                <tr><th></th><th>Inline</th></tr>
                </thead>
                <tbody>
                {tableRows}
                <tr><td><input onKeyDown={this.handleCustom} type="text" placeholder="http://custom.uri" /></td></tr>
                </tbody>
            </table>
            <input id={"config-menu-"+this.props.id} name={this.props.id} type="hidden" value={JSON.stringify(this.state.items)} />
        </div>
    }

    handleRemove(id, evnt) {
        const confirmed = confirm('Are you sure you want to delelte this script?')
        if (confirmed) {
            let items = this.state.items;
            items.splice(id, 1)
            this.save({items})
        }
    }

    handleCustom(evnt) {
        if(evnt.keyCode !== 13) return true
        let items = this.state.items
        items.push({id: items.length, name: evnt.target.value, custom: true, checked: true})
        this.save({items})
        evnt.target.value = ''
    }

    handleToggle(evnt) {
        this.setState({enabled: !this.state.enabled})
    }

    handleClick(index, evnt){
        let items = this.state.items
        let item = items[index]
        if(evnt.target.classList.contains('inline')) {
            item.inline = !item.inline
            if(item.inline) {
                item.checked = true
            }
        } else {
            // toggle item selection
            item.checked = !item.checked

            // check for user-input
            if (item.input && item.checked) {
                item.value = prompt(item.input, item.value || "")
                if(!item.value) item.checked = false
            }

            if (item.dependencies && item.checked) {
                item.dependencies.forEach(x => items[x].checked = true)
            } else if (!item.checked) {
                item.inline = false
                // check all other items for dependcey
                items.forEach(x => {
                    if (x.dependencies && x.dependencies.indexOf(item.id) > -1) {
                        x.checked = false
                        x.inline = false
                    }
                })
            }            
        }
        this.save({items})
    }

    save(update) {
        this.setState(update)
        const stringifiedItems = JSON.stringify(this.state.items)
        localStorage.setItem('items', stringifiedItems)

    }
}

configMenu.defaultProps = {
    items: [],
    title: "A list of things!",
    enabled: false,
    inline: false
}

configMenu.propTypes = {
    'items': React.PropTypes.array,
    'enabled': React.PropTypes.bool.isRequired,
    'inline': React.PropTypes.bool.isRequired,
    'input': React.PropTypes.string,
    'value': React.PropTypes.string
}

class CheckItem extends React.Component {
    render () {
        const classes = classNames({
            checked: this.props.isChecked,
        })
        return <tr className={classes}>
            <td>
                <input type="checkbox" onChange={this.props.clickHandler} checked={this.props.isChecked} id={this.props.id} />
                <label htmlFor={this.props.id}>{this.props.text}</label>
            </td>
            <td className="text-center">
                <input type="checkbox" onChange={this.props.clickHandler} className="inline" id={'inline_' + this.props.id} checked={this.props.isInline} />
                <Trasher id={this.props.id} deleteHandler={this.props.deleteHandler} active={this.props.isCustom} />
            </td>
        </tr>
    }
}


class Trasher extends React.Component {
    render() {
        if (!this.props.active) return <div className="spacer" />

        return <span onClick={this.props.deleteHandler} className="icon-trashcan" />
    }
}