import * as React from 'react';
import { BackButton, DisabledButton } from '../../components/button';
import { GenderSelect } from '../../components/select';
import { useNavigate } from 'react-router-dom';
import { useLedger } from '../../redux/useLedger';
import { Api } from '@reduxjs/toolkit/dist/query';
import { UnsignedTransaction } from "@signumjs/core";
import { useContext } from 'react';
import { AppContext } from '../../redux/useContext';
import { accountPublicKey } from '../../redux/account';
import { useSelector } from 'react-redux';
import { accountId } from '../../redux/account';
import { accountSlice } from '../../redux/account';
import { store } from '../../redux/reducer';
import { selectCurrentGender } from '../../redux/profile';
import { error } from 'console';
import { Contract,ContractDataView } from '@signumjs/contracts';
import { selectWalletNodeHost } from '../../redux/useLedger';
import { TransferNftTokenOwnershipFinale } from '../../components/transferNftTokenFinale';
interface IAnimaGenContentProps {
  BMI: string;    // the BMI value, can be string or number
  selfie?: string; // the selfie image url
}


// no need to look inside, it's too massy
// just look at the IAnimaGenContentProps, thats all u need to know
const AnimaGenContent: React.FunctionComponent<IAnimaGenContentProps> = (props) => {
  const {BMI, selfie} = props;
  const [minted, setMinted] = React.useState(false); // whether the user has minted the NFT
  const navigate = useNavigate();
  const ledger = useLedger();
  const {appName,Wallet,Ledger} = useContext(AppContext);
  const publicKey = useSelector(accountPublicKey);
  const userAccountId = useSelector(accountId);
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace(/['"]+/g, '');
  const gender = useSelector(selectCurrentGender);
  const nodeHost = useSelector(selectWalletNodeHost);
  const assetId = process.env.REACT_APP_TOKEN_ID!;

  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR;
  const NEXT_PUBLIC_NFT_CONTRACT_METHOD_TRANSFER:string= "-8011735560658290665";
  const handleMint = async () => {
  }


  const confirm = async () => {
    if (minted){

      return
    }

    if(ledger){


      /*Get the particular NFT*/  

      TransferNftTokenOwnershipFinale(nodeHost,userAccountId);   


      setMinted(true);
      const asset = await ledger.asset.getAssetHolders({assetId:assetId});
      asset.accountAssets.map((obj)=>{
        if(obj.account == userAccountId){
          store.dispatch(accountSlice.actions.setToken(Number(obj.quantityQNT)/1000000));
          localStorage.setItem('token',obj.quantityQNT);

        }
      });

      let ourContract = await ledger.contract.getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: codeHashId,
      });


      let storeNftContract = await ledger.contract.getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: process.env.REACT_APP_NFT_MACHINE_CODE_HASH!,
      });




      try {
        if(storeNftContract.ats[0] == null){

          const initializeNftContract = await ledger.contract.publishContractByReference({
            name: "NFT",
            description:"storage_space_for_your_nft",
            referencedTransactionHash:process.env.REACT_APP_NFT_CONTRACT_REFERENCED_TRANSACTION_FULL_HASH!,
            feePlanck:"30000000",
            senderPublicKey:publicKey,
            deadline:1440,}) as UnsignedTransaction;

          await Wallet.Extension.confirm(initializeNftContract.unsignedTransactionBytes);

        }
        if(ourContract.ats[0] == null){

          const initializeContract = await ledger.contract.publishContractByReference({
            name: "BMI",
            description: `{'bmi': ${BMI}, 'gender': ${gender}, 'time': ${new Date()}}`,  //the first data is hidden in the description
            referencedTransactionHash:"62502D4233CA88EB7896031ACF4D729F4C6A570187161CA00FF291ED382769FD",
            feePlanck:"30000000",
            senderPublicKey:publicKey,
            deadline:1440,}) as UnsignedTransaction;

          await Wallet.Extension.confirm(initializeContract.unsignedTransactionBytes);
          // while(ourContract.ats[0] == null){
          //   setTimeout( async function(){
          //     ourContract = await ledger.contract.getContractsByAccount({
          //       accountId: userAccountId,
          //       machineCodeHash: codeHashId,
    
          //       });

          //   }, 15000 );
          // }
    /*
          const sendBMI = await ledger.message.sendMessage({
            message: BMI_test,
            messageIsText: true,
            recipientId: ourContract.ats[0].at,
            feePlanck: "1000000",
            senderPublicKey: publicKey,
            deadline: 1440,
            }) as UnsignedTransaction;
          await Wallet.Extension.confirm(sendBMI.unsignedTransactionBytes);*/
            
  
        } else{ //check whether the user has registered an account
          const sendBMI = await ledger.message.sendMessage({
            message: JSON.stringify({
              'bmi': BMI,
              'gender': gender,
              'time': new Date(),
            }) ,
            messageIsText: true,
            recipientId: ourContract.ats[0].at,
            feePlanck: "1000000",
            senderPublicKey: publicKey,
            deadline: 1440,
        }) as UnsignedTransaction;
        await Wallet.Extension.confirm(sendBMI.unsignedTransactionBytes);
        }

        navigate('/generateFreeNFT');
      } catch (error) {
        console.log(error);
        setMinted(false);
      }
    }
  }


  return (
    <>
      <BackButton/>
      <img className="bmi-photo" src={selfie? selfie : `${process.env.PUBLIC_URL}/img/mimi.png`}  alt="dfd" />
      <h1 className="bmi-result inter-semi-bold-white-28px">Your BMI Result :</h1>
      <div className="bmi-display-container">
        <div className="flex-row">
          <div className="text-2">{BMI}</div>
          <div className="kgm2">
            <span className="inter-normal-cadet-blue-14px">kg/m</span>
            <span className="inter-normal-cadet-blue-14px">²</span>
          </div>
        </div>
        <div className="bmi-bar">
          <div className="overlap-group1">
            <div className="x42"></div>
            <div className="x43"></div>
            <div className="x44"></div>
            <div className="x45"></div>
            <img className="x546" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---546@1x.png`} alt="546" />
            <img className="x547" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---546@1x.png`} alt="547" />
            <img className="x548" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---546@1x.png`} alt="548" />
            <img className="x549" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---546@1x.png`} alt="549" />
            <img className="x550" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---546@1x.png`} alt="550" />
            <img className="x555" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="555" />
            <img className="x556" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="556" />
            <img className="x560" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="560" />
            <img className="x561" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="561" />
            <img className="x610" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="610" />
            <img className="x562" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="562" />
            <img className="x609" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="609" />
            <img className="x563" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="563" />
            <img className="x608" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="608" />
            <img className="x564" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="564" />
            <img className="x565" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="565" />
            <img className="x566" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="566" />
            <img className="x607" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="607" />
            <img className="x567" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="567" />
            <img className="x606" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="606" />
            <img className="x568" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="568" />
            <img className="x605" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="605" />
            <img className="x569" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---569@1x.png`} alt="569" />
            <img className="x570" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="570" />
            <img className="x571" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="571" />
            <img className="x572" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="572" />
            <img className="x573" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="573" />
            <img className="x574" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="574" />
            <img className="x575" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="575" />
            <img className="x576" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="576" />
            <img className="x577" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="577" />
          </div>
          <div className="overlap-group">
            <div className="x48"></div>
            <img className="x622" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="622" />
            <img className="x623" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="623" />
            <img className="x624" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="624" />
            <img className="x625" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="625" />
            <img className="x626" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="626" />
          </div>
          <img className="x612" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---546@1x.png`} alt="612" />
          <img className="x611" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="611" />
          <img className="x621" src={`${process.env.PUBLIC_URL}/img/generateBMI/file---555@1x.png`} alt="621" />
        </div>
      </div>
      <div className="select-your-biological-sex">SELECT YOUR BIOLOGICAL SEX:</div>
      {/* select - sex */}
      <GenderSelect options={[{"label": "Female", "value": "1"}, {"label": "Male", "value": "2"}]} title="Female" onSelect={(e) => console.log(e)} />
      <div className="bottom-controls">
        <p className="your-selection-cannot-be-changed-later inter-normal-white-15px">
          Your selection cannot be changed later.
        </p>
        {minted ? 
          <DisabledButton text="connecting..." height='56px' width='248px' />
        :
          <div className="button_-confirm" onClick={confirm}>
            <div className="confirm-bmi inter-semi-bold-white-15px" >Mint</div>
          </div>
        }
        
      </div>
    </>
  );
};

export default AnimaGenContent;
 