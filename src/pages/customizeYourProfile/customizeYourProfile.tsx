import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import "./customizeYourProfile.css";
import { profileSlice, selectCurrentNFTImageAddress } from "../../redux/profile";
import { store } from "../../redux/reducer";
import { RandomGenNameInput } from "../../components/input";
import path from "path";
import { UpdateUserIcon } from "../../NftSystem/updateUserNftStorage";
import { useLedger } from "../../redux/useLedger";
import { useSelector } from "react-redux";
import { accountId, accountSlice } from "../../redux/account";
import { accountPublicKey } from "../../redux/account";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import IPFSImageComponent from "../../components/ipfsImgComponent";
import { selectCurrentNFTId } from "../../redux/profile";


interface ICustomizeYourProfileProps {}

const CustomizeYourProfile: React.FunctionComponent<ICustomizeYourProfileProps> = (props) => {
  // todo: help it to change to nft image IFPS link
  // maybe store the path in redux as well
  const ledger = useLedger();
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const defaultName = "Enter your name";
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = useLocation();


  const nftImage = location.state?.nftImageAddress;
  const nftImageAddressFormRedux = useSelector(selectCurrentNFTImageAddress);
  const nftId = location.state?.nftId;
  const nftIdFormRedux = useSelector(selectCurrentNFTId);
  const userAccountId = useSelector(accountId);
  const userAccountpublicKey = useSelector(accountPublicKey);
  const [minted, setMinted] = useState<boolean>(false);
  const NFTMachineCodeHash = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;



  const getNftContractStorage = async () => {
    let senderNftStorage = await ledger?.contract.getContractsByAccount({
      accountId: userAccountId,
      machineCodeHash: NFTMachineCodeHash,
    });

    if (!senderNftStorage) return null;

    if (senderNftStorage.ats[0] != null) {
      store.dispatch(accountSlice.actions.setNftContractStorage(senderNftStorage.ats[0].at));
    }
  };

  useEffect(() => {
    getNftContractStorage();
  }, []);

  // when user press "Save", putting the generated name into local storage
  const [name, setName] = useState<string>("");

  const handleSave = async () => {
    try {
      if (!minted) {
        console.log("minting", nftImageAddressFormRedux, nftIdFormRedux);
        await UpdateUserIcon(ledger, nftImageAddressFormRedux, nftIdFormRedux, userAccountId, userAccountpublicKey, Wallet, name);
        
      }
      if (!name) {
        localStorage.setItem("name", defaultName);
        store.dispatch(profileSlice.actions.setUsername(defaultName));
      } else {
        localStorage.setItem("name", name);
        store.dispatch(profileSlice.actions.setUsername(name));
      }
      navigate("/profile");
    } catch (error) {
      console.log(error);
      if (error.name !== "ExtensionWalletError") {
        navigate("/errorCustomizeYourProfile");
      }
      setMinted(false);
    }
  };

  const content: JSX.Element = (
    <div>
      {/* <BackButton /> */}
      <div className="title-Gzrq3v-container">
        <h1 className="title-Gzrq3v">Customize your profile</h1>
      </div>
      <div className="pick-a-username-Gzrq3v">PICK A USERNAME</div>
      <p className="reserve-your-name-before-its-taken-Gzrq3v">Reserve your @name before it's taken.</p>
      {/* <img className="photo-Gzrq3v" src={`https://ipfs.io/ipfs/${nftImage|| nftImageAddressFormRedux}` || `${process.env.PUBLIC_URL}/img/mimi.png`} alt="Photo" /> */}
      <IPFSImageComponent
        imgAddress={nftImageAddressFormRedux}
        className="photo-Gzrq3v"
      />
      <div className="search-bar-container-customizeYourProfile">
        <RandomGenNameInput name={name} setName={setName} />
      </div>
      <div className="button_-save-Gzrq3v" onClick={handleSave}>
        <div className="button1-S5Obts"></div>
        <div className="continue-S5Obts">Done!</div>
      </div>
    </div>
  );

  return <CenterLayout bgImg={false} content={content} />;
};

export default CustomizeYourProfile;
