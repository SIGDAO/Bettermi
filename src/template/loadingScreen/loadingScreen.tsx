import React, { useState, useContext } from "react";
import "./loadingScreen.css";
import { CenterLayout } from "../../components/layout";

export interface ILoadingScreenProps {
  count: number;
  pathname: string;
}
export interface ILoadingScreenDescriptionProps {
  pathname: string;
}

export default function LoadingScreen(props: ILoadingScreenProps) {
  const { count, pathname } = props;

  function myComponent(pathname: string): JSX.Element {
    let component: JSX.Element = <></>;
    if (pathname === "/loadingBMIDaily") {
      component = <div className="loading-screen inter-normal-white-15px">Importing...</div>;
    } else if (pathname === "/loadingDiscordAuthorization") {
      component = <div className="loading-screen inter-normal-white-15px">Loading...</div>;
    } else {
      component = <div className="loading-screen inter-normal-white-15px">Minting...</div>;
    }
    return component;
  }

  const content: JSX.Element = (
    <div className="screen">
      <div className="loading-screen-free-nft-minting">
        <div className="loading-screen-background">
          <div className="loading-screen-mimi-loading">
            <img className="loading-screen-mimi-loading-image" src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="" />
          </div>
          <div className="loading-screen-count">{count}%</div>
        </div>
        {myComponent(pathname)}

        <div className="loading-screen-reminder-text inter-normal-white-15px">
          Please wait patiently
          <br />
          and do not refresh the page
        </div>
      </div>
    </div>
  );


  return <CenterLayout content={content} bgImg={false} />;
  // return <CenterLayout bgImg={false} content={content} />;
}
