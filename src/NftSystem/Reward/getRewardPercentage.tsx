export async function GetRewardPercentage(ledger2:any,userAccountId:string){
    // ledger2.account
    // .getAccount({ accountId: userAccountId })
    // .then(async (account) => {
        try{
        const account = await ledger2.account.getAccount({accountId:userAccountId});
        console.log(account);
        const description = JSON.parse(account.description);
        console.log(description.id);
        if (description.id != null) {
            const accountInfo = await ledger2.contract.getContract(description.id);
            console.log(accountInfo);
            const ipfsJson = await fetch(`https://ipfs.io/ipfs/${JSON.parse(accountInfo.description).descriptor}`);
            console.log(ipfsJson);
            const text = await ipfsJson.text();
            console.log(text);
            const nftInfo = JSON.parse(text);
            console.log(nftInfo.attributes)
            const array = nftInfo.attributes[2].key3;
            console.log("array is",array);
            if (nftInfo.description.includes("1") === true) {
                console.log("called if");
                return"5";
              }
              else if (nftInfo.description.includes("2") === true) {
                console.log("called else if");
                return "10";
              }
              else if (nftInfo.description.includes("3") === true) {
                console.log("called else if")
                    return "15";
              }
              else{
                console.log("called else");
                return "0";
              }
        }
    // }).catch((error) =>{
    //     console.log(error);
    //     return "0";
    // })
    ;
        }
        catch(e){return "0";}
        
  };