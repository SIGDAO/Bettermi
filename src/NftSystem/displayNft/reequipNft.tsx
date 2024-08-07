import { checkEquippedBettermiNFT } from "../UserLevel/checkUserLevel";
import { FindLatestTransactionArray,FindLatestTransactionNumber, fetchIPFSJSON } from "../updateUserNftStorage";
import { UpdateUserIconNewVersion } from "../updateUserNftStorage";
export async function reEquipNft (ledger2:any,Wallet:any,userAccountId:string,codeHashIdForNft:string,nftDistributor:string,userAccountpublicKey:string,navigate:(url:string) => void){
  try {
    const equippedBettermiNft = await checkEquippedBettermiNFT(ledger2,userAccountId);
    if(equippedBettermiNft === false){
      alert("please equip a Bettermi NFT, we will shortly prompt a notification to help you change it");

      const name = "ANderson";
      let receiverNftStorage = await ledger2.contract.getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: codeHashIdForNft,
    });
      console.log("receiverNftStorage",receiverNftStorage.ats[0].at);
      const latestTransactionNumber = await FindLatestTransactionNumber(ledger2,receiverNftStorage.ats[0].at,nftDistributor);
      const transactionArray = await FindLatestTransactionArray(ledger2,receiverNftStorage.ats[0].at,nftDistributor,latestTransactionNumber);
      if(transactionArray[0] == "empty"){
        alert("we didn't detect any nfts");
        navigate("/connectWallet");
      }
      const nftId = transactionArray[0];
      console.log("nftId is",nftId);
      const contractDescription = await ledger2.contract.getContract(nftId);
      const ipfsAddress = JSON.parse(contractDescription.description).descriptor;
      console.log(ipfsAddress);
      // await fetch(`https://ipfs.io/ipfs/${ipfsAddress}`).then((res) => res.text()).then((res) => {
      //   const text = JSON.parse(res);
      //   const imgAddress = text.media[0].social
      //   UpdateUserIconNewVersion(ledger,imgAddress,nftId, accountinfo.accountId,accountinfo.publicKey,Wallet,name);
      // })
      const ipfsJson = await fetchIPFSJSON(ipfsAddress);
      // const text = await ipfsJson.text();
      const imgAddress = ipfsJson.media[0].social;
      await  UpdateUserIconNewVersion(ledger2,imgAddress,nftId,userAccountId,userAccountpublicKey,Wallet,name);
    }

  } catch (error) {
    console.log(error);
  }
}