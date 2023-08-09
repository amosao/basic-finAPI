const accountServices = require('../services/account/AccountService');
const { isNullOrUndefined } = require('../util/ObjectUtil');

function loggedAccount( req, res, next ) {
    const { document } = req.headers;

    const account = accountServices.getAccountByDocument( document );

    if( isNullOrUndefined( account ) ) {
        return res.status( 400 ).json( {
            success: false,
            message: 'Unable to find account.'
        } ).send();
    }

    req.loggedAccount = account;

    return next();
}

module.exports = {loggedAccount};