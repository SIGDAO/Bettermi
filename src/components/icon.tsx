import * as React from "react";
import "./icon.css";

interface ISigdaoIconProps {
  width?: string;
  height?: string;
}

const SigdaoIcon: React.FunctionComponent<ISigdaoIconProps> = (props) => {
  const { width = "22px", height = "22px" } = props;
  return (
    <div
      className="sigdao-icon-container"
      style={{
        width: width,
        height: height,
      }}
    >
      <div className="sigdao-icon-white-bg"></div>
      <div className="sigdao-icon-bg"></div>
      <img className="sigdao-icon" src="/img/file---880-1x-png-10@1x.png" alt="880" />
    </div>
  );
};

export default SigdaoIcon;
