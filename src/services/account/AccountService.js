const objectDataFunctions = require('../ObjectData');
const ACCOUNTS_FILE = "src/services/account/accounts.json";
const accounts = objectDataFunctions.getObjectData(ACCOUNTS_FILE);
const objectUtils = require('../../util/ObjectUtil');
const { v4: uuidv4 } = require('uuid');

function getAllAccounts() {
    return accounts;
}

function getAccountPos(id) {
    allAccounts = getAllAccounts();
    const pos = accounts.findIndex( x => {
        return x.id === id;
    });

    return pos;
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
        originId: null,
        active: true
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

function getAccountBalance( account ) {  
    let lastStatement = account.statement.at(-1);
    return lastStatement.balance + lastStatement.transactionValue;
}

function pushTransaction( statement, account ) {
    accounts.filter( x => x.id == account.id )[0].statement.push( statement );
}

function getStatementByPeriod(req, res) {
    const { loggedAccount } = req;
    const { from, until } = req.query;
    filteredStatements = loggedAccount.statement;
    const fromDate = new Date(from);
    const untilDate = new Date(until);

    if( !objectUtils.isNullOrUndefined(from) && !objectUtils.isNullOrUndefined(until) ) {
        filteredStatements = filteredStatements.filter(x => {
            const statementDate = new Date(x.date);
            return statementDate.getTime() <= untilDate.getTime() && statementDate.getTime() >= fromDate.getTime();
        });
    }

    if( !objectUtils.isNullOrUndefined(from) && objectUtils.isNullOrUndefined(until) ) {
        filteredStatements = filteredStatements.filter(x => {
            const statementDate = new Date(x.date);
            return statementDate.getTime() >= fromDate.getTime()
        });
    }

    if( !objectUtils.isNullOrUndefined(until) && objectUtils.isNullOrUndefined(from) ) {
        filteredStatements = filteredStatements.filter(x => {
            const statementDate = new Date(x.date);
            return statementDate.getTime() <= untilDate.getTime();
        });
    }

    return res.status(200).json(
        {
            success: true,
            message: filteredStatements
        }
    )
}

function updateProfile(req, res) {
    const { loggedAccount } = req;
    const { data } = req.body;

    loggedAccount.name = data.name;

    loggedAccountPos = getAccountPos(loggedAccount.id);

    objectDataFunctions.updateData(ACCOUNTS_FILE, loggedAccount, loggedAccountPos);

    return res.status(200).json(
        {
            success: true,
            message: "Update sucessful"
        });
}

function getProfile(req, res) {
    const { loggedAccount } = req;

    delete loggedAccount.statement;

    return res.status(200).json(
        {
            success: true,
            message: loggedAccount
        });
}

function disableAccount(req, res) {
    const { loggedAccount } = req;
    loggedAccount.active = false;

    loggedAccountPos = getAccountPos(loggedAccount.id);

    objectDataFunctions.updateData(ACCOUNTS_FILE, loggedAccount, loggedAccountPos);

    return res.status(200).json(
        {
            success: true,
            message: "Account disabled"
        });
}

module.exports = {
    getAllAccounts,
    getAccountByDocument,
    createNewAccount,
    getAccountBalance,
    pushTransaction,
    getStatementByPeriod,
    updateProfile,
    getProfile,
    disableAccount
}