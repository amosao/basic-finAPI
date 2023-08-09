const accountServices = require('../account/AccountService');

function canDoAction( transaction, account ) {
    const balance = accountServices.getAccountBalance( account );
    
    if ( balance + transaction.value < 0 ) {
        return { doable: false, message: `Not enough credit` };
    }

    return { doable: true };
}

function depositTransaction(req, res) {
    const { loggedAccount } = req;
    const { transaction } = req.body;

    const balance = accountServices.getAccountBalance( loggedAccount );

    if( Math.sign( transaction.value ) == -1 ) {
        return res.status( 400 ).json( {
            success: false,
            message: 'Deposit value must be positive.'
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
    
    accountServices.pushTransaction( deposit, loggedAccount );

    return res.status( 200 ).json( {
        success: true,
        message: `Transaction successful.`
    } ).send();
}

function withdrawTransaction(req, res) {
    const { loggedAccount } = req;
    const { transaction } = req.body;

    let validAction = canDoAction( transaction, loggedAccount );
    if ( !validAction.doable ) {
        return res.status( 400 ).json( {
            success: false,
            message: `Unable to complete transaction [${validAction.message}]`
        } ).send();
    }

    var withdraw = { 
        balance: accountServices.getAccountBalance(loggedAccount) ,
        transactionValue: -transaction.value,
        action: `USER_WITHDRAW`,
        description: transaction.description,
        date: new Date(),
        origin: `USER_ACTION`,
        originId: loggedAccount.id
    };

    accountServices.pushTransaction( withdraw, loggedAccount );

    return res.status( 200 ).json( {
        success: true,
        message: `Transaction successful.`
    } ).send();
}

module.exports = {
    canDoAction,
    depositTransaction,
    withdrawTransaction
}