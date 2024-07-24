import { Api } from "@signumjs/core";


export async function countReferredUser(ledger2: Api, userAccountId: string) {
  // ledger2.account
  // .getAccount({ accountId: userAccountId })
  // .then(async (account) => {
  const TokenDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR;
  const unconfirmedTransaction = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
  console.log("unconfirmed Transaction is",unconfirmedTransaction);
  var distributedReward = false;
  var referredCount = 0;
  unconfirmedTransaction.unconfirmedTransactions.map((transaction)=>{
      if(transaction.sender === TokenDistributor && transaction.attachment&&transaction.attachment.message && transaction.attachment.message.includes("Congrats! You have referred user") ){
        referredCount = referredCount + 1;
      }
  });
  const accountTransaction = await ledger2.account.getAccountTransactions({ accountId: userAccountId });
  console.log("accountTransaction is ", accountTransaction);
  accountTransaction.transactions.forEach((transaction) => {
    if (!transaction.attachment || !transaction.attachment.hasOwnProperty("message")){
      return; // Exit the current iteration of the loop
    }
    console.log("the transaction is ", transaction);

    const message = transaction.attachment.message;
    if (transaction.sender === TokenDistributor && message && message.includes("Congrats! You have referred user")) {
      console.log("the message is true ", message);
      referredCount = referredCount + 1;
    }
  });
  return referredCount;
}
