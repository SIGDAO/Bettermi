import React from "react";
import "./loadingMinting.css";
import { CenterLayout } from "../../components/layout";
import { useLedger } from "../../redux/useLedger";
import { useSelector } from "react-redux";
import { accountId, accountSlice } from "../../redux/account";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TransferNftToNewUser } from "../../NftSystem/transferNft";
import { FindLatestTransactionArray } from "../../NftSystem/updateUserNftStorage";
import { FindLatestTransactionNumber } from "../../NftSystem/updateUserNftStorage";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { isTodayHaveSelfieRecord } from "../../components/bmiCalculate";
import { store } from "../../redux/reducer";
import { profileSlice } from "../../redux/profile";
import axios from "axios";

interface ILoadingMintingProps {
  pathname: string;
}

const LoadingMinting: React.FunctionComponent<ILoadingMintingProps> = (props) => {
  const navigate = useNavigate();
  const ledger = useLedger();
  const userAccountId = useSelector(accountId);
  const nftCodeHashId = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!; // the code hash of the BMI contract
  const bmiCodeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!; // the code hash of the BMI contract
  console.log("nftCodeHashId", nftCodeHashId);
  console.log("bmiCodeHashId", bmiCodeHashId);
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const nftLoaded = useRef(false);
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const mimiNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_MIMI!.split(",");
  const ioNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_IO!.split(",");
  const pathname: string = props.pathname;

  const checkIfBMIcreated = async () => {
    if (!ledger) return;

    let bmiContract = await ledger.contract.getContractsByAccount({
      accountId: userAccountId,
      machineCodeHash: bmiCodeHashId,
    });

    let isTodayRecord = false

    while (true) {
      if (await isTodayHaveSelfieRecord(userAccountId, ledger)) break;
    }

    setCount(100);
    setIsLoading(false);
    navigate("/selfToEarn");
  }


  const checkIfNFTMinted = async () => {
    if (!ledger) return;
    // const startTime: number = Date.now(); // get the current time in milliseconds

    let nftContract = await ledger.contract.getContractsByAccount({
      accountId: userAccountId,
      machineCodeHash: nftCodeHashId,
    });
    let bmiContract = await ledger.contract.getContractsByAccount({
      accountId: userAccountId,
      machineCodeHash: bmiCodeHashId,
    });

    while (bmiContract.ats[0] == null) {
      bmiContract = await ledger.contract.getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: bmiCodeHashId,
      });
      nftContract = await ledger.contract.getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: nftCodeHashId,
      });
      console.log(nftContract);
      console.log(bmiContract);
    }
    var description: any;
    
    try {
       description = JSON.parse(bmiContract.ats[0].description);
    } catch (error) {
      try {
        const bmiEncrypteddata = bmiContract.ats[0].description;
        console.log(bmiEncrypteddata, "bmiEncrypteddata")
        description = await axios.post(process.env.REACT_APP_NODE_ADDRESS + '/decrypt', {
          data: bmiEncrypteddata,
        })
        description = description.data
      } catch (error) {
        alert("Cannot fetch the record, please contact system admin!")
        navigate('/')
      }
    }
    console.log("description is",description);
    console.log("description, gender is",description.gender)
    var gender = "Male";
    if (description.gender.includes("Female")) {
      gender = "Female";
    }
    if (gender === "Male") {
      console.log("called gender === Male");
      await TransferNftToNewUser(ledger, userAccountId, ioNftStorageAccounts, nftCodeHashId, nftDistributor);
    } else {
      await TransferNftToNewUser(ledger, userAccountId, mimiNftStorageAccounts, nftCodeHashId, nftDistributor);
    }
    console.log("gender is   ", gender);
    const latestTransactionNumber = await FindLatestTransactionNumber(ledger, nftContract.ats[0].at, nftDistributor);
    const latestTransactionList = await FindLatestTransactionArray(ledger, nftContract.ats[0].at, nftDistributor, latestTransactionNumber);
    console.log(latestTransactionList);
    console.log(latestTransactionList[0]);
    if (nftContract.ats[0] != null) {
      store.dispatch(accountSlice.actions.setNftContractStorage(nftContract.ats[0].at));
    }
    if (latestTransactionList.length === 0) {
      console.log("The latestTransactionList is empty, returned error", latestTransactionList);
      setCount(100);
      setIsLoading(false);
      navigate("/generateFreeNFT", { state: { nftId: "error" } });
    } else {
      setCount(100);
      setIsLoading(false);
      store.dispatch(profileSlice.actions.setNFTImageAddress(latestTransactionList[0]));
      navigate("/generateFreeNFT", { state: { nftId: latestTransactionList[0] } });
    }
  };

  useEffect(() => {
    if (nftLoaded.current === true) {
      console.log("loaded nft");
    } else {
      nftLoaded.current = true;
      if (pathname === "/loadingBMIDaily") {
        checkIfBMIcreated()
          .catch((err) => {
            console.error(err);
          })
        return;
      }
      checkIfNFTMinted().catch((err) => {
        console.error(err);
      });
    }
  }, []);

  useEffect(() => {
    const incrementInterval = 240000 / 96; // Time divided by the number of increments
    // const incrementInterval = 5000 / 100;
    const timer = setInterval(() => {
      console.log("count is",count);
      if (count < 100) {
        console.log("testing");
        setCount((prevCount) => {
          console.log("count is", prevCount);
          if (prevCount < 99) {
            console.log("testing");
            return prevCount + 1;
          }
          return prevCount;
        });
      }
      // if (count => 100 ) {
      // } else {
      //   setIsLoading(false);
      //   navigate('/generateFreeNFT');
      //   clearInterval(timer);
      // }
    }, incrementInterval);

    return () => {
      // setIsLoading(false);
      // navigate('/generateFreeNFT');
      clearInterval(timer);
    };
  }, []);

  // useEffect(() => {
  //   if (count >= 100) {
  //     setIsLoading(false);
  //     navigate('/generateFreeNFT');

  //     // const timeout = setTimeout(() => {
  //     //   setIsLoading(false);
  //     //   navigate('/generateFreeNFT');
  //     // }, 1000);

  //     // timeout

  //     // return () => {
  //     //   clearTimeout(timeout);
  //     // };
  //   }
  // }, [count]);

  //Trying disabling refresh
  useEffect(() => {
    const disableRefresh = (e:any) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleBeforeUnload = (e:any) => {
      disableRefresh(e);
    };

    const handleUnload = (e:any) => {
      disableRefresh(e);
    };

    // Add event listeners to disable refreshing
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      // Remove event listeners when component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);
  //ends here

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-generate-free-nft-minting">
        <div className="bg_2-JdJl2l">
          <div className="mimi-loading">
            <img className="mimi-loading-image" src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="" />
          </div>
          <div className="x50-7ckAMs">{count}%</div>
        </div>
        <div className="minting-JdJl2l inter-normal-white-15px">Minting…</div>
        <div className="reminder-text-1 inter-normal-white-15px">
          Please wait patiently
          <br />
          and do not refresh the page
        </div>
      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default LoadingMinting;
