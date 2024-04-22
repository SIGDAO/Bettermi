import * as React from 'react';
import './importAccountScreens.css';
import { Link } from 'react-router-dom';
import { CustomTextArea } from './input';
import { useState } from 'react';
import { CheckNftOwnerId } from '../NftSystem/updateUserNftStorage';
import { updateReceiverAccount } from '../NftSystem/updateUserNftStorage';
import { useAppSelector } from '../redux/useLedger';
import { selectWalletNodeHost } from '../redux/useLedger';
import { LedgerClientFactory } from '@signumjs/core';
import { accountId } from '../redux/account';
import { Button } from 'reactstrap';
import { TransferNft } from '../NftSystem/transferNft';
import { selectCurrentGender } from '../redux/profile';
import { useSelector } from 'react-redux';

export interface IimportAccountScreensProps {
    setIsOpenImport: (isOpenImport: boolean) => void;
    isOpenImport: boolean;
    importSuccess:boolean;
    setImportSuccess: (importSuccess: boolean) => void;
}

const ImportAccountScreen: React.FC<IimportAccountScreensProps> = (props) => {
    const {setIsOpenImport,isOpenImport,importSuccess,setImportSuccess} = props;
    const [inputAddress, setInputAddress] = useState<string>("");
    const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
    const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
    const [hasError, setHasError] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);
    const nodeHost = useSelector(selectWalletNodeHost);
    const userAccountId = useSelector(accountId);
    const gender = useSelector(selectCurrentGender)
    const ledger2 = LedgerClientFactory.createClient({ nodeHost });
    const mimiNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_MIMI!.split(",");

    const ioNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_IO!.split(",");
    const importNft = async (ledger2:any,nftAddress:string,userAccountId:string) => {
        setLoading(true);
        // if(nftAddress === "nft"){
        //     if(gender === "Female"){
        //         await TransferNft(ledger2,userAccountId,mimiNftStorageAccounts,codeHashIdForNft,nftDistributor);
        //     }
        //     if(gender === "Male"){
        //         await TransferNft(ledger2,userAccountId,ioNftStorageAccounts,codeHashIdForNft,nftDistributor);
        //     }
        //     setLoading(false);
        //     setImportSuccess(true);
        //     setIsOpenImport(false);
        // }
        // else{
                try{
                    let accountDes = await ledger2.account.getAccount({accountId:nftAddress});
                    const nftId = accountDes.account;
                    const nftOwnerId = await CheckNftOwnerId(ledger2,nftId);
                    if(nftOwnerId === userAccountId){
                        const result = await updateReceiverAccount(ledger2,userAccountId,codeHashIdForNft,nftId,nftDistributor);
                        if(result === "unsuccessful"){
                            setHasError(true);
                            setLoading(false);
                        }
                        else{
                        setLoading(false);
                        setImportSuccess(true);
                        setIsOpenImport(false);
                        }
                        }
                        else{
                        setHasError(true);
                        setLoading(false);
                    }
                }
                catch(e){

                    setHasError(true);
                    setLoading(false);
                    console.log(e);
                }
        // }
      }
  

    //   React.useEffect(() => {
    //     if(hasError === true){
    //         <p className="importAccount-hasError">
    //         Please input the contract Address of the NFT you have bought on signumart. 
    //         </p>
    //     }
    //     else{
    //         <p className="importAccount-noError">
    //         Please input the contract Address of the NFT you have bought on signumart. 
    //         </p>
    //     }
    // },[hasError]);
  return (

        <div className="importAccount-layer">
            <div className="importAccount-icon-arrow-left-3" onClick={() => setIsOpenImport(!isOpenImport)}>
                <img className="importAccount-icon-arrow-left" src="img/importAccount/importAccount-icon-left.png" alt="icon-arrow-left" />
            </div>
            <div className="importAccount">
                <div className="overlap-group1-1">
                    <img className="seperate-line-importAccount-1" src="img/importAccount/seperate-line-14@1x.png" alt="Seperate line" />
                    <img className="importAccountbg" src="img/importAccount/bg-11@1x.png" alt="BG" />
                    <img className="importAccount-seperate-line" src="img/importAccount/seperat-line-10@1x.png" alt="Seperat line" />
                    <div className="importAccountrewards">
                        <div className="ic_add-1 ic_add-3">
                            <div className="importAccount-overlap-group-1">
                                <img className="importAccountadd" src="img/importAccount/add-1@1x.png" alt="Add" />
                                <img className="importAccountic_add" src="img/importAccount/ic-add-1@1x.png" alt="ic_add" />
                            </div>
                        </div>
                        <div className="importAccount-import-your-nft">
                            Import Your NFT
                        </div>
                    </div>

                    {loading === false &&

                        <div className="your-n-ft-id">YOUR NFT ID</div>
                    }
                    {loading === false &&
                        <CustomTextArea 
                        text= {inputAddress} 
                        setText={setInputAddress} 
                        width={300} 
                        height={56} 
                        importClassName="card-number-1 importAccount_search_bar-1 importAccount_search_bar-4"
                        activeClassName="active-card-number-1 importAccount_search_bar-1 importAccount_search_bar-4"
                        placeholder="#0000000001"/>
                    }
                    {loading === false &&
                        <>
                            {hasError && 
                                <div className="importAccounterror_icon">
                                <div className="importAccountx-container">
                                    <img className="importAccountx11692" src="img/importAccount/file---11692@1x.png" alt="11692" />
                                    <img className="importAccountx11693" src="img/importAccount/file---11693@1x.png" alt="11693" />
                                </div>
                                </div>
                                }
                            <Button className="importAccountbutton_save" onClick = {() =>  {importNft(ledger2,inputAddress,userAccountId)}}>
                                {hasError === false?
                                    <div className="importAccountcontinue" >
                                        Import Your NFT
                                    </div>:
                                    (
                                    <div className="importAccountcontinue" >
                                        Import Again
                                    </div>
                                    )}
                            </Button>
                            <div className="importAccount-error-message">
                                {(hasError === false) &&
                                    <p className="importAccount-noError">
                                    Please input the contract Address of the NFT you have bought on signumart. 
                                    </p>
                                }
                                {(hasError === true) &&
                                        <>
                                            <p className="importAccount-hasError">
                                            Please input the contract Address of the NFT you have bought on signumart. 
                                            </p>
                                            
                                        </>
                                    
                                    }
                            </div>
                        </>
                    }
                {loading === true &&
                <>
                    <div className="your-n-ft-id">
                        Importing...
                    </div>
                    <div className="importAccount-error-message">
                        <img className = "importAccountLoadingPage"src = "img/importAccount/mimi-dancing-for-loading-page.png">

                        </img>
                        <p className="importAccount-noError">
                            Please input the contract Address of the NFT you have bought on signumart. 
                        </p>
                    </div>
                    <Button className="importAccountbutton_save" onClick = {() =>  {importNft(ledger2,inputAddress,userAccountId)}}><div className="importAccountcontinue" >Loading...</div></Button>
                </>
                }


            </div>
        </div>
    </div>

  );
}

export default ImportAccountScreen;

