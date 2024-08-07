import React, { useRef, useEffect, useState } from "react";
import { profileSlice } from "../redux/profile";
import { store } from "../redux/reducer";
import { generateName } from "./randomGenerater";
import { useNavigate } from "react-router-dom";
import "./input.css";

interface IRandomGenNameInputProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  width?: number;
}

interface ICustomTextAreaProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  // height : string;
  width: number;
  importClassName: string;
  height?: number;
  placeholder?: string;
  activeClassName?: string;
}

export const RandomGenNameInput: React.FunctionComponent<IRandomGenNameInputProps> = (props) => {
  // todo: help it to change to nft image IFPS link
  // maybe store the path in redux as well
  const { name, setName } = props;
  const nftImage = "";
  const defaultName = "Enter Your Name";
  const navigate = useNavigate();

  // when user press "Save", putting the generated name into local storage
  // const [name, setName] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && inputRef.current) {
      divRef.current.addEventListener("click", () => {
        inputRef.current?.focus();
      });
    }
  }, []);

  const handleRandomGenerateName = () => {
    setName(generateName());
  };

  return (
    <div className="search_bar-Gzrq3v">
      <div className="search-AToI7d">
        <input placeholder={name || defaultName} className="card-number-AToI7d" style={{ opacity: 0.5 }} value={name} onChange={(e) => setName(e.target.value)} />
        <div className="random-dice-AToI7d" onClick={handleRandomGenerateName}>
          <div className="card-number-zhUTxv">Random</div>
          <img className="ic_casino_24px-zhUTxv" src={`${process.env.PUBLIC_URL}/img/customizeYourProfile/ic-casino-24px@1x.png`} alt="ic_casino_24px" />
        </div>
      </div>
    </div>
  );
};

export const CustomInput: React.FC<ICustomTextAreaProps> = (props) => {
  const { text, setText, width, importClassName, placeholder } = props;

  return (
    <input
      className={`customInput ${importClassName}`}
      style={{
        width: `${width}px`,
        height: "40px",
        background: "#ffffff08",
      }}
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={placeholder || ""}
    />
  );
};

export const CustomTextArea: React.FC<ICustomTextAreaProps> = (props) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { text, setText, width, importClassName, height, placeholder, activeClassName } = props;

  const handleTextChange = (value) => {
    setText(value);
    if (value.length === 0) setIsActive(true);
    else setIsActive(false);
  };

  return (
    <textarea
      className={!isActive ? `customTextArea ${activeClassName || importClassName}` : `customTextArea ${importClassName}`}
      name="w3review"
      rows={2}
      cols={50}
      style={{
        height: `${height ? height + "px" : "76px"}`,
        width: `${width}px`,
        background: "#ffffff08",
      }}
      value={text}
      onChange={(e) => handleTextChange(e.target.value)}
      placeholder={placeholder || ""}
    >
      {/* {'♉️  |  29  |  PERSONAL TRAINER'} */}
    </textarea>
  );
};

// export default Input;

interface LinkDisplayInputProps {
  // Other input props you may need
  type: string;
  value: string;
  dir?: string;
  readOnly: boolean;
  className?: string;
}

export const LinkDisplayInput: React.FC<LinkDisplayInputProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (inputRef.current !== document.activeElement) {
        event.preventDefault();
      }
    };

    const handleFocus = () => {
      document.removeEventListener('wheel', handleScroll);
    };

    const handleBlur = () => {
      document.addEventListener('wheel', handleScroll, { passive: false });
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
      inputRef.current.addEventListener('blur', handleBlur);
    }

    // Add the scroll event listener to disable scrolling when not focused
    document.addEventListener('wheel', handleScroll, { passive: false });

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('wheel', handleScroll);
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus);
        inputRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, []);


  return (
    <input
      ref={inputRef}
      {...props}
    />
  );
};
