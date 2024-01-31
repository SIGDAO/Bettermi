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

export interface IimportSuccessScreensProps {

    importSuccess:boolean;
    setImportSuccess: (importSuccess: boolean) => void;
}

const ImportSuccessScreen: React.FC<IimportSuccessScreensProps> = (props) => {

    const {importSuccess,setImportSuccess} = props;

  return (
    <div className="importAccount-layer">
    <div className="importAccount-icon-arrow-left-3" onClick={() => setImportSuccess(false)}>
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
                    Import Success
                </div>
            </div>
            <div className="importSuccessCongrats">
                CONGRATULATIONS!
            </div>
            <div className="importAccount-error-message">
                <img className = "importAccountLoadingPage"src = "img/importAccount/mimiHeart.png">

                </img>
                <p className="importAccount-noError">
                    Your NFT is successfully imported to BetterMi.io Dapp.
                </p>
            </div>
            <Button className="importAccountbutton_save" onClick = {() =>  {setImportSuccess(false)}}>
                <div className="importAccountcontinue" >
                    Done
                </div>
            </Button>


    </div>
</div>
</div>
        );
}

export default ImportSuccessScreen;
