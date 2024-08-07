import React, { useState } from "react";
import "./entranceScreenTemplate.css";
import { ButtonWithAction, DisabledButton, PurpleButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
export interface IEntranceScreenTemplateProps {
  upperButtonFunction: (...args: any[]) => void;
  lowerButtonFunction: (...args: any[]) => void;
  haveLowerButton?: boolean;
  haveGuestEntrance?: boolean;
  upperButtonText :string;
  lowerButtonText:string;
}

export default function EntranceScreenTemplate(props: IEntranceScreenTemplateProps) {
  const { upperButtonFunction, lowerButtonFunction, haveLowerButton, haveGuestEntrance,upperButtonText,lowerButtonText } = props;
  function LowerButton(haveButton: boolean | undefined): JSX.Element {
    let component: JSX.Element = <></>;
    if (haveButton) {
      component = <DisabledButton text = {lowerButtonText} height="56px" width="248px" />;
    } else {
      component = <></>;
    }
    return component;
  }

  function GuestEntrance(haveGuestEntrance: boolean | undefined): JSX.Element {
    let component: JSX.Element = <></>;
    if (haveGuestEntrance) {
      component = (
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
      );
    } else {
      component = <></>;
    }
    return component;
  }

  const content: JSX.Element = (
    <div className="entranceScreenTemplate-option-container">
      <div id="entranceScreenTemplate-button-container">
        {/* <ButtonWithAction
          text={upperButtonText}
          action={() => {
            upperButtonFunction();
          }} // TODO: add action to connect wallet
          height="56px"
          width="248px"
        /> */}
        <PurpleButton
          text={upperButtonText}
          action={() => {
            upperButtonFunction();
          }} // TODO: add action to connect wallet
          height="56px"
          width="248px"
        />
        {/* <Link to="https://phoenix-wallet.rocks/"> */}
        {LowerButton(haveLowerButton)}
        {/* </Link> */}
      </div>
      {GuestEntrance(haveGuestEntrance)}
      {/* <div className="entranceScreen-explore-container">
        <p className="inter-normal-white-12px">Curious to see what awaits ?</p>
        <div
          className="inter-normal-keppel-12px EntranceScreenTemplate-explore-button"
          onClick={() => {
            lowerButtonFunction();
          }}
        >
          Explore as a guest
        </div>
      </div> */}

      {/* <p className="inter-normal-white-15px">or</p>
          <div className="inter-semi-bold-keppel-15px EntranceScreenTemplate-explore-button" onClick={() => navigate("/home")}>
            Explore as a guest
          </div> */}
    </div>
  );

  return content;
  // return <CenterLayout bgImg={false} content={content} />;
}
