(function(){
    const form = document.getElementById('new-site')
    const input = form.elements[0]
    form.addEventListener('submit', function(evt){
        if(!input.value) {
            evt.preventDefault()
            input.focus()
            return false
        }
        return true
    })
}())