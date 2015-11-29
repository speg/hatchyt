// does ajax-y things

// hatchIt(<querySelector>, options)

const defaultOptions = {
    event: 'click',
    waitingClass: 'loading'
}


export default function(query, options) {
    options = Object.assign(defaultOptions, options)
    let nodes = document.querySelectorAll(query)
    Array.from(nodes).forEach(element => {
        element.addEventListener(options.event, options.handler || ((e) => {
            e.preventDefault()
            const domNode = e.target
            domNode.classList.add(options.waitingClass)
            const uri = options.uri || domNode.getAttribute('href')
            fetch(uri, console.log)
            return false
        }))
    })
}