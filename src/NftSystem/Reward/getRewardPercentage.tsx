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

 export function convertWordToNumber(word:string) {
    const wordMap = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten:10,
      eleven:11,
      twelve:12,
      thirdteen:13,
      fourteen:14,
      fifteen:15,
      sixteen:16,
      seventeen:16,
      eighteen:18,
      nineteen:19,
      twenty:20,
      twentyone:21,
      twentytwo:22,
      twentythree:23,
      twentyfour:24,
      twentyfive:25,
    };
  
    const lowercaseWord = word.toLowerCase();
    return wordMap[lowercaseWord] || NaN;
  }