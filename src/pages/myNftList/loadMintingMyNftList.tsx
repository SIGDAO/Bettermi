import React from "react";
import "../loadingMinting/loadingMinting.css";
// import '../loading/loadingMinting.css';
import { CenterLayout } from "../../components/layout";
import { useLedger } from "../../redux/useLedger";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FindLatestTransactionArray, FindLatestTransactionNumber } from "../../NftSystem/updateUserNftStorage";
import { getNftContractStorage } from "../../redux/account";
import { useRef } from "react";
import LoadingMinting from "../loadingMinting/loadingMinting";
import { LedgerClientFactory } from "@signumjs/core";
import { useAppSelector } from "../../redux/useLedger";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { FindNftContractStorage } from "../../NftSystem/updateUserNftStorage";
import { GetEquippedNftId } from "../../NftSystem/updateUserNftStorage";

interface myNftList {
  level: string;
  image: string;
  nftId: string;
}

interface ILoadingMintingProps {
  loadingNft: Boolean;
  setLoadingNft: (isLoading: boolean) => void;
  myNfts: myNftList[];
  setMyNfts: (myNftList: myNftList[]) => void;
  userId?: string;
  isOtherUser: boolean;
}

const LoadingMintingMyNftList: React.FunctionComponent<ILoadingMintingProps> = (props) => {
  const { loadingNft, setLoadingNft, myNfts, setMyNfts, userId, isOtherUser } = props;
  const navigate = useNavigate();
  //const ledger = useLedger();
  const userAccountId = useSelector(accountId);
  const Id = userId == null ? userAccountId : userId;

  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace(/['"]+/g, ""); // the code hash of the BMI contract
  const [count, setCount] = useState(1);
  const trialMyNftArray = [
    { level: "1", image: "QmZDR8AXkTYLeZFAG4X2CEM1u6pKY7wUvhFD3H84LgRUTB", nftId: "8044547973556232512" },
    { level: "1", image: "QmUryVaZmrr8RjsnRAVGJnreSy32PPfJm2FWVuDZH1npBH", nftId: "8044547973556232512" },
    { level: "1", image: "QmVXVDEyEHExpo1qmDpdyLTqWomWQa558spZ2Bt7TPTPT1", nftId: "8044547973556232512" },
    { level: "1", image: "QmdUtEmJeNcMBZthG1Zy6Qi2BKDwQM3HhR6m7tkCgFeuJo", nftId: "8044547973556232512" },
    { level: "1", image: "Qme1tizXnKq5QA5b88LR6rZuNv13QovVsj52wvysc88PVj", nftId: "8044547973556232512" },
    { level: "1", image: "QmR1YpSbApGph1SUwBnY7wkbygC5Gb757Gj24MhnUZJ2m5", nftId: "8044547973556232512" },
    { level: "1", image: "QmfKjKFMm5efMoEUnw2GY3jjEChR9PJKgurKsxwZddvR73", nftId: "8044547973556232512" },
    { level: "1", image: "QmTkocjKex4HTtcyrsExnyzW9hXYhyNYbuCDKQBvj8NYfN", nftId: "8044547973556232512" },
    { level: "1", image: "QmdykMBCMznteNnqFntnnkULPkZvBjaux8utCYaLff1toc", nftId: "8044547973556232512" },
    { level: "1", image: "QmXVSn21m2gyv2UqjeJrN19nY28469qksDSrGB9dYLq4bH", nftId: "8044547973556232512" },
    { level: "1", image: "QmW3EZFyoCTCXP7NvSAVkVSRokKcKNrSpLXdZCefxpyUgU", nftId: "8044547973556232512" },
    { level: "1", image: "Qmd1d4KudxpbgotYT28PM4EpTnbncqftDHpZnTbKMJQZHy", nftId: "8044547973556232512" },
    { level: "1", image: "Qma3jsMwPFsqRxz62aQhdCZD2mVo6xdJ6trPMjQLXbUZ1B", nftId: "8044547973556232512" },
    { level: "1", image: "QmU1udcsBpRYuXgCKQSDUQA1V1Wk2Sj5ZarMgGxna9bFYq", nftId: "8044547973556232512" },
    { level: "1", image: "QmSczD8JNE77MKf4Wjdcb1rbWughSVsstQG5BRaYoTxKJz", nftId: "8044547973556232512" },
    { level: "1", image: "QmYsE53k8uucvAiMdcNRLTV64H6HK9vSf2mmbGQzVmfppq", nftId: "8044547973556232512" },
    { level: "1", image: "QmZx2aeMP6ze4hwGBJiV7mZ4MFYwrAV42fuAjcECpfAmGp", nftId: "8044547973556232512" },
    { level: "1", image: "QmZCE5VH3T2ZA8WvijVECNYdVzMJEGRe9j9CHfStZM9U2i", nftId: "8044547973556232512" },
    { level: "1", image: "QmQonc1breGQDT2HsyBPdd5r8496XDj24nL74AhVxm8UM8", nftId: "8044547973556232512" },
    { level: "1", image: "QmXRcVQrkaRpE2M74WyxQtFkwErTQzZcse4sbGXYdMPmpj", nftId: "8044547973556232512" },
    { level: "1", image: "QmPCghAoxU2TxUrLdMXBSnTq96fdDneK5vzKqGX2iikNnm", nftId: "8044547973556232512" },
    { level: "1", image: "QmaJJ3tnGmxahdr8vop7exjdNojzer2U9ohUi6UAyFMMDw", nftId: "8044547973556232512" },
    { level: "1", image: "QmXbBVmYncfAmDjyriyky6EwaNV98ra67SPEMP6hpF4woE", nftId: "8044547973556232512" },
    { level: "1", image: "QmWKWQsSWijbqPM5DXX8KA7iU4ueBTU74CDP5ogndasqcM", nftId: "8044547973556232512" },
    { level: "1", image: "QmNmbVToJ6XSMEpzYygEkX1cfahEPHkNLqQAQSbBDKYiNZ", nftId: "8044547973556232512" },
    { level: "1", image: "QmdLqPRy9p8N5nBDHfZFeHpjM6cXkBpbAd7KCp9a1Vg5Eq", nftId: "8044547973556232512" },
    { level: "1", image: "QmXnjZ7Y6d5dRqF4GVeGZqVBB4cey2PPybnkgZLyhpUorR", nftId: "8044547973556232512" },
    { level: "1", image: "QmdADaFbZ94zDmNsHDBU2BTqg6xVrZsAS5KRH6UyfBWTuk", nftId: "8044547973556232512" },
    { level: "1", image: "QmRXDn5m6164QJb2rGurf9iigQtZkeaQK74e9QaeDK8uNs", nftId: "8044547973556232512" },
    { level: "1", image: "QmPpuTxMKzsVr62dA5WhbRuZ23yxhkp1Kzr2759QjrpE6x", nftId: "8044547973556232512" },
    { level: "1", image: "QmTkmBGHHDNvyuJWuXjw7c8JfRCRWMmFJ6vzK6bkmNeHxd", nftId: "8044547973556232512" },
    { level: "1", image: "QmXU1a3kULrd8ZrCiv7wKUEj2WU622ZXLA3VJGYo6CzXUH", nftId: "8044547973556232512" },
    { level: "1", image: "QmP9bMjkwhbKjVfY6bgdTyvGqMYwubCBbUdg7TPpJ5nSQA", nftId: "8044547973556232512" },
    { level: "1", image: "QmZY85bKdHaC6RpPK3hRfr8KEZnjC22P6PJe2Vy3cG3Y4m", nftId: "8044547973556232512" },
    { level: "1", image: "QmYqRdiWPWmkYeiXHuc6vYTqwTpcJ5wf8d6gMUJiQEzXzs", nftId: "8044547973556232512" },
    { level: "1", image: "QmNbQJBoDh6HnYDnwQAa2mnPo39yG7ezGdMLtkvghcQ7nu", nftId: "8044547973556232512" },
    { level: "1", image: "QmXx92QitxvUt6PusX4BLMPZSKaBiJrjyR9Dm6seyZHacH", nftId: "8044547973556232512" },
    { level: "1", image: "QmdiU3X1rKsRN8sU9G8jXSojCpgf4Q7vwzmPrhgJvHSBwD", nftId: "8044547973556232512" },
    { level: "1", image: "QmcgC3BCsjm8tVBMhFXrMPtvb6UxVCrTNtEM4iRm5YkiLu", nftId: "8044547973556232512" },
    { level: "1", image: "QmaMpCnf3MPEaLFhemi9A9DsMpdf9osKrY79ZhfqZVi5ZH", nftId: "8044547973556232512" },
    { level: "1", image: "QmZVp8n81cbWbuy2X3DsZYRH4G3ppv5SGdFT52eHaU85Q2", nftId: "8044547973556232512" },
    { level: "1", image: "QmRibBJRnLfFgXKXLXVtxvBRPMNpTN5Gtm1c2t5iz7DoFH", nftId: "8044547973556232512" },
    { level: "1", image: "QmWMXjmwREiYq7gQbZT8eunBfYAVS6mXaMv6Y9mHo37smX", nftId: "8044547973556232512" },
    { level: "1", image: "QmYUPMyF9C6R3pYL5yvgZcbb9ZPu9ZczjPApqTGjJMeE7e", nftId: "8044547973556232512" },
    { level: "1", image: "QmRNEfmZXjYdQiUbbXZbjZYd5eCcPtu7HB2E7wkBinM2gJ", nftId: "8044547973556232512" },
    { level: "1", image: "QmXzdzKrGuGw5jcimmmzzfGhXCYcJrx4DbZ5jn4x96e8jP", nftId: "8044547973556232512" },
    { level: "1", image: "QmRJCgnojNi7iJ5NommYt2hhEoNkXD55VVujocJUqHuPCX", nftId: "8044547973556232512" },
    { level: "1", image: "QmX6FheKAfE3cabrtaLT8C9Zxe53QCUdyVRmpN1k7enGZM", nftId: "8044547973556232512" },
    { level: "1", image: "QmWcrHZjG7v2BRQWH1av8chAcuRWPic3nMggfqQ84sGPiF", nftId: "8044547973556232512" },
    { level: "1", image: "QmXpXmjGfTArEAz25RPWKkUE72duWMe3hhgk69ZVn2cWDD", nftId: "8044547973556232512" },
    { level: "1", image: "QmZkRe46oY2k4ZZDe3uNsDbZ8TEfVJJoBXxCWqLpBR8Yo7", nftId: "8044547973556232512" },
  ];

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
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const nftLoaded = useRef(false);
  var nft: myNftList;
  var userNftList: myNftList[] = [];

  const loadNftList = async () => {
    const nftContractStorage = await FindNftContractStorage(ledger2, Id, codeHashIdForNft);
    const latestTransactionNumber = await FindLatestTransactionNumber(ledger2, nftContractStorage, nftDistributor);
    const nftAddressList = await FindLatestTransactionArray(ledger2, nftContractStorage, nftDistributor, latestTransactionNumber);
    if (nftAddressList[0] === "empty") {
      setLoadingNft(false);
    }
    if (isOtherUser === false) {
      const equippedNft = await GetEquippedNftId(ledger2, Id);
      if (equippedNft != "") {
        const index = nftAddressList.indexOf(equippedNft);
        if (index > -1) {
          nftAddressList.splice(index, 1);
        }
      }
    }
    const promiseArray = nftAddressList.map((addressList) => {
      return ledger2.contract.getContract(addressList);
    });
    const contractInfoArray = await Promise.all(promiseArray);
    for (var i = 0; i < contractInfoArray.length; i++) {
      try {
        const trial = JSON.parse(contractInfoArray[i].description);
        nft = { level: trial.version, image: trial.descriptor, nftId: nftAddressList[i] };
        //nft = {level:trial.version,image:trial.descriptor,nftId:nftAddressList[i]};
        userNftList.push(nft);
      } catch (e) {
        console.log(e);
      }
      if (i === contractInfoArray.length - 1) {
        setCount(100);
        setTimeout(() => {
          //setMyNfts(trialMyNftArray);
          setMyNfts(userNftList);
          setLoadingNft(false);
        }, 1000);
      }
    }
    if (contractInfoArray.length === 0) {
      setCount(100);
      setTimeout(() => {
        //setMyNfts(trialMyNftArray);
        setMyNfts(userNftList);
        setLoadingNft(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (nftLoaded.current === true) {
    } else {
      nftLoaded.current = true;
      try {
        loadNftList();
      } catch (e) {
        alert("It seems like some error has occurred. We would be grateful if you could report it to us");
        navigate("/home");
      }
    }
  }, []);

  useEffect(() => {
    // const incrementInterval = 240000 / 96; // Time divided by the number of increments
    const incrementInterval = 50000 / 100;
    if (count < 99) {
      const timer = setInterval(() => {
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
          <div className="mimi-loading">
            <img className="mimi-loading-image" src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="" />
          </div>
          <div className="x50-7ckAMs">{count}%</div>
        </div>
        <div className="minting-JdJl2l inter-normal-white-15px">Loading NFTs...</div>
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

export default LoadingMintingMyNftList;
