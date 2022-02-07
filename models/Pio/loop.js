const fs = require("fs")
const path = require('path')

function rename(dir) {
    fs.readdir(dir, (e, files) => {
        for (let i = 0; i < files.length; i++) {
            console.log('["textures/'+path.basename(files[i])+'"],')
        }
    })
}
rename(path.resolve(__dirname, 'textures'))