import React, { useState } from 'react';

interface DropdownMenuProps {
  choices: string[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ choices }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleSelect = (choice: string) => {
    setSelectedChoice(choice);
  };

  return (
    <div className="dropdown-menu">
      <div className="dropdown-toggle">{selectedChoice || 'Select an option'}</div>
      <ul className="dropdown-list">
        {choices.map((choice, index) => (
          <li key={index} onClick={() => handleSelect(choice)}>
            {choice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;