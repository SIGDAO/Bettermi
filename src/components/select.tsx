import React, { useState, useEffect, useRef, Dispatch } from 'react';
import { profileSlice, selectCurrentBirthday } from '../redux/profile'
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import './select.css';


// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface IGenderSelectProps {
  title: string;
  options: any[];
  newPage?: boolean | undefined;
  onSelect: (option: any) => void;
}

export const GenderSelect: React.FunctionComponent<IGenderSelectProps> = (props) => {
  const dispatch = useDispatch();

  const { options, newPage } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(options[0].label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      dispatch(profileSlice.actions.setGender(displayValue));
    }
  }, [isOpen, displayValue]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className="dropdown-container" 
      ref={dropdownRef}
      style={{
        'left': `${newPage ? '51px' : `calc((100% - 136px) / 2)}`}`,
        'top': `${newPage ? '647px' : '625px'}`,
        'width': `${newPage ? '114px' : '136px'}`,
      }}
    >
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="selected-sex inter-normal-white-15px">{displayValue}</div>
        <img className="select-image" src={process.env.PUBLIC_URL + '/img/generateBMI/arrow-down@1x.png'} alt="arrow-down" />
      </div>
      {isOpen && (
        <ul className="dropdown-options" onBlur={() => setIsOpen(!isOpen)}>
          {options.map((option: any) => (
            <li className='inter-normal-white-12px' key={option.value}  
              onClick={() => {
                props.onSelect(setDisplayValue(option.label));
                toggleDropdown();
              }}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface IBirthSelectProps {
  date?: string;
  setData?: (date: string) => void;
  onSelect?: (option: any) => void;
  // isFirstBirthdaySelectClick: boolean;
  // setIsFirstBirthdaySelectClick: Dispatch<React.SetStateAction<boolean>>;
}

// export const BirthSelect: React.FunctionComponent<IBirthSelectProps> = ({isFirstBirthdaySelectClick, setIsFirstBirthdaySelectClick}) => {
export const BirthSelect: React.FunctionComponent<IBirthSelectProps> = (props) => {
  // todo: reduce the code duplication
  const dispatch = useDispatch();
  // const { isOpen, setIsOpen } = props;
  const selectedBirthday = useSelector(selectCurrentBirthday);
  const [value, setValue] = useState(selectedBirthday || new Date()); // selected day on calendar
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);
  const [isFirstClick, setIsFirstClick] = useState(!selectedBirthday);

  useEffect(() => {
    if (value && !isFirstClick){
      dispatch(profileSlice.actions.setBirthday(value))
    }
  }, [value])


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && dropdownRef2.current && !dropdownRef2.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCalender = (e: any) => {
    setValue(e);
    setIsOpen(false);
    setIsFirstClick(false);
  };


  return (
    <div className="birthday-select-container" ref={dropdownRef}>
      <div className="birth-pqhvJT" onClick={(e) => setIsOpen(!isOpen)}>
        <div className="talking-container">
          <div className="x425-hrEXXf x425"></div>
          <img className="arrow-down-hrEXXf arrow-down" src="img/generateBMINFTImport/arrow-down-1@1x.png" alt="arrow-down" />
        </div>
        <div className="ddmmyyyy-Guzcj1 inter-normal-white-15px">{isFirstClick ? "DD/MM/YYYY" :  value.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</div>
      </div>
      {isOpen && (
        <div className="calendar-container">
          <Calendar
            calendarType='Arabic'
            onChange={(e: any) => handleCalender(e)}
            value={value}
            locale='en-US'
            minDetail='decade'
          />
        </div>
      )}

    </div>
  )
}

// export default GenderSelect;