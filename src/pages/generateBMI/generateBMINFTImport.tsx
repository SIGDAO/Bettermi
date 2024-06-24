import * as React from "react";
import "../../components/calendar.css";
import "./generateBMINFTImport.css";

import { CenterLayout } from "../../components/layout";
import { BackButton, DisabledButton } from "../../components/button";
import { BirthSelect, GenderSelect } from "../../components/select";
import { selectCurrentGender, selectCurrentImg, selectCurrentBMI, selectCurrentBirthday, profileSlice, selectCurrentIsSelfie } from "../../redux/profile";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { TransferNftTokenOwnershipFinale } from "../../components/transferNftTokenFinale";

import { useNavigate } from "react-router-dom";
import { useLedger } from "../../redux/useLedger";
import { Api } from "@reduxjs/toolkit/dist/query";
import { UnsignedTransaction } from "@signumjs/core";
import { useContext, useEffect } from "react";
import { AppContext } from "../../redux/useContext";
import { accountPublicKey } from "../../redux/account";
import { accountId } from "../../redux/account";
import { accountSlice } from "../../redux/account";
import { store } from "../../redux/reducer";
import { calBMIType, calRewardSigdaoOnSelfie } from "../../components/rewardCalculate";
import { TransferToken } from "../../components/transferToken";
import JSEncrypt from "jsencrypt";
import axios from "axios";
import { contractSlice, selectCurrentIsBMIContractBuild, selectCurrentIsNFTContractBuild } from "../../redux/contract";

interface IGenerateBMINFTImportProps {
  isSelfie: boolean,
  bmi: string,
  confirm: () => void;
  minted: boolean;
  selfie: string;
}

const GenerateBMINFTImport: React.FunctionComponent<IGenerateBMINFTImportProps> = ({ isSelfie, bmi, confirm, minted, selfie }) => {

  const content: JSX.Element = (
    <div className="screen">
      <div
        className="bettermidapp-generate-bmidata-import"
        // onclick="window.open('bettermidapp-generate-bmi-daily.html', '_self');"
      >
        <BackButton />
        <p className="import-biological-sex-birth-pqhvJT inter-bold-royal-blue-15px">IMPORT BIOLOGICAL SEX &amp; BIRTH:</p>
        <p className="your-selection-cannot-be-changed-later-pqhvJT">Your selection cannot be changed later.</p>
        <GenderSelect
          options={[
            { label: "Female", value: "1" },
            { label: "Male", value: "2" },
          ]}
          title="False"
          newPage={true}
          onSelect={(e) => console.log(e)}
        />
        <BirthSelect />
        <div className="bmi-pqhvJT">
          <div className="bmi-result-bg-bL0gm3">
            <img className="seperate-line-IJAMVx seperate-line" src="img/generateBMINFTImport/seperat-line-1@1x.png" alt="seperate line" />
            <img className="seperate-line-X2g18V seperate-line" src="img/generateBMINFTImport/seperat-line-1@1x.png" alt="seperate line" />
          </div>
          <div className="bmi-result-bL0gm3">
            {/* <div className="bg-Gw4eM2" style={{backgroundColor: calBMIType(BMI).color}}></div> */}
            <div className="bg-Gw4eM2"></div>
            <div className="x255-Gw4eM2">{bmi || "BMI Error"}</div>
            <div className="kgm2-Gw4eM2">
              <span className="span0-IFVIgU inter-normal-royal-blue-14px">kg/m</span>
              <span className="span1-IFVIgU inter-normal-royal-blue-14px">2</span>
            </div>
          </div>
          <h1 className="title-bL0gm3 inter-semi-bold-white-28px">Your BMI Result :</h1>
        </div>
        <div className="bottom-controls-pqhvJT" onClick={confirm}>
          {minted ? (
            <DisabledButton text="connecting..." height="56px" width="248px" />
          ) : (
            <div className="button_-mint-RUzxTX">
              <div className="button1-T8l3Om"></div>
              <div className="mint-T8l3Om inter-semi-bold-white-15px">Mint your NFT</div>
            </div>
          )}
        </div>

        <img className="photo-pqhvJT" src={selfie ? selfie : "img/generateBMINFTImport/photo-6@1x"} alt="Photo" />
      </div>
    </div>
  );

  return isSelfie ? <Navigate to="/home" /> : <CenterLayout content={content} bgImg={false} />;
};

export default GenerateBMINFTImport;
