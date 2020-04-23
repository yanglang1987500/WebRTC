import React from 'react';
import classnames from 'classnames';
import PubSub from '@common/utils/pubsub';

class Input extends React.Component<IInputProps, IInputStates> {

  input: HTMLInputElement = null;
  container: HTMLDivElement = null;

  focus() {
    if (this.input && this.container) {
      PubSub.notify('scrollto', this.container.offsetTop);
      this.input.focus();
    }
  }

  render() {
    const { value, onChange, error, required, placeholder, className, style, prop,  } = this.props;
    return <div className={classnames("form-group")} ref={dom => this.container = dom}>
      <input
        {...this.props}
        id={prop}
        type="text"
        style={style}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={classnames('form-control', className, error ? 'mb-2' : 'mb-4')}
        ref={dom => this.input = dom}
      />
      {error && <label className="text-danger font-weight-bold">{error}</label>}
    </div>;
  }
}

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  style?: IKeyValueMap;
  prop?: string;
}

interface IInputStates {
}

export default Input;