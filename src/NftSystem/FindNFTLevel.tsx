export function findNumberAfterString(inputString:string) {
    const regex = /NFT \w+ level (\d+)/;
    const match = inputString.match(regex);
  
    if (match && match[1]) {
      return match[1];
    }
  
    return null;
  }

export async function findNFTLevel(ledger2:any, userAccountId:string) {
    var userAccountDescription = await ledger2.account.getAccount({accountId:userAccountId});
    console.log(userAccountDescription);
    userAccountDescription = JSON.parse(userAccountDescription.description);
    const nftId = userAccountDescription.nftId;
    
}