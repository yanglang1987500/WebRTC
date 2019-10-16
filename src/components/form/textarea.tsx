import React from 'react';
import classnames from 'classnames';
import PubSub from '@common/utils/pubsub';

class Textarea extends React.Component<ITextareaProps, ITextareaStates> {

  dom: HTMLTextAreaElement = null;

  focus() {
    if (this.dom) {
      PubSub.notify('scrollto', this.dom.offsetTop);
      this.dom.focus();
    }
  }

  render() {
    const { value, onChange, error, required, placeholder, rows, maxLength, className, prop } = this.props;
    return <div className="form-group">
      <textarea
        id={prop}
        value={value}
        rows={rows}
        maxLength={maxLength}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={classnames('form-control', className, error ? 'mb-2' : 'mb-4')}
        ref={dom => this.dom = dom}
      />
      {error && <label className="text-danger font-weight-bold">{error}</label>}
    </div>;
  }
}

interface ITextareaProps {
  value?: string | number;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  prop?: string;
}

interface ITextareaStates {
}

export default Textarea;