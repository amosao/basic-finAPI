const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { isNullOrUndefinedAnyElement, isNullOrUndefined } = require('./util/ObjectUtil');

const accounts = [];

const app = express();
app.use( express.json() );

app.listen( 8080 );

app.post( "/account", ( req, res ) => {
    const { name, document } = req.body;
    const id = uuidv4();

    if( isNullOrUndefinedAnyElement( name, document ) ) {
        return res.status( 400 ).json( { success: false, message: 'Name and document must be informed!' } ).send();
    }

    const validateDocument = accounts.some( x => x.document == document );

    if( validateDocument ) {
        return res.status( 400 ).json( { success: false, message: 'Document already used!' } ).send();
    }

    var createdAccountStatement = { balance: 0.00, transactionValue: 0.00, action: 'ACCOUNT_CREATION', date: Date.now(), origin: 'SYSTEM', originId: null };

    accounts.push( { id, name, document, statement: [createdAccountStatement] } );

    return res.status( 201 ).json( { success: true, message: 'Account created!' } ).send();
});

app.use( loggedAccount );

app.get( '/account/statement', ( req, res ) => {

    const { loggedAccount } = req;

    return res.status( 200 ).json( { success: true, message: loggedAccount.statement } ).send();

});

app.post( '/action/deposit', (req, res) => {
    const { loggedAccount } = req;
    const { transaction } = req.body;

    const lastStatement = loggedAccount.statement.at(-1);
    const momentBalance = lastStatement.balance + lastStatement.transactionValue;

    if( Math.sign( transaction.value ) == -1 ) {
        return res.status( 400 ).json( { success: false, message: 'This is a deposit action, the transaction value is expected to be positive.' } ).send();
    }

    var deposit = { balance: momentBalance, transactionValue: transaction.value, action: `USER_DEPOSIT`, date: Date.now(), origin: `USER_ACTION`, originId: loggedAccount.id };
    
    accounts.filter( x => x.id == loggedAccount.id )[0].statement.push( deposit );

    return res.status( 200 ).json( { success: true, message: `Transference done with success.` } ).send();
});

//FUNCTIONS
function accountExistsByDocument( document ) {
    return accounts.find( x => x.document == document );
}

//MIDDLEWARE
function loggedAccount( req, res, next ) {
    const { document } = req.headers;

    const account = accountExistsByDocument( document );

    if( isNullOrUndefined( account ) ) {
        return res.status( 400 ).json( { success: false, message: 'Unable to find account.' } ).send();
    }

    req.loggedAccount = account;

    return next();
}

// transactions model
// balance
// transactionValue (default 0)
// action
// date
// origin
// originId? (if origin == 'SYSTEM' : null ? value)
