import * as React from 'react';
import './myNftList.css'
import { CenterLayout } from '../../components/layout';
import { Link, useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/button';
import { GetToken } from '../../components/getToken';
import { useSelector } from 'react-redux';
import { accountId } from '../../redux/account';
import CSS from 'csstype';
import { ShortTitleBar } from '../../components/titleBar';
import { Col, Row, Card, CardText, CardTitle, Button, CardImg, } from 'reactstrap';
import { useAppSelector, useLedger } from '../../redux/useLedger';
import MyNft from './myNft';
import { selectWalletNodeHost } from '../../redux/useLedger';
import { LedgerClientFactory } from '@signumjs/core';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import {generateMasterKeys} from "@signumjs/crypto";
import { P2PTransferNftToken } from '../../components/p2pTransferNftToken';
import { AppContext } from '../../redux/useContext';
import { useContext } from 'react';
import { accountPublicKey } from '../../redux/account';
import { CustomTextArea } from '../../components/input';
import { FindLatestTransactionArray,FindLatestTransactionNumber, p2pTransferNft } from '../../NftSystem/updateUserNftStorage';
import { getNftContractStorage } from '../../redux/account';
import { CheckNftOwnerId,TransferNft,UpdateUserStorage } from '../../NftSystem/updateUserNftStorage';
import { store } from '../../redux/reducer';
import { accountSlice } from '../../redux/account';
import { updateReceiverAccount } from '../../NftSystem/updateUserNftStorage';
import ImportAccountScreen from '../../components/importAccountScreens';

interface IMyNftListProps {
}

// interface myNftList{
//   image:string;
//   assetId:string;
// }

interface myNftList{
  level:string;
  image:string;
  nftId:string;
}

const MyNftList: React.FunctionComponent<IMyNftListProps> = (props) => {
  const userAccountId: string = useSelector(accountId);
  const mobile = process.env.REACT_APP_MOBILE === 'true';
  let height: string | number
  let width: string | number;
  const [loading, setLoading] = useState(true);
  const [myNfts, setMyNfts] = useState<myNftList[]>([]);
  const [onDuty, setOnDuty] = useState<string>("");
  const [array, setArray] = useState<string[]>([]);
  const [selectedNftId, setSelectedNftId] = useState<string>("");
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [userNftTokenList,setNftTokenList] = useState<myNftList[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputAddress,setInputAddress] = useState("");
  const [level,setLevel] = useState("1");

  const [isOpenImport, setIsOpenImport] = useState<boolean>(false);

  const dataFetchedRef = useRef(false);
  const nftContractChecked = useRef(false);
  const {appName,Wallet,Ledger} = useContext(AppContext);
  const nftTokenIssuer:string = process.env.REACT_APP_NFT_TOKEN_ISSUER!;
  const userAccountpublicKey:string = useSelector(accountPublicKey);
  console.log(typeof(nftTokenIssuer));
  console.log(nftTokenIssuer);
  console.log(nftTokenIssuer=="4572964086056463895");
  const {publicKey, signPrivateKey} = generateMasterKeys("smoke term keen design mirror skull mom humble twin welcome speak gloom");
  console.log("publicKey", publicKey);  
  console.log("signPrivateKey", signPrivateKey);
  //var myNft:myNftList[] = [];
  var nft: myNftList;
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  console.log(nodeHost);
  const trialAccountId = "416342944383657789";
  var nftAddressList:string[] = [];
  var userNftList:myNftList[] = [];
  var userNftToken:myNftList[] = [];
  const navigate = useNavigate();

  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!; // the code hash of the BMI contract
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const nftDistributorPublicKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;
  const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
  const nftContractStorage = useSelector(getNftContractStorage);
  // for(var i = 0;i<6;i++){
  //   nft = {
  //     image:`${process.env.PUBLIC_URL}/img/NftList/nft-1@1x.png`,
  //     level:1,
  //   }
  //   myNfts.push(nft);
  // }
  // console.log(myNfts);
  useEffect(() => {
    if (nftContractChecked.current) { console.log("called"); return; }
    nftContractChecked.current = true;
    ledger2.contract.getContractsByAccount({
          accountId: userAccountId,
          machineCodeHash: codeHashIdForNft,
      }).then((senderNftStorage)=>{
    
        store.dispatch(accountSlice.actions.setNftContractStorage(senderNftStorage.ats[0].at));
        console.log("called the if statement");
      }).catch((error)=>{
        console.log(error);alert(
          `something is wrong. Its very likely that your storage account isn' ready. 
          Please wait an few minutes and try again.
          `);navigate("/home")
      });
    
      },[]);

  useEffect(() => {
    if (dataFetchedRef.current) { console.log("called"); return; }
    dataFetchedRef.current = true;
    ledger2.account.getAccount({ accountId: userAccountId }).then((account) => {
      const description = JSON.parse(account.description);
      console.log(description);
      console.log(Object.keys(description.av));
      console.log(typeof(Object.keys(description.av)[0]));
      setOnDuty(Object.keys(description.av)[0]);
      console.log(onDuty);
    }).catch((error) => { console.log(error) });
    // Function to fetch data from the API

    // ledger2.account.getAccount({accountId:userAccountId}).then(async(account) => {
    //   console.log(account);
    //   for (var i = 0;i<account.assetBalances.length;i++){
    //     const token = await ledger2.asset.getAsset({assetId:account.assetBalances[i].asset});
    //     console.log(token);
    //     if(token.issuer === process.env.REACT_APP_NFT_TOKEN_ISSUER && token.name === "BetterMi"){
    //       console.log(JSON.parse(token.description));
    //       console.log(JSON.parse(token.description).descriptor);
    //       console.log(typeof(JSON.parse(token.description).descriptor));
    //       userNftToken.push({image:JSON.parse(token.description).descriptor,assetId:token.asset});
    //       setNftTokenList(userNftToken);
    //     }
    //   }
    // }).then(() => { setLoading(false);}).catch((error)=>{console.log(error)});;


    // ledger2.asset.getAssetsByOwner({accountId:userAccountId}).then(
    //   async(assets) => {
    //     assets.assets.map((asset)=>{
    //       if(asset.issuer === process.env.REACT_APP_NFT_DISTRIBUTOR && asset.name === "BetterMi"){
    //         console.log(JSON.parse(asset.description));
    //         console.log(JSON.parse(asset.description).descriptor);
    //         console.log(typeof(JSON.parse(asset.description).descriptor));
    //         userNftToken.push({level:1,image:JSON.parse(asset.description).descriptor});
    //         setNftTokenList(userNftToken);
    //         setLoading(false);
    //       }
    //     });
    //   }
    // ).catch((error)=>{console.log(error)});
    // console.log(userNftToken,"userNftToken");
    // console.log(userNftTokenList ,"userNftTokenList");//Get token by ownership

          FindLatestTransactionNumber(ledger2,nftContractStorage,nftDistributor).then((number)=>{
            console.log(number);
            FindLatestTransactionArray(ledger2,nftContractStorage,nftDistributor,number).then((nftAddressList)=>{
              if(nftAddressList[0] === "empty"){
                setLoading(false);
              }
              else{
                    console.log(nftAddressList);
                  nftAddressList.map((nftAddress)=>{
                    ledger2.contract.getContract(nftAddress).then((hi)=>{
                        //console.log("array is ",nftAddress,"  ",hi);
                        const trial = JSON.parse(hi.description);
                        //console.log(trial);
                        //console.log(trial.descriptor);
                        nft = {level:trial.version,image:trial.descriptor,nftId:nftAddress};
                        //console.log([...myNfts,nft]);
                        //console.log(myNfts);
                        setMyNfts([...myNfts,nft]);
                        setArray([...array,"123"]);
                        //console.log("testing array is ",array);
                        //console.log("appended list is ",[...myNfts,nft]);
                        userNftList.push(nft);
                        setMyNfts(userNftList);
                        setLoading(false);
                    });
                  });
                }
            });
          }).catch((error)=>{console.log(error);navigate("/home")});



    // ledger2.account.getAccountTransactions({accountId:"2826449997764829726"}).then(
    //   async(transactions) => {
    //   //console.log("transaction is ",transactions);
    //   //console.log(transactions.transactions.length);
    //   for(var i=0;i<transactions.transactions.length;i++){
    //     if(transactions.transactions[i].sender == trialAccountId){
    //      // console.log(transactions.transactions[i].sender);
    //       nftAddressList = transactions.transactions[i].attachment.message.split(",");
    //       //console.log(nftAddressList);
    //       break;
    //     }
    //   }
    //   console.log("nftAddress is  ",nftAddressList);
    //   nftAddressList.map((nftAddress)=>{
    //     ledger2.contract.getContract(nftAddress).then((hi)=>{
    //         //console.log("array is ",nftAddress,"  ",hi);
    //         const trial = JSON.parse(hi.description);
    //         //console.log(trial);
    //         //console.log(trial.descriptor);
    //         nft = {level:trial.version,image:trial.descriptor};
    //         //console.log([...myNfts,nft]);
    //         //console.log(myNfts);
    //         setMyNfts([...myNfts,nft]);
    //         setArray([...array,"123"]);
    //         //console.log("testing array is ",array);
    //         //console.log("appended list is ",[...myNfts,nft]);
    //         userNftList.push(nft);
    //         setMyNfts(userNftList);
    //         setLoading(false);
    //     });
    //   });
    //   //console.log("userNftList is",userNftList);
    //   //console.log("myNft is",myNfts);
    // });


  }, [userAccountId]);



  /*const myNftList = ledger2.account.getAccountTransactions({accountId:"	2826449997764829726"}); //Contract Id
  const BMI:BMI_Day[] = [];
  message.transactions.map((obj)=>{
      // console.log(obj);
      // console.log(typeof(obj.attachment.message),typeof(obj.timestamp));
      BMI.push({timeStamp:Number(obj.timestamp),BMI:obj.attachment.message});
      return_Date(Number(obj.timestamp));
  }); 
  //console.log(message);
  console.log(BMI);*/

  if (mobile) {
    height = "844px";
    width = "390px";
    // display in ipad air size
  } else {
    height = "100vh";
    width = "820px";
  }
  const bgStyle: CSS.Properties = mobile ?
    {
      'background': `transparent`,
    }
    :
    {
      'position': 'fixed',
      'background': `linear-gradient(112deg, #221D4B 0%, #171717 100%)`,
      'boxShadow': '0px 3px 30px var(--royal-blue)',
      'width': '100vw',
      'minHeight': '100vh',
      'height': '100%',
      // 'overflowY': `${isOpenPopup ? 'hidden' : 'auto'}`,
      'overflowY': 'auto',
      'zIndex': '1',
      'overflowX': 'hidden',
      'display': 'flex!important',
    }
  const centerLayoutStyle: CSS.Properties = {
    // 'backgroundPosition': 'center',
    'minHeight': `${height}`, // ipad size
    'width': `min(100vw,${width})`, // ipad size
    'height': '100%',
    //'margin': 'auto',
    'display': 'flex',
    //'justifyContent': 'center',
    //'alignItems': 'center',
    //'backgroundColor': 'green',
    'flexDirection': 'column',
  }
  const customStyle: CSS.Properties = {
    'alignItems': 'flex-start',
    'cursor': 'pointer',
    'display': 'flex',
    'height': '44px',
    'left': '16px',
    'minWidth': '44px',
    'paddingLeft': '14px',
    'position': 'relative',
    'top': '44px',
  }
  const importNft = async (ledger2:any,nftAddress:string,userAccountId:string) => {
    try{
let accountDes = await ledger2.account.getAccount({accountId:nftAddress});
const nftId = accountDes.account;
    const nftOwnerId = await CheckNftOwnerId(ledger2,nftId);
    if(nftOwnerId === userAccountId){
      updateReceiverAccount(ledger2,userAccountId,codeHashIdForNft,nftId,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
    }
  }
  catch(e){
    console.log(e);
    alert("hmmm it seems like some error occurs");
  }
  }
  const displayMyNft = myNfts.map((nft) => {//Contract Id
    console.log("userNftList is  ", myNfts);
    return (
      <MyNft image={nft.image} level={level} isOpenPopup={isOpenPopup} setIsOpenPopup={setIsOpenPopup} nftId = {nft.nftId} setSelectedAssetId={setSelectedNftId} setLevel={setLevel}></MyNft>
    );
  }
  );
  const displayNftToken = userNftTokenList.map((nft) => {//Contract Id
    console.log("userNftTokenList is  ",nft);
    return(
      <MyNft image={nft.image} level={level} isOpenPopup={isOpenPopup} setIsOpenPopup={setIsOpenPopup} nftId= {nft.nftId} setSelectedAssetId={setSelectedNftId} setLevel={setLevel}></MyNft>
    );
  }
  );
  const transferNft = async(assetId:string) => {
    try{
      const nftOwner = await CheckNftOwnerId(ledger2,selectedNftId);
      console.log("nftOwner is",nftOwner);
      if(nftOwner === userAccountId){
        const latestTransactionNumber:string = await FindLatestTransactionNumber(ledger2,nftContractStorage,nftDistributor);
        const latestArray:string[] = await FindLatestTransactionArray(ledger2,nftContractStorage,nftDistributor,latestTransactionNumber);
        const transactionCost = (Math.floor((latestArray.length)/8+1)*1000000).toString();
       const userCoverTheirTransactionCost = await ledger2.transaction.sendAmountToSingleRecipient({
          recipientId: nftDistributor,
          amountPlanck: transactionCost,
          feePlanck: "1000000",
          senderPublicKey: userAccountpublicKey,
        });
        await Wallet.Extension.confirm(userCoverTheirTransactionCost.unsignedTransactionBytes);
        const recipientInfo  = await ledger2.account.getAccount({accountId:inputAddress});
        console.log(recipientInfo.account);
        console.log(selectedNftId);
        console.log(userAccountpublicKey);
        console.log(Wallet);
        //await p2pTransferNft(ledger2,Wallet,selectedNftId,userAccountpublicKey,recipientInfo.account);
        const transaction = await ledger2.contract.callContractMethod({
          senderPublicKey: userAccountpublicKey,
          feePlanck: "2000000",
          amountPlanck: "30000000",
          contractId: selectedNftId,
          methodHash: "-8011735560658290665",
          methodArgs: [recipientInfo.account],
          });
          await Wallet.Extension.confirm(transaction.unsignedTransactionBytes);
        await UpdateUserStorage(ledger2,userAccountId,inputAddress,codeHashIdForNft,selectedNftId,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
      }
    }
    catch(e){
      console.log(e);
      alert("Transaction not signed");
    }
  }
  //   try{
  //   const recipientAccount = await ledger2.account.getAccount({
  //     accountId:inputAddress,
  //   });
  //   console.log(recipientAccount);
  //   if(assetId !== ""){
  //     console.log(assetId);
  //     console.log(publicKey);
  //     const unsignedTransaction = await ledger2.asset.transferAsset({
  //       assetId:assetId,
  //       quantity:"1",
  //       recipientId:recipientAccount.account,
  //       feePlanck:"1000000",
  //       senderPublicKey:userAccountpublicKey,
  //     });
  //     await Wallet.Extension.confirm(unsignedTransaction.unsignedTransactionBytes);
  //     navigate("/NFTTransferCompleted");
  //   }
  //   else{
  //     console.log("assetId doesnt exists");
  //   }
  // }
  // catch{
  //   alert("account not exist");
  // }
  // }
  const returnNftToMe = async() => {
    // console.log(userAccountId);
    // ledger2.account.getAccount({accountId:userAccountId}).then(async(account) => {
    //   console.log(account);
    //   for (var i = 0;i<account.assetBalances.length;i++){
    //     const token = await ledger2.asset.getAsset({assetId:account.assetBalances[i].asset});
    //     console.log(token);
    //     if(token.issuer === process.env.REACT_APP_NFT_TOKEN_ISSUER && token.name === "BetterMi"){
    //       console.log(JSON.parse(token.description));
    //       console.log(JSON.parse(token.description).descriptor);
    //       console.log(typeof(JSON.parse(token.description).descriptor));
    //       P2PTransferNftToken(Wallet,nodeHost,"4572964086056463895",token.asset,userAccountpublicKey);
    //     }
    //   }
    // });
  }
  // const tempDisplayMyNft = tempNftList.map((nft) => {//Contract Id
  //   console.log("myNftList is  ",myNfts);
  //   console.log("loading is  ",loading);
  //   return(
  //     <MyNft  image={nft.image} level = {nft.level}></MyNft>
  //   );
  //   }
  // );
  //const content : JSX.Element = (
    const handleInputChange = (event:any) => {
      setInputValue(event.target.value);
    };
    const handleAddressChange = (event:any) => {
      setInputAddress(event.target.value);
    };

    // testing for github update

return(
    <div style={bgStyle}>
    <div style={centerLayoutStyle} className='bettermidapp-mimi-nfts-send-address-1'>
      <ShortTitleBar title='My NFTs' addSign = {true} aiCoach = {false} filter = {false} importButton = {true} isOpenImport = {isOpenImport} setIsOpenImport={setIsOpenImport}/>
      <div className = "containerMyNftList">
        <div className = "containerMyNftList2">
        {onDuty === ""?(             
        <div className = "myNftList">
             <img className = "myNftImage" src = {"img/myNftList/nft-1@1x.png"}></img>
             <div className = "myNftDescription">
             <div className = "myNftNumber">#0000000001</div>
               <div className = "myNftBar">
                 <div  className = "myNftLevel">
                   Lv{level}       
                   </div>
                   <div className = "myNftVerticalLine"></div>  
                   <div  className = "inter-normal-white-12px">
                     Reward + 10%
                     </div>
               </div>
               <div className = "myNftPrice">
                 $0 SIGNA
               </div>
             </div>
             <div className = "myNftBottom">
             <button 
             onClick = {returnNftToMe}
              className = "myNftButtonOnDuty" 
              style = {{backgroundColor:"#39B3AF!important"}}
            >ON DATE</button>
             {/* <img  className = "myNftButtomArrow" src  = {`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`} onClick={() => setIsOpenPopup((prev) => !prev)}></img> */}
             </div>
           </div>
           ):(
             <div className = "myNftList">
             {/* <img className = "myNftImage" src = {`https://ipfs.io/ipfs/${onDuty}`}></img> */}
             <div className = "myNftDescription">
             <div className = "myNftNumber">#0000000001</div>
               <div className = "myNftBar">
                 <div  className = "myNftLevel">
                   Lv{level}       
                   </div>
                   <div className = "myNftVerticalLine"></div>  
                   <div  className = "myNftReward">
                     Reward + 10%
                     </div>
               </div>
               <div className = "myNftPrice">
                 $0 SIGNA
               </div>
             </div>
             <div className = "myNftBottom">
             <button className = "myNftButtonOnDuty" style = {{backgroundColor:"#39B3AF!important"}}>ON DATE</button>
             <img className = "myNftButtomArrow" src  = {`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`} onClick={() => setIsOpenPopup((prev) => !prev)}></img>
             </div>
           </div>
               )

               }
              {/* {displayMyNft} */}
              {loading?(<div></div>):(displayMyNft)}
        </div>
        {/* {loading?(<p>loading...</p>):(
          <>
                <ShortTitleBar title='My NFTs' />
                {console.log(userNftList)}{console.log(array)}
        <div className = "containerMyNftList">
          <div className = "containerMyNftList2">
              {displayMyNft}
          </div>
        </div>
        </>
        )
  } */}
      </div>
      {isOpenPopup && 
          <div className="edit-profile-layer">
            <div className="icon-arrow-left-1-popup icon-arrow-left-3-popup">
              <img className="icon-arrow-left-popup" onClick={() => setIsOpenPopup((prev) => !prev)} src="img/myNftList/icon-arrow-left-1@1x.png" alt="icon-arrow-left" />
            </div>
            <div className="edit-profile">
              <div className="overlap-group-1">
                <img className="seperate-line-1" src="img/myNftList/seperate-line-1@1x.png" alt="Seperate line" />
                <img className="bg" src="img/myNftList/bg-2@1x.png" alt="BG" />
                <img className="seperat-line-1 seperat-line-3" src="img/myNftList/seperat-line-3@1x.png" alt="Seperat line" />
                <div className="transfer-n-ft inter-bold-royal-blue-15px">TRANSFER NFT</div>
                <div className="recipient inter-bold-royal-blue-15px">RECIPIENT</div>
                <div className="nft-details inter-bold-royal-blue-15px">NFT DETAILS</div>
                <div className="rewards">
                  <div className="ic_send-1">
                    <img className="ic_send-1-content" src="img/myNftList/ic-send-1@1x.png" alt="" />
                  </div>
                  <div className="place inter-semi-bold-white-18px">Send</div>
                </div>
                <div className="search_bar"></div>
                <CustomTextArea 
                  text= {inputAddress} 
                  setText={setInputAddress} 
                  width={300} 
                  height={56} 
                  importClassName="card-number-1 search_bar-1 search_bar-4"
                  activeClassName="active-card-number-1 search_bar-1 search_bar-4"
                  placeholder="e.g. TS-9DJR-MGA2-VH44-5GMXY"
                />
                {/* <textarea
                  className="search_bar-1 search_bar-4"
                  value={inputAddress}
                  onChange={handleAddressChange}
                  placeholder="Enter something"
                /> */}
                {/* <div className="search_bar-1 search_bar-4"><p className="card-number">e.g. TS-9DJR-MGA2-VH44-5GMXY or Anderson</p></div> */}
                <div className="search_bar-2 search_bar-4"></div>
                <div className="button_save" onClick={() => transferNft(selectedNftId)}>
                  <div className="continue inter-semi-bold-white-15px">Transfer</div>
                </div>
                <p className="address-id-to-send-nft-to">Address, ID to send NFT to.</p>
                <h1 className="text-7">#00000001</h1>
                <div className="x0-signa-1">$0 SIGNA</div>
                <div className="x16228">
                  <div className="lv-1-1">LV {level || 1}</div>
                  <img className="x6" src="img/myNftList/file---6@1x.png" alt="6" />
                  <div className="reward-10-1">REWARD +10%</div>
                </div>
                <CustomTextArea 
                  text= {inputValue} 
                  setText={setInputValue} 
                  width={300} 
                  height={121} 
                  importClassName="card-number-1 search_bar-4 search_bar-3"
                  activeClassName="active-card-number-1 search_bar-4 search_bar-3"
                  placeholder="You may attach some text or binary data to this transaction. Here you also enter the memo required by many exchanges"
                />
                {/* <textarea
                  className="search_bar-3 search_bar-4"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="You may attach some text or binary data to this transaction. Here you also enter the memo required by many exchanges"
                /> */}
              {/* <p>Input Value: {inputValue}</p> */}
                {/* <div className="search_bar-3 search_bar-4">
                  <p className="card-number-1">
                    You may attach some text or binary data to this transaction. Here you also enter the memo required
                    by many exchanges
                  </p>
                </div> */}
                <div className="additional-text inter-bold-royal-blue-15px">ADDITIONAL TEXT</div>
              </div>
            </div>
          </div>
      }
      {isOpenImport &&<ImportAccountScreen setIsOpenImport={setIsOpenImport} isOpenImport = {isOpenImport}></ImportAccountScreen>}
            {isOpenImport && 
            <div className="importAccount-layer">
              <div className="importAccount-icon-arrow-left-3" onClick={() => setIsOpenImport(!isOpenImport)}>
                <img className="importAccount-icon-arrow-left" src="img/importAccount/importAccount-icon-left.png" alt="icon-arrow-left" />
              </div>
              <div className="importAccount">
                <div className="overlap-group1-1">
                  <img className="seperate-line-importAccount-1" src="img/importAccount/seperate-line-14@1x.png" alt="Seperate line" />
                  <img className="importAccountbg" src="img/importAccount/bg-11@1x.png" alt="BG" />
                  <img className="importAccount-seperate-line" src="img/importAccount/seperat-line-10@1x.png" alt="Seperat line" />
                  <div className="your-n-ft-id">YOUR NFT ID</div>
                  <div className="importAccountrewards">
                    <div className="ic_add-1 ic_add-3">
                      <div className="importAccount-overlap-group-1">
                        <img className="importAccountadd" src="img/importAccount/add-1@1x.png" alt="Add" />
                        <img className="importAccountic_add" src="img/importAccount/ic-add-1@1x.png" alt="ic_add" />
                      </div>
                    </div>
                    <div className="importAccount-import-your-nft">Import Your NFT</div>
                  </div>
                  <CustomTextArea 
                  text= {inputAddress} 
                  setText={setInputAddress} 
                  width={300} 
                  height={56} 
                  importClassName="card-number-1 importAccount_search_bar-1 importAccount_search_bar-4"
                  activeClassName="active-card-number-1 importAccount_search_bar-1 importAccount_search_bar-4"
                  placeholder="#0000000001"
                />
                  {/* <div className="importAccountsearch_bar"></div> */}
                    <div className="importAccountbutton_save"><div className="importAccountcontinue" onClick = {() =>  {importNft(ledger2,inputAddress,userAccountId);setIsOpenImport(!isOpenImport);}}>Import Again</div></div>
                  {/* <h1 className="importAccounttext-7">#00000001</h1> */}
                  <div className="importAccount-error-message">
                    {/* <div className="importAccount_error_icon">
                      <div className="importAccount-x-container">
                        <img className="importAccountx11692" src="img/importAccount/file---11692@1x.png" alt="11692" />
                        <img className="importAccountx11693" src="img/importAccount/file---11693@1x.png" alt="11693" />
                      </div>
                    </div> */}
                    <p className="importAccount-it-looks-like-your-c">
                      Please input the contract Address of the NFT you have bought on signumart. 
                    </p>
                  </div>
                </div>
              </div>
          </div>
      }
    </div>
    </div>


  );


  // return (
  //   <CenterLayout
  //     content={content}
  //     bgImg={false}
  //   />
  // );"{"version":1,"descriptor":"QmNhdiqCRXzoVm3pn5eaqvudAjbWsavwqi6a6Bs7ZL5WeE"}"
};

export default MyNftList;