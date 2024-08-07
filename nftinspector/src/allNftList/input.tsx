import React, { useRef, useEffect, useState } from 'react';
import './input.css'


interface IRandomGenNameInputProps {
  name : string;
  setName : React.Dispatch<React.SetStateAction<string>>;
}

interface ICustomTextAreaProps {
  text : string;
  setText : React.Dispatch<React.SetStateAction<string>>;
  // height : string;
  width : number;
  importClassName : string;
  height? : number;
  placeholder? : string;
  activeClassName? : string;
}


export const CustomTextArea: React.FC<ICustomTextAreaProps> = (props) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { text, setText, width, importClassName, height, placeholder, activeClassName } = props;

  const handleTextChange = (value:any) => {
    setText(value)
    if (value.length === 0) 
      setIsActive(true);
    else 
      setIsActive(false);
  }

  return (
    <textarea 
      className={!isActive ? `customTextArea ${activeClassName || importClassName}` : `customTextArea ${importClassName}`}
      name="w3review" 
      rows={2} 
      cols={50}
      style={{
        height:  `${height? height + 'px' : "76px"}`,
        width: `${width}px`,
        background: '#ffffff08',
      }}
      value={text}
      onChange={(e) => handleTextChange(e.target.value)}
      placeholder={placeholder || ''}
    >
      {/* {'♉️  |  29  |  PERSONAL TRAINER'} */}
    </textarea>
  )
}

// export default Input;
