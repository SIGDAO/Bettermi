import { generateMethodCall } from "@signumjs/contracts";
import { Attachment, AttachmentMessage } from "@signumjs/core";
import { CheckNftOwnerId } from "../updateUserNftStorage";
import { FindLatestTransactionArray, FindLatestTransactionNumber, UpdateUserStorage } from "../updateUserNftStorage";
export async function BuyNft(
  Wallet: any,
  ledger2: any,
  nftId: string,
  nftPrice: string,
  userAccountId: string,
  codeHashIdForNft: string,
  nftDistributor: string,
  userAccountPublicKey: string,
) {
  const nftOwner = await CheckNftOwnerId(ledger2, nftId);
  const assetId = process.env.REACT_APP_TOKEN_ID!;
  console.log("nftowner", nftOwner);
  const hash = "2";
  const rest = [230000000, 26, 1000000];
  const hexMessage = generateMethodCall({
    methodHash: hash.toString(),
    methodArgs: rest,
  });
  const hi: AttachmentMessage = new AttachmentMessage({
    messageIsText: false,
    message: hexMessage,
  });
  if (hi != null && nftId != null) {

    const transaction = await ledger2.asset.transferAsset({
      assetId: assetId,
      quantity: nftPrice!,
      attachment: hi,
      amountPlanck: "32000000",
      feePlanck: "1000000",
      recipientId: nftId!,
      deadline: 1440,
      senderPublicKey: userAccountPublicKey,
    });
    await Wallet.Extension.confirm(transaction.unsignedTransactionBytes);
  }
  const nftContractStorage = await ledger2.contract.getContractsByAccount({
    accountId: userAccountId,
    machineCodeHash: codeHashIdForNft,
  }); //nftContractStorage is the user's nft storage
  console.log(nftContractStorage.ats[0].at);
  const latestTransactionNumber: string = await FindLatestTransactionNumber(ledger2, nftContractStorage.ats[0].at, nftDistributor);
  console.log("latestTransactionNumber: " + latestTransactionNumber);
  const latestArray: string[] = await FindLatestTransactionArray(ledger2, nftContractStorage.ats[0].at, nftDistributor, latestTransactionNumber);
  console.log("latestArray: " + latestArray);
  const transactionCost = (Math.floor(latestArray.length / 8 + 1) * 1000000).toString();
  console.log("transactionCost: " + transactionCost);
  const userCoverTheirTransactionCost = await ledger2.transaction.sendAmountToSingleRecipient({
    recipientId: nftDistributor,
    amountPlanck: transactionCost,
    feePlanck: "1000000",
    senderPublicKey: userAccountPublicKey,
  });

  await UpdateUserStorage(ledger2, nftOwner, userAccountId, codeHashIdForNft, nftId, nftDistributor);
  await Wallet.Extension.confirm(userCoverTheirTransactionCost.unsignedTransactionBytes);
}
