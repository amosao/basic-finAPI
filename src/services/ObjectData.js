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

function updateData(filePath, obj, index) {
    var data = getObjectData(filePath);
    data[index] = obj;

    fs.writeFileSync(filePath, JSON.stringify(data), DEFAULT_ENCONDING);
}

function updateAll( filePath, obj ) {
    fs.writeFileSync(filePath, JSON.stringify(obj), DEFAULT_ENCONDING);
}

module.exports = {
    getObjectData,
    addData,
    updateAll,
    updateData
}