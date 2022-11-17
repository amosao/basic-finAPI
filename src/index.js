const express = require('express');
const accountServices = require('./services/accounts/AccountsService');
const { loggedAccount } = require('./middlewares/loggedAccount');

const app = express();
app.use( express.json() );

app.listen( 8080 );

//ACCOUNT CREATION
app.post( "/account", ( req, res ) => {
    return accountServices.createNewAccount(req, res);
});

//USED MIDDLEWARES
app.use( loggedAccount );

app.get( '/account/statement', ( req, res ) => {

    const { document } = req.headers;
    const account = accountServices.getAccountByDocument(document);

    return res.status( 200 ).json( {
        success: true,
        message: account.statement
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
            message: `Unable to complete transaction [${canDoAction.message}]`
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

//TODO: change functions file location
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

// transactions model
// balance
// transactionValue (default 0)
// description
// action
// date
// origin
// originId? (if origin == 'SYSTEM' : null ? value)
