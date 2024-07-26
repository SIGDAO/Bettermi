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
import LoadingScreen from "../../template/loadingScreen/loadingScreen";

interface ILoadingMintingProps {
  pathname: string;
}

const LoadingMinting: React.FunctionComponent<ILoadingMintingProps> = (props) => {
  const navigate = useNavigate();
  const ledger = useLedger();
  const userAccountId = useSelector(accountId);
  const nftCodeHashId = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!; // the code hash of the BMI contract
  const bmiCodeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!; // the code hash of the BMI contract

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

    let isTodayRecord = false;

    while (true) {
      if (await isTodayHaveSelfieRecord(userAccountId, ledger)) break;
    }

    setCount(100);
    setIsLoading(false);
    navigate("/selfToEarn");
  };

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

    while (bmiContract.ats[0] == null || nftContract.ats[0] == null) {
      bmiContract = await ledger.contract.getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: bmiCodeHashId,
      });
      nftContract = await ledger.contract.getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: nftCodeHashId,
      });
    }
    var description: any;

    try {
      description = JSON.parse(bmiContract.ats[0].description);
    } catch (error) {
      try {
        const bmiEncrypteddata = bmiContract.ats[0].description;
        description = await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/decrypt", {
          data: [bmiEncrypteddata],
        });
        description = description.data.data;
      } catch (error) {
        alert("Cannot fetch the record, please contact core team through discord !");
        navigate("/");
      }
    }
    var gender = "Male";
    if (description[0].gender.includes("Female")) {
      gender = "Female";
    }
    if (gender === "Male") {
      await TransferNftToNewUser(ledger, userAccountId, ioNftStorageAccounts, nftCodeHashId, nftDistributor);
    } else {
      await TransferNftToNewUser(ledger, userAccountId, mimiNftStorageAccounts, nftCodeHashId, nftDistributor);
    }

    const latestTransactionNumber = await FindLatestTransactionNumber(ledger, nftContract.ats[0].at, nftDistributor);
    const latestTransactionList = await FindLatestTransactionArray(ledger, nftContract.ats[0].at, nftDistributor, latestTransactionNumber);

    if (nftContract.ats[0] != null) {
      store.dispatch(accountSlice.actions.setNftContractStorage(nftContract.ats[0].at));
    }

    if (latestTransactionList.length === 0) {
      setCount(100);
      setIsLoading(false);
      store.dispatch(profileSlice.actions.setNFTId("error"));
      navigate("/generateFreeNFT", { state: { nftId: "error" } });
    } else {
      setCount(100);
      setIsLoading(false);
      console.log("latestTransactionList[0] is", latestTransactionList[0]);
      store.dispatch(profileSlice.actions.setNFTId(latestTransactionList[0]));
      navigate("/generateFreeNFT", { state: { nftId: latestTransactionList[0] } });
    }
  };

  useEffect(() => {
    const incrementInterval = 240000 / 96; // Time divided by the number of increments
    // const incrementInterval = 5000 / 100;
    const timer = setInterval(() => {
      if (count < 100) {
        setCount((prevCount) => {
          if (prevCount < 99) {
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

  // main function
  useEffect(() => {
    if (nftLoaded.current === true) return;

    nftLoaded.current = true;
    if (pathname === "/loadingBMIDaily") {
      checkIfBMIcreated().catch((err) => {
        console.error(err);
      });
      return;
    }
    
    checkIfNFTMinted().catch((err) => {
      console.error(err);
    });

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
    const disableRefresh = (e: any) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleBeforeUnload = (e: any) => {
      disableRefresh(e);
    };

    const handleUnload = (e: any) => {
      disableRefresh(e);
    };

    // Add event listeners to disable refreshing
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      // Remove event listeners when component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
  //ends here

  return <LoadingScreen pathname={pathname} count={count}></LoadingScreen>;
};

export default LoadingMinting;
