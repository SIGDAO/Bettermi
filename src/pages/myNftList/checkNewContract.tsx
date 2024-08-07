export async function CheckUnconfirmedNewNFTContract(ledger2:any,recipientId:string){
    const message = await ledger2.account.getUnconfirmedAccountTransactions(recipientId);


    const referencedTransactionHash = process.env.REACT_APP_NFT_CONTRACT_REFERENCED_TRANSACTION_FULL_HASH!;

    for(var i = 0; i < message.unconfirmedTransactions.length;i++){

        if(message.unconfirmedTransactions[i].referencedTransactionFullHash == referencedTransactionHash){

            return true;
        }
    }
    return false;
}

export async function CheckUnconfirmedNewBMIContract(ledger2:any,recipientId:string){
    const message = await ledger2.account.getUnconfirmedAccountTransactions(recipientId);

    const referencedTransactionHash = process.env.REACT_APP_BMI_CONTRACT_REFERENCED_TRANSACTION_FULL_HASH!;

    for(var i = 0; i < message.unconfirmedTransactions.length;i++){

        if(message.unconfirmedTransactions[i].referencedTransactionFullHash == referencedTransactionHash){

            return true;
        }
    }
    return false;
}