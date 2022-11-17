const objectDataFunctions = require('../ObjectData');
const ACCOUNTS_FILE = "src/services/accounts/accounts.json";
const accounts = objectDataFunctions.getObjectData(ACCOUNTS_FILE);
const objectUtils = require('../../util/ObjectUtil');
const { v4: uuidv4 } = require('uuid');

function getAllAccounts() {
    return accounts;
}

function getAccountByDocument(document) {
    return accounts.find( x => x.document == document );
}

function saveAccount(accountObj) {
    objectDataFunctions.addData(ACCOUNTS_FILE, accountObj);
}

function createNewAccount(req, res) {
    const { name, document } = req.body;

    if( objectUtils.isNullOrUndefinedAnyElement( name, document ) ) {
        return res.status( 400 ).json( {
            success: false,
            message: 'Name and document must be informed!'
        } ).send();
    }

    const validateDocument = getAccountByDocument(document);

    if( validateDocument ) {
        return res.status( 400 ).json( {
            success: false,
            message: 'Document already used!'
        } ).send();
    }

    var createdAccountStatement = {
        balance: 0.00,
        transactionValue: 0.00,
        action: 'ACCOUNT_CREATION',
        description: "Default register for account creation",
        date: new Date(),
        origin: 'SYSTEM',
        originId: null
    };
    
    saveAccount({
        id: uuidv4(),
        name,
        document,
        statement: [createdAccountStatement]
    });

    return res.status( 201 ).json( {
        success: true,
        message: 'Account created!'
    } ).send();
}

module.exports = {
    getAllAccounts,
    getAccountByDocument,
    createNewAccount
}