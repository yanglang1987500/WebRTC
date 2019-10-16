import React from 'react';
import classnames from 'classnames';
import PubSub from '@common/utils/pubsub';

class Select extends React.Component<ISelectProps, ISelectStates> {
  
  dom: HTMLSelectElement = null;
  
  focus() {
    if (this.dom) {
      PubSub.notify('scrollto', this.dom.offsetTop);
      this.dom.focus();
    }
  }

  render() {
    const { value, onChange, required, error, children, prop } = this.props;
    return <select
      id={prop}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className={classnames("form-control", error && 'error', error ? 'mb-2' : 'mb-4')}
      ref={dom => this.dom = dom}
    >
      {children}
    </select>;
  }
}

interface ISelectProps {
  value?: string | number;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  children?: React.ReactNode;
  prop?: string;
}

interface ISelectStates {
}

export default Select;