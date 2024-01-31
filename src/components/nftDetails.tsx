import * as React from "react";
import { useEffect } from "react";
import { generateMethodCall } from "@signumjs/contracts";
import { AttachmentMessage } from "@signumjs/core";
import { useContext } from "react";
import { AppContext } from "../redux/useContext";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { accountId } from "../redux/account";
import { accountPublicKey } from "../redux/account";
import { CenterLayout } from "./layout";
import { selectedNftInfo } from "../pages/allNftList/indexAllNftList";
interface AllNftProps {
  imgAddress?: selectedNftInfo;
  setPopUpIcon: (popUpIcon: boolean) => void;
  popUpIcon: boolean;
  disabled?:boolean;
}

const NftDetails: React.FunctionComponent<AllNftProps> = (props) => {
  const { imgAddress, setPopUpIcon, popUpIcon,disabled } = props;
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const userAccountId = useSelector(accountId);
  const codeHashIdForNft = process.env.REACT_APP_NFT_CONTRACT_MACHINE_CODE_HASH!;
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const nftDistributorPublicKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;
  const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
  const userAccountPublicKey = useSelector(accountPublicKey);

  return (
    <CenterLayout
      noScroll={true}
      content={
        <>{imgAddress == null?
            <>
            <img className="x0-generateFreeNFT" src={`https://ipfs.io/ipfs/bafkreigun2emdg5ndaavw2mmvocqwpdct2qcpb6kud7x76awln2cstodda`} alt="0" />
            {/* <h1 className="text-1">#{nftNumber}</h1> */}
  
            <div className="x16206">
              <div className="lv-1">LV {}</div>
              <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
              <div className="reward-10">REWARD +{}%</div>
            </div>
            {disabled ===true?
            <></>
            
            :<div className="x0-signa">${} SIGDAO</div>
      }
            <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
            <div onClick={() => setPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
            </>
            :
            <>
            <div style = {{display:'flex',alignItems:"center", justifyContent:"center",height:'100%',width:'100%'}}>
          <img className="x0-generateFreeNFT" src={`https://ipfs.io/ipfs/${imgAddress.imageUrl}`} alt="0" />
          <h1 className="text-1">#{imgAddress.nftNumber}</h1>
          
          <div className="x16206">
            <div className="lv-1">LV {imgAddress.nftLevel}</div>
            <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
            <div className="reward-10">REWARD +{imgAddress.nftReward}%</div>
          </div>
          {disabled?
          <></>
          :
          <div className="x0-signa">${imgAddress.nftPrice} SIGDAO</div>
      }
          <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
          <div onClick={() => setPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
          </div>
          </>
      }
          </>
      }
      bgImg={false}
      // noScroll={isOpen}
    />
  );
};

export default NftDetails;
