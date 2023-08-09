const express = require('express');
const accountServices = require('./services/account/AccountService');
const transactionService = require('./services/transaction/transactionService');
const { loggedAccount } = require('./middlewares/loggedAccount');

const app = express();
app.use( express.json() );

app.listen( 8080 );

// * NO TOKEN REQUIRED SERVICES

//ACCOUNT CREATION
app.post( "/account", ( req, res ) => {
    return accountServices.createNewAccount(req, res);
});

// * MIDDLEWARES

//TOKEN MIDDLEWARE
app.use( loggedAccount );

//ACCOUNT PROFILE
app.get( '/account', ( req, res ) => {
    return accountServices.getProfile(req, res);
});

//ACCOUNT PROFILE UPDATE
app.put( '/account/profile', ( req, res ) => {
    return accountServices.updateProfile(req, res);
});

//ACCOUNT STATEMENT
app.get( '/account/statement', ( req, res ) => {
    return accountServices.getStatementByPeriod(req, res);
});

//DEPOSIT
app.post( '/action/deposit', (req, res) => {
    return transactionService.depositTransaction(req, res);
});

//WITHDRAW
app.post( '/action/withdraw', (req, res) => {
    return transactionService.withdrawTransaction(req, res);
});

//ACCOUNT DEACTIVATION
app.delete( '/account/disable', (req, res) => {
    return accountServices.disableAccount(req, res);
});
