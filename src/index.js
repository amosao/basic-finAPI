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
        return res.status( 400 ).json( {
            success: false,
            message: 'Name and document must be informed!'
        } ).send();
    }

    const validateDocument = accounts.some( x => x.document == document );

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

    accounts.push( {
        id,
        name,
        document,
        statement: [createdAccountStatement]
    } );

    return res.status( 201 ).json( {
        success: true,
        message: 'Account created!'
    } ).send();

});

app.use( loggedAccount );

app.get( '/account/statement', ( req, res ) => {

    const { loggedAccount } = req;

    return res.status( 200 ).json( {
        success: true,
        message: loggedAccount.statement
    } ).send();

});

app.post( '/action/deposit', (req, res) => {
    const { loggedAccount } = req;
    const { transaction } = req.body;

    const balance = getAccountBalance( loggedAccount );

    if( Math.sign( transaction.value ) == -1 ) {
        return res.status( 400 ).json( {
            success: false,
            message: 'This is a deposit action, the transaction value is expected to be positive.'
        } ).send();
    }

    var deposit = { 
        balance: balance,
        transactionValue: transaction.value,
        action: `USER_DEPOSIT`,
        description: transaction.description,
        date: new Date(),
        origin: `USER_ACTION`,
        originId: loggedAccount.id
    };
    
    accounts.filter( x => x.id == loggedAccount.id )[0].statement.push( deposit );

    return res.status( 200 ).json( {
        success: true,
        message: `Transaction done with success.`
    } ).send();

});

app.post( '/action/withdraw', (req, res) => {
    const { loggedAccount } = req;
    const { transaction } = req.body;

    let validAction = canDoAction( transaction, loggedAccount );
    if ( !validAction.doable ) {
        return res.status( 400 ).json( {
            success: false,
            message: `Can not do transaction [${canDoAction.message}]`
        } ).send();
    }

    var withdraw = { 
        balance: getAccountBalance( loggedAccount ),
        transactionValue: -transaction.value,
        action: `USER_WITHDRAW`,
        description: transaction.description,
        date: new Date(),
        origin: `USER_ACTION`,
        originId: loggedAccount.id
    };

    pushTransaction( withdraw, loggedAccount );

    return res.status( 200 ).json( {
        success: true,
        message: `Transaction done with success.`
    } ).send();
});

//FUNCTIONS
function accountExistsByDocument( document ) {
    return accounts.find( x => x.document == document );
}

function getAccountBalance( account ) {
    let lastStatement = account.statement.at(-1);
    return lastStatement.balance + lastStatement.transactionValue;
}

function canDoAction( transaction, account ) {
    const balance = getAccountBalance( account );
    
    if ( balance + transaction.value < 0 ) {
        return { doable: false, message: `Not enough credit` };
    }

    return { doable: true };
}

function pushTransaction( statement, account ) {
    accounts.filter( x => x.id == account.id )[0].statement.push( statement );
}

//MIDDLEWARE
function loggedAccount( req, res, next ) {
    const { document } = req.headers;

    const account = accountExistsByDocument( document );

    if( isNullOrUndefined( account ) ) {
        return res.status( 400 ).json( {
            success: false,
            message: 'Unable to find account.'
        } ).send();
    }

    req.loggedAccount = account;

    return next();
}

// transactions model
// balance
// transactionValue (default 0)
// description
// action
// date
// origin
// originId? (if origin == 'SYSTEM' : null ? value)
