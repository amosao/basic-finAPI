function isNullOrUndefined(value) {

    if (value == null) {
        return true;
    }

    if (value == undefined) {
        return true;
    }

    if (value === "") {
        return true;
    }

    return false;
}

function isNullOrUndefinedAnyElement( ...args ) {

    let allFalse = false;

    args.forEach(x => {
        let result = isNullOrUndefined(x);

        if (result) {
            allFalse = true;
        }
    });

    return allFalse;
}

module.exports = { isNullOrUndefined, isNullOrUndefinedAnyElement };