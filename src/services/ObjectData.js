const fs = require('fs');
const DEFAULT_ENCONDING = 'utf8'

function getObjectData(filePath) {
    return JSON.parse(fs.readFileSync(filePath, DEFAULT_ENCONDING));
}

function addData(filePath, obj) {
    var data = getObjectData(filePath);
    data.push(obj);

    fs.writeFileSync(filePath, JSON.stringify(data), DEFAULT_ENCONDING);
}

module.exports = {getObjectData, addData}