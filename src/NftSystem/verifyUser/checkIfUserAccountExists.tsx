
export async function checkIfUserExists(ledger2: any, userAccountId: string) {
  try {
    const userAccount = await ledger2.account.getAccount({accountId:userAccountId});
    console.log("userAccount is ",userAccount);
    return userAccount;
  } catch (e) {

  }
}
