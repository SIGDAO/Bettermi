import React, { useState } from "react";
import "./referralCodeLogo.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
export interface IReferralCodeLogoProps {
  imagePath: string;
}

export default function ReferralCodeLogo(props: IReferralCodeLogoProps) {
  const { imagePath } = props;
  const logo: JSX.Element = (
    <div className="ReferralCodeLogo-bg-img">
      <img className="ReferralCodeLogo-bg-img" src={process.env.PUBLIC_URL + imagePath} />
    </div>
  );

  return logo;
  // return <CenterLayout bgImg={false} content={content} />;
}
