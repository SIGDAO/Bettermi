export async function checkUserLevel(ledger2:any,userAccountId:string){ 
  try{
const account = await ledger2.account.getAccount({ accountId: userAccountId });
const description = JSON.parse(account.description);
console.log(description.id);
if (description.id != null) {
  const accountInfo = await ledger2.contract.getContract(description.id);
  const ipfsAddress = JSON.parse(accountInfo.description).descriptor;
  const ipfsJson = await fetch(`https://ipfs.io/ipfs/${ipfsAddress}`);
  const text = await ipfsJson.text();
  const nftInfo = JSON.parse(text);
  var level = 1;
  if (nftInfo.description.includes("2") === true) {
    level = 2;
  }
  if (nftInfo.description.includes("3") === true) {
    level = 3;
  }
}
 else{
  level = 1;}
 console.log(level);
  }
  catch(e){
    console.log(e);
    level = 1;
  }
 return level;

 }