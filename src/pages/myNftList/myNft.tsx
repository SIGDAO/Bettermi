import * as React from "react";
import "./myNftList.css";
import { useSelector } from "react-redux";
import { accountId, accountPublicKey } from "../../redux/account";
import { useState } from "react";
import { useEffect } from "react";
import { useAppSelector } from "../../redux/useLedger";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import { P2PTransferNftToken } from "../../components/p2pTransferNftToken";
import { useNavigate } from "react-router-dom";
import { CheckNftOwnerId } from "../../NftSystem/updateUserNftStorage";
import { UpdateUserIcon } from "../../NftSystem/updateUserNftStorage";
import { selectCurrentUsername } from "../../redux/profile";
import { selectedNftInfo } from "../allNftList/indexAllNftList";
import IPFSImageComponent from "../../components/ipfsImgComponent";
import { convertWordToNumber } from "../../NftSystem/Reward/getRewardPercentage";
import { getApiUrls } from "../../components/constants/constant";

interface MyNftProps {
  image: string;
  level: string;
  isOpenPopup: boolean;
  setIsOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  nftId: string;
  setSelectedAssetId: React.Dispatch<React.SetStateAction<string>>;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  isUpdatingDescription: boolean;
  setIsUpdatingDescription: React.Dispatch<React.SetStateAction<boolean>>;
  isOtherUser: boolean;
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNft: React.Dispatch<React.SetStateAction<selectedNftInfo>>;
  isGuest?: boolean;
}

const MyNft: React.FunctionComponent<MyNftProps> = (props) => {
  const { image, level, isOpenPopup, setIsOpenPopup, nftId, setSelectedAssetId, setLevel, isUpdatingDescription, setIsUpdatingDescription, isOtherUser, setOpenModel, setSelectedNft, isGuest } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [imgAddress, setImgAddress] = useState<string>("");
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const userAccountpublicKey: string = useSelector(accountPublicKey);
  const userAccountId: string = useSelector(accountId);
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [nftLevel, setNftLevel] = useState<string>("");
  const [nftNumber, setNftNumber] = useState<string>("");
  const [reward, setReward] = useState<string>("");
  const name = useAppSelector(selectCurrentUsername);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getApiUrls(image).imgAddress);
        const text = await response.text();
        const nftInfo = JSON.parse(text);
        const matches = nftInfo.name.match(/(\d+)/);
        const nftNumber = matches[0].toString().padStart(8, "0");
        setNftNumber(nftNumber);

        if (nftInfo.description.includes("1")) {
          setNftLevel("1");
        } else if (nftInfo.description.includes("2")) {
          setNftLevel("2");
        } else if (nftInfo.description.includes("3")) {
          setNftLevel("3");
        }

        const level = convertWordToNumber(nftInfo.attributes[6].value);
        if (!isNaN(level)) {
          setReward((level / 3).toFixed(2).toString());
        } else {
          setReward("");
        }

        setImgAddress(nftInfo.media[0].social);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [image]);
  
  const equipNft = async () => {
    if (isOtherUser) return;

    try {
      const nftOwner = await CheckNftOwnerId(ledger2, nftId);
      if (nftOwner === userAccountId) {
        await UpdateUserIcon(ledger2, imgAddress, nftId, userAccountId, userAccountpublicKey, Wallet, name);
        setIsUpdatingDescription(true);
      } else {
        alert("We are sorry, it seems like you still don't own this NFT, maybe wait for a few more minutes if you just received it revcently");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const transferToken = async () => {
    P2PTransferNftToken(Wallet, nodeHost, process.env.REACT_APP_NFT_DISTRIBUTOR, nftId, userAccountpublicKey);
  };

  const nftButtonDisplay = () => {
    if (isGuest) {
      return (
        <div className="myNftBottom-guest">
          <div className="all-nft-list-connect-wallet-button inter-semi-bold-white-10px" onClick={() => setOpenModel(true)}>
            Connect Wallet
          </div>
        </div>
      );
    }

    return (
      <div className="myNftBottom">
        <button className={isOtherUser === true ? "myNftButtonDisabled" : "myNftButton"} onClick={equipNft}>
          Available
        </button>
        <img
          onClick={() => {
            setIsOpenPopup((prev) => !prev);
            setSelectedAssetId(nftId);

            setLevel(nftLevel);
          }}
          className={isOtherUser ? "myNftButtomArrowDisabled" : "myNftButtomArrow"}
          src={`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`}
        />
      </div>
    );
  };

  return (
    <>
      {loading || imgAddress === "" ? (
        <div>loading</div>
      ) : (
        <div className="myNftList">
          <IPFSImageComponent
            onClick={() => {
              setOpenModel(true);
              const nftInfo: selectedNftInfo = {
                imageUrl: imgAddress,
                nftLevel: nftLevel,
                nftPrice: "0",
                nftReward: reward,
                nftNumber: nftNumber ? nftNumber : "-1",
              };

              setSelectedNft(nftInfo);
            }}
            className="myNftImage"
            imgAddress={imgAddress}
          />

          <div className="myNftDescription">
            <div className="myNftNumber">#{nftNumber}</div>
            <div className="myNftBar">
              <div className="myNftLevel">Lv{nftLevel}</div>
              <div className="myNftVerticalLine"></div>
              <div className="myNftListRewardPercentage">Reward + {reward}%</div>
            </div>
            <div className="myNftPrice">$0 SIGNA</div>
          </div>
          {nftButtonDisplay()}
          {/* <div className="myNftBottom">
            <button className={isOtherUser === true ? "myNftButtonDisabled" : "myNftButton"} onClick={equipNft}>
              Available
            </button>
            <img
              onClick={() => {
                setIsOpenPopup((prev) => !prev);
                setSelectedAssetId(nftId);

                setLevel(nftLevel);
              }}
              className={isOtherUser ? "myNftButtomArrowDisabled" : "myNftButtomArrow"}
              src={`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`}
            />
          </div> */}
        </div>
      )}
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
