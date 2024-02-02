import React from 'react';
import '../loadingMinting/loadingMinting.css'
// import '../loading/loadingMinting.css';
import { CenterLayout } from '../../components/layout';
import { useLedger } from '../../redux/useLedger';
import { useSelector } from 'react-redux';
import { accountId } from '../../redux/account';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FindLatestTransactionArray,FindLatestTransactionNumber } from '../../NftSystem/updateUserNftStorage';
import { getNftContractStorage } from '../../redux/account';
import { useRef } from 'react';
import LoadingMinting from '../loadingMinting/loadingMinting';
import { LedgerClientFactory } from '@signumjs/core';
import { useAppSelector } from '../../redux/useLedger';
import { selectWalletNodeHost } from '../../redux/useLedger';
import { FindNftContractStorage } from '../../NftSystem/updateUserNftStorage';
import { GetEquippedNftId } from '../../NftSystem/updateUserNftStorage';

interface myNftList{
    level:string;
    image:string;
    nftId:string;
  }
  

interface ILoadingMintingProps {
    loadingNft:Boolean;
    setLoadingNft:(isLoading:boolean) => void;
    myNfts:myNftList[];
    setMyNfts:(myNftList:myNftList[]) => void;
    userId?:string;
    isOtherUser:boolean;
}

const LoadingMintingMyNftList: React.FunctionComponent<ILoadingMintingProps> = (props) => {
    const {loadingNft,setLoadingNft,myNfts,setMyNfts,userId,isOtherUser} = props;
  const navigate = useNavigate();
  //const ledger = useLedger();
  const userAccountId = useSelector(accountId);
  const Id = userId == null?userAccountId:userId;
  //console.log("Id is ",Id);
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace(/['"]+/g, ''); // the code hash of the BMI contract 
  const [count, setCount] = useState(1);



//   const checkIfNFTMinted = async () => {
//     if (!ledger) return;
//     // const startTime: number = Date.now(); // get the current time in milliseconds


//     let ourContract = await ledger.contract.getContractsByAccount({
//       accountId: userAccountId,
//       machineCodeHash: codeHashId,
//     });

//     while(ourContract.ats[0] == null){
//       ourContract = await ledger.contract.getContractsByAccount({
//         accountId: userAccountId,
//         machineCodeHash: codeHashId,

//         });
//       console.log(ourContract);
//     }
//     setCount(100)
//     setIsLoading(false);
//   }


//   useEffect(() => {
//     checkIfNFTMinted()
//       .catch((err) => {
//         console.error(err);
//       })
//   }, [])
const nodeHost = useSelector(selectWalletNodeHost);
const ledger2 = LedgerClientFactory.createClient({nodeHost});
const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
const nftDistributorPublicKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;
const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
const codeHashIdForNft:string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
const nftLoaded = useRef(false);
var nft: myNftList;
var userNftList:myNftList[] = [];

const loadNftList = async() => {

  const nftContractStorage = await FindNftContractStorage(ledger2,Id,codeHashIdForNft);
  const latestTransactionNumber = await FindLatestTransactionNumber(ledger2,nftContractStorage,nftDistributor);
  const nftAddressList = await FindLatestTransactionArray(ledger2,nftContractStorage,nftDistributor,latestTransactionNumber);
  if(nftAddressList[0] === "empty"){
    setLoadingNft(false);
  }
  if(isOtherUser ===false){
    const equippedNft = await GetEquippedNftId(ledger2,Id);
    if(equippedNft != ""){
      const index = nftAddressList.indexOf(equippedNft);
      if(index > -1){
        nftAddressList.splice(index,1);
      }
    }
  }
    const promiseArray = nftAddressList.map((addressList) => {
      return ledger2.contract.getContract(addressList)
}
    )
    const contractInfoArray = await Promise.all(promiseArray);
    for (var i = 0;i < contractInfoArray.length;i++){
      try{
      console.log(contractInfoArray[i].description);
        const trial = JSON.parse(contractInfoArray[i].description);
        nft = {level:trial.version,image:trial.descriptor,nftId:nftAddressList[i]};
        userNftList.push(nft);
      }
      catch(e){
        console.log(e);
      }
        if(i === contractInfoArray.length-1){
          setCount(100);   
          setTimeout(() => {
            setMyNfts(userNftList);
            setLoadingNft(false);
          },1000);
        }
      }
      if(contractInfoArray.length === 0){
        setCount(100);   
        setTimeout(() => {
          setMyNfts(userNftList);
          setLoadingNft(false);
        },1000);
    }



};




useEffect(() => {
  if(nftLoaded.current ===true){
    console.log("loaded nft");
  }
  else{
    nftLoaded.current = true;
    try{
      loadNftList();
    }
    catch(e){
      alert("It seems like some error has occured. We would be grateful if you could report it to us");
      navigate("/home");
    }
  }
}, []);


  
  useEffect(() => {
    // const incrementInterval = 240000 / 96; // Time divided by the number of increments
    const incrementInterval = 50000 / 100;
    if(count < 99){
        const timer = setInterval(() => {
            console.log(count);
                console.log("count is ",count);
                setCount((prevCount) => prevCount + 1);
        }, incrementInterval);

        return () => {
        clearInterval(timer);
        };
    }
  }, [count]);


  useEffect(() => {
    if (count >= 100) {

      // const timeout = setTimeout(() => {
      //   setIsLoading(false);
      //   navigate('/generateFreeNFT');
      // }, 1000);

      // timeout
  
      // return () => {
      //   clearTimeout(timeout);
      // };
    }
  }, [count]);




  const content: JSX.Element = (
    <div className="screen">
    <div className="bettermidapp-generate-free-nft-minting">
      <div className="bg_2-JdJl2l">
          {/* <img className="bg-7ckAMs" src="img/loadingMinting/bg-11@1x.png" alt="BG" /> */}
          {/* <div className="loader-7ckAMs">
            <div className="x001-loading-u5QZHJ">
                <div className="x107-MxmV9X"></div>
                <div className="x108-MxmV9X"></div>
                <div className="x109-MxmV9X"></div>
                <div className="x110-MxmV9X"></div>
                <div className="x111-MxmV9X"></div>
                <div className="x112-MxmV9X"></div>
                <div className="x113-MxmV9X"></div>
                <div className="x114-MxmV9X"></div>
                <div className="x115-MxmV9X"></div>
            </div>
          </div> */}
          {/* <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> */}
          <div className="mimi-loading">
            <img className='mimi-loading-image' src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="" />
          </div>
          <div className="x50-7ckAMs">{count}%</div>
          {/* <a href="bettermidapp-settings-1.html">
            <div className="ic_settings_24px-7ckAMs ic_settings_24px">
                <img
                  className="ic_settings_24px-alZAUJ ic_settings_24px"
                  src="img/loadingMinting/ic-settings-24px-1@1x.png"
                  alt="ic_settings_24px"
                  />
            </div>
          </a> */}
          {/* <a href="bettermidapp-ai-coach.html">
            <div className="ic_sentiment_very_satisfied_24px-7ckAMs ic_sentiment_very_satisfied_24px">
                <img
                  className="ic_sentiment_very_satisfied_24px-VxvOOd ic_sentiment_very_satisfied_24px"
                  src="img/loadingMinting/ic-sentiment-very-satisfied-24px-1@1x.png"
                  alt="ic_sentiment_very_satisfied_24px"
                  />
            </div>
          </a> */}
      </div>
      {/* <a href="javascript:history.back()">
          <div className="icon-arrow-left-JdJl2l icon-arrow-left">
            <img
                className="icon-arrow-left-cQ3AYZ icon-arrow-left"
                src="img/loadingMinting/icon-arrow-left-10@1x.png"
                alt="icon-arrow-left"
                />
          </div>
      </a> */}
      {/* <div className="bars-status-bar-i-phone-light-JdJl2l">
          <div className="frame-PAFj23"></div>
          <div className="status-bar-PAFj23">
            <div className="battery-9cGPS4">
                <div className="border-IlCvJx"></div>
                <img className="cap-IlCvJx" src="img/loadingMinting/cap-1@1x.png" alt="Cap" />
                <div className="capacity-IlCvJx"></div>
            </div>
            <img className="wifi-9cGPS4" src="img/loadingMinting/wifi-1@1x.png" alt="Wifi" />
            <img className="cellular-connection-9cGPS4" src="img/loadingMinting/cellular-connection-1@1x.png" alt="Cellular Connection" />
            <div className="time-style-9cGPS4">
                <div className="time-fIdwUD sfprotext-semi-bold-white-15px">9:41</div>
            </div>
          </div>
      </div> */}
      <div className="minting-JdJl2l inter-normal-white-15px">loading your NFTs</div>
      <div className="reminder-text-1 inter-normal-white-15px">Please wait patiently<br/>and do not refresh the page</div>
      {/* <div className="reminder-text-2 inter-normal-white-15px">and do not refresh the page</div> */}
    </div>

    </div>
  )
  

  return (
    <CenterLayout
      content={content}
      bgImg={false}
    />
  )
};

export default LoadingMintingMyNftList;
