export async function CheckUnconfirmedNewNFTContract(ledger2:any,recipientId:string){
    const message = await ledger2.account.getUnconfirmedAccountTransactions(recipientId);
    console.log(message);
    console.log(message.unconfirmedTransactions);
    const referencedTransactionHash = process.env.REACT_APP_NFT_CONTRACT_REFERENCED_TRANSACTION_FULL_HASH!;
    console.log(referencedTransactionHash);
    for(var i = 0; i < message.unconfirmedTransactions.length;i++){
        console.log(typeof(message.unconfirmedTransactions[i].type));
        if(message.unconfirmedTransactions[i].referencedTransactionFullHash == referencedTransactionHash){
            console.log("returned true");
            return true;
        }
    }
    return false;
}

export async function CheckUnconfirmedNewBMIContract(ledger2:any,recipientId:string){
    const message = await ledger2.account.getUnconfirmedAccountTransactions(recipientId);
    console.log(message);
    const referencedTransactionHash = process.env.REACT_APP_BMI_CONTRACT_REFERENCED_TRANSACTION_FULL_HASH!;
    console.log(referencedTransactionHash);
    for(var i = 0; i < message.unconfirmedTransactions.length;i++){
        console.log(typeof(message.unconfirmedTransactions[i].type));
        if(message.unconfirmedTransactions[i].referencedTransactionFullHash == referencedTransactionHash){
            console.log("returned true");
            return true;
        }
    }
    return false;
}