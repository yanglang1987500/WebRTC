import React from 'react';
import classnames from 'classnames';

class FocusInput extends React.Component<IFocusInputProps, {}> {
  input: HTMLInputElement;

  constructor(props: IFocusInputProps) {
    super(props);
  }

  componentDidMount() {
    const { onRef = () => { } } = this.props;
    onRef(this);
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange = () => { } } = this.props;
    const value = (e && e.target) ? e.target.value : e as any as string;
    onChange(value);
  }

  focus() {
    this.input && this.input.focus();
  }

  render() {
    const { placeholder, maxLength = null, required, value, error } = this.props;

    return <div className={classnames("focus-input", "group", error && 'has-error')} >
      <input
        type="text"
        value={value}
        ref={dom => { this.input = dom; }}
        className={classnames(value && 'up')}
        maxLength={maxLength}
        required={required}
        onChange={this.onChange}
      />
      <span className="highlight" />
      <span className="bar" />
      <label>{placeholder}</label>
    </div>;
  }
}

interface IFocusInputProps {
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  value?: string;
  error?: boolean;
  onRef?: (data?: Object) => void;
  onChange?: (value?: string) => void;
}

export default FocusInput;