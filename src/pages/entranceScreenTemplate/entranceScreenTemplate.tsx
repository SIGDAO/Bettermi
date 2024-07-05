import React, { useState } from "react";
import "./entranceScreenTemplate.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
export interface IEntranceScreenTemplateProps {
  upperButtonFunction: (...args: any[]) => void;
  lowerButtonFunction: (...args: any[]) => void;
  haveButton?: boolean;
}

export default function EntranceScreenTemplate(props: IEntranceScreenTemplateProps) {
  const { upperButtonFunction, lowerButtonFunction, haveButton } = props;

  const content: JSX.Element = (
    <div className="entranceScreenTemplate-option-container">
      <div id="entranceScreenTemplate-button-container">
        <ButtonWithAction
          text="XT Wallet"
          action={() => {
            upperButtonFunction();
          }} // TODO: add action to connect wallet
          height="56px"
          width="248px"
        />
        {/* <Link to="https://phoenix-wallet.rocks/"> */}
        {haveButton ? <DisabledButton text="Phoenix Wallet" height="56px" width="248px" /> : <></>}
        {/* </Link> */}
      </div>
      <div className="entranceScreen-explore-container">
        <p className="inter-normal-white-12px">Curious to see what awaits ?</p>
        <div
          className="inter-normal-keppel-12px EntranceScreenTemplate-explore-button"
          onClick={() => {
            lowerButtonFunction();
          }}
        >
          Explore as a guest
        </div>
      </div>

      {/* <p className="inter-normal-white-15px">or</p>
          <div className="inter-semi-bold-keppel-15px EntranceScreenTemplate-explore-button" onClick={() => navigate("/home")}>
            Explore as a guest
          </div> */}
    </div>
  );

  return content;
  // return <CenterLayout bgImg={false} content={content} />;
}
