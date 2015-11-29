// TODO: also add Facebook/Twitter opengraph images.

// Stream a file to disk

export default function get(d='http://www.speg.com') {
    http.get(d, function(res) {
        var writey = fs.createWriteStream('out.txt')
        res.pipe(writey)
    })
}


