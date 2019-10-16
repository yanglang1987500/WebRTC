import React, { ChangeEvent } from "react";
import classnames from "classnames";

const Switch: React.StatelessComponent<INoInformationProps> = ({
  checked, onChange
}) => {
  return <div className="switch-button">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e: ChangeEvent<HTMLInputElement>) => { onChange(); }}
    />
    <label />
  </div>;
};

interface INoInformationProps {
  checked?: boolean;
  onChange?: () => void;
}

export default Switch;
