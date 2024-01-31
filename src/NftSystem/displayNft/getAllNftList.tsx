export function getContract(Ledger2:any,nftStorageList:any[]){
    var promises:any[] = [];
    for(var i = 0 ; i < Math.min(nftStorageList.length,1000); i++){
        if(nftStorageList[i].at != null){
            console.log(nftStorageList[i].at);
            promises.push(Ledger2.account.getAccount(nftStorageList[i].at));
        }
        else{
            console.log(Ledger2.account.getAccount(nftStorageList[i].at));
        }
    }
    return promises;
  }