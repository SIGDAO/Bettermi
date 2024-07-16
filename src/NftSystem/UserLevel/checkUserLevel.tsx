import { fetchIPFSJSON } from "../updateUserNftStorage";

export async function checkUserLevel(ledger2: any, userAccountId: string) {
  try {
    const account = await ledger2.account.getAccount({ accountId: userAccountId });
    const description = JSON.parse(account.description);
    console.log(description.id);
    if (description.id != null) {
      const accountInfo = await ledger2.contract.getContract(description.id);
      const ipfsAddress = JSON.parse(accountInfo.description).descriptor;
      // const ipfsJson = await fetch(`https://ipfs.io/ipfs/${ipfsAddress}`);
      // const text = await ipfsJson.text();
      // const nftInfo = JSON.parse(text);
      const nftInfo = await fetchIPFSJSON(ipfsAddress);
      var level = 1;
      if (nftInfo.description.includes("2") === true) {
        level = 2;
      }
      if (nftInfo.description.includes("3") === true) {
        level = 3;
      }
    } else {
      level = 1;
    }
    console.log(level);
    return level;
  } catch (e) {
    console.log(e);
    level = 1;
  }
  return 1;
}

export async function checkEquippedBettermiNFT(ledger2: any, userAccountId: string) {
  try {
    console.log("userAccountId", userAccountId);
    // check unconfirmed transactions
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    for (var i = 0; i < messages.unconfirmedTransactions.length; i++) {
      if (messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId) {
        let description = messages.unconfirmedTransactions[i].attachment.description == null ? {} : JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
        if (description.id != null) {
          const accountInfo = await ledger2.contract.getContract(description.id);
          const ipfsAddress = JSON.parse(accountInfo.description).descriptor;
          console.log("ipfsAddress", ipfsAddress);
          const nftInfo = await fetchIPFSJSON(ipfsAddress);
          console.log("nftInfo is", nftInfo);
          if (nftInfo.collection.name.includes("Bettermi.io") === true) {
            console.log("returned true");
            return true;
          }
        }
      }
    }

    // check confirmed transactions
    const account = await ledger2.account.getAccount({ accountId: userAccountId });
    const description = JSON.parse(account.description);
    if (description.id != null) {
      const accountInfo = await ledger2.contract.getContract(description.id);
      const ipfsAddress = JSON.parse(accountInfo.description).descriptor;
      // const ipfsJson = await fetch(`https://ipfs.io/ipfs/${ipfsAddress}`);
      // const text = await ipfsJson.text();
      // const nftInfo = JSON.parse(text);
      const nftInfo = await fetchIPFSJSON(ipfsAddress);
      if (nftInfo.collection.name.includes("Bettermi.io") === true) {
        return true;
      }

      // var level = 1;
      // if (nftInfo.description.includes("2") === true) {
      //   level = 2;
      // }
      // if (nftInfo.description.includes("3") === true) {
      //   level = 3;
      // }
    } else {
      return false;
      // level = 1;
    }
    // console.log(level);
    // return level;
  } catch (e) {
    if (e.message === "Failed to fetch IPFS JSON") {
      throw new Error("Failed to fetch IPFS JSON");
    }
  }
  return false;
}
