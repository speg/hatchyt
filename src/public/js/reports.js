var data = {
    series: null,
    labels: []
}

var options = {
    fullWidth: true,
    lineSmooth: false,
    width: '80%',
    height: '400px',
    axisX: {
        showGrid: false,
    },
    axisY: {
        onlyInteger: true,
        
    },
    showPoint: false,
    low: 0
}

console.table(_h.data)
console.table(_h.refs)
console.table(_h.ips)

// create an array of the past 30 days
var now = new Date()
data.labels.push(now.getUTCDate())
for(var i=0; i<29; i++){
    now.setDate(now.getDate() - 1)
    data.labels.push(now.getUTCDate());
}
data.labels.reverse()
// create series array []

let domainIndexes = {}  // a mapping of domains to their index in the series array
function builder(base, row) {
    // if the domain is not mapped yet, and its index to the mapping and create an empty array.
    const domain = row.domain.startsWith('www.') ? row.domain.substring(4) : row.domain
    if (undefined === domainIndexes[domain]) {
        domainIndexes[domain] = base.push(Array(30).fill(0)) - 1
    }
    const index = domainIndexes[domain]
    const day = data.labels.indexOf(parseInt(row.day, 10))
    base[index][day] += row.count
    return base
}

data.series = _h.data.reduce(builder, [])

const chart = new Chartist.Line('.ct-chart', data, options)

function colorTheLegend(){
    chart.off('created', colorTheLegend)
    const legend = document.querySelector('.chart-legend')
    const linePaths = document.querySelectorAll('.ct-line')
    Object.keys(domainIndexes).forEach((d, i) => {
        let label = document.createElement('label')
        label.style.color = getComputedStyle(linePaths[i]).stroke
        label.appendChild(document.createTextNode(d))
        legend.appendChild(label)
    })
}

chart.on('created', colorTheLegend)


