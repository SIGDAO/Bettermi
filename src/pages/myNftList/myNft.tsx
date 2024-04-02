import * as React from 'react';
 import './myNftList.css'
 import { CenterLayout } from '../../components/layout';
 import { Link } from 'react-router-dom';
 import { BackButton } from '../../components/button';
 import { GetToken } from '../../components/getToken';
 import { useSelector } from 'react-redux';
 import { accountId, accountPublicKey } from '../../redux/account';
 import CSS from 'csstype';
 import { ShortTitleBar } from '../../components/titleBar';
 import { Col,Row,Card,CardText,CardTitle,Button,CardImg,} from 'reactstrap';
 import { useLedger } from '../../redux/useLedger';
 import { useState } from 'react';
 import { useEffect } from 'react';
 import { useAppSelector } from '../../redux/useLedger';
 import { selectWalletNodeHost } from '../../redux/useLedger';
 import { LedgerClientFactory } from '@signumjs/core';
 import { useContext } from 'react';
 import { AppContext } from '../../redux/useContext';
 import { P2PTransferNftToken } from '../../components/p2pTransferNftToken';
 import { useNavigate } from 'react-router-dom';
 import { CheckNftOwnerId } from '../../NftSystem/updateUserNftStorage';
 import { UpdateUserIcon } from '../../NftSystem/updateUserNftStorage';
import { selectCurrentUsername } from '../../redux/profile';
import { selectedNftInfo } from '../allNftList/indexAllNftList';
import IPFSImageComponent from '../../components/ipfsImgComponent';

 interface MyNftProps {
    image:string;
    level:string;
    isOpenPopup: boolean;
    setIsOpenPopup: (isOpenPopup: boolean) => void;
     nftId:string;
     setSelectedAssetId:(nftId:string) => void;
    setLevel:(level:string) => void;
    isUpdatingDescription:boolean;
    setIsUpdatingDescription:(isUpdatingDescription:boolean) => void;
    isOtherUser:boolean;
    setOpenModel:(openModel:boolean) => void;
    setSelectedNft:(selectedNft:selectedNftInfo) => void;
 }


 const MyNft: React.FunctionComponent<MyNftProps> =  (props) => {
     const {image, level, isOpenPopup, setIsOpenPopup,nftId,setSelectedAssetId,setLevel,isUpdatingDescription,setIsUpdatingDescription,isOtherUser,setOpenModel,setSelectedNft} = props;
     const [loading, setLoading] = useState<boolean>(true);
     const [imgAddress, setImgAddress] = useState<string>("");
     const nodeHost = useSelector(selectWalletNodeHost);
     const ledger2 = LedgerClientFactory.createClient({nodeHost});
     const userAccountpublicKey:string = useSelector(accountPublicKey);
     const userAccountId:string = useSelector(accountId);
     const {appName,Wallet,Ledger} = useContext(AppContext);
     const [nftLevel,setNftLevel] = useState<string>("");
     const [nftNumber,setNftNumber] = useState<string>("");
     const [reward,setReward] = useState<string>("");
     const name = useAppSelector(selectCurrentUsername);
     const navigate = useNavigate();
     var nftImgAddress:string = "";
     var addressSuffix:string ="https://ipfs.io/ipfs/"; 
     useEffect(() => {

         // Function to fetch data from the APIc

         fetch(`https://ipfs.io/ipfs/${image}`).then((res)=>{
             res.text().then((text)=>{

                 var nftInfo = JSON.parse(text);
                 let matches = nftInfo.name.match(/(\d+)/);

                 const nftNumber:string = matches[0].toString().padStart(8, '0');
                 setNftNumber(nftNumber);
                //  setNftLevel(nftInfo.attributes[0].level);

                 if(nftInfo.description.includes("1") === true){
                  setNftLevel("1");
                  setReward("10"); //To be confirmed
                 }
                 if(nftInfo.description.includes("2") === true){
                  setNftLevel("2");
                  setReward("15");//To be confirmed
                 }
                 if(nftInfo.description.includes("3") === true){
                  setNftLevel("3");
                  setReward("20");//To be confirmed
                 }


                 setImgAddress(nftInfo.media[0].social);
                 nftImgAddress = nftInfo.media[0].social; 


                 nftImgAddress = addressSuffix.concat(nftImgAddress);

                 setLoading(false);
             }).catch((e:any) => {console.log(e);});

         }).catch((e:any) => {console.log(e);});

         // Call the fetchData function

         // Optional cleanup function (not needed in this case)
         // If you had any subscription or timers, you'd clean them up here

         // Since we want the effect to run only once (on mount), we pass an empty dependency array
       }, [image]);
     const test = (abc:string) => {

         return 1;
     }
     const equipNft = async() => {
      try{
            const nftOwner = await CheckNftOwnerId(ledger2,nftId);
            if(nftOwner === userAccountId){
              await UpdateUserIcon(ledger2,imgAddress,nftId,userAccountId,userAccountpublicKey,Wallet,name);
              setIsUpdatingDescription(true);
            }
            else{
              alert("We are sorry, it seems like you still don't own this NFT, maybe wait for a few more minutes if you just received it revcently");
            }
          }
          catch(e){
            console.log(e);
          }
     };
     const transferToken = async() => {
      P2PTransferNftToken(Wallet,nodeHost,process.env.REACT_APP_NFT_DISTRIBUTOR,nftId,userAccountpublicKey);
     };
   return(
      <>
      {loading?(<div>loading</div>):(
          imgAddress === ""?(<div>loading</div>):(

                  <div className = "myNftList">
                    <IPFSImageComponent onClick = {
                      () =>{
                        setOpenModel(true);const nftInfo:selectedNftInfo={
                          imageUrl:imgAddress,
                          nftLevel:nftLevel,
                          nftPrice:"0",
                          nftReward:"5",
                          nftNumber:nftNumber?nftNumber:"-1",
                        }

                        setSelectedNft(nftInfo);
                      }
                      } className = "myNftImage" imgAddress = {`https://ipfs.io/ipfs/${imgAddress}`}></IPFSImageComponent>

                    <div className = "myNftDescription">
                    <div className = "myNftNumber">#{nftNumber}</div>
                      <div className = "myNftBar">
                        <div  className = "myNftLevel">
                          Lv{nftLevel}       
                          </div>
                          <div className = "myNftVerticalLine"></div>  
                          <div  className = "inter-normal-white-12px">
                            Reward + 5%
                            </div>
                      </div>
                      <div className = "myNftPrice">
                        $0 SIGNA
                      </div>
                    </div>
                    <div className = "myNftBottom">
                    {isOtherUser === true?(
                      <>
                        <button className = "myNftButtonDisabled" onClick = {equipNft}>Available</button>
                        <img 
                          onClick={() => {
                            setIsOpenPopup((prev) => !prev);
                            setSelectedAssetId(nftId);

                            setLevel(nftLevel);
  
                          }} 
                          className = "myNftButtomArrowDisabled" 
                          src  = {`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`}
                        />
                        </>
                    ):(
                      <>
                          <button className = "myNftButton" onClick = {equipNft}>Available</button>
                          <img 
                            onClick={() => {
                              setIsOpenPopup((prev) => !prev);

                              setSelectedAssetId(nftId);
                              setLevel(nftLevel);

                            }} 
                            className = "myNftButtomArrow" 
                            src  = {`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`}
                          />
                        </>
                    )
                    }

                    </div>
                  </div>
          )
        )

      }
       </>
         );

     // return (
     //   <CenterLayout
     //     content={content}
     //     bgImg={false}
     //   />
     // );"{"version":1,"descriptor":"QmNhdiqCRXzoVm3pn5eaqvudAjbWsavwqi6a6Bs7ZL5WeE"}"
   };

   export default MyNft;