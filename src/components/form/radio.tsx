import React from 'react';
import classnames from 'classnames';
import PubSub from '@common/utils/pubsub';

class Radio extends React.Component<IRadioProps, IRadioStates> {

  dom: HTMLDivElement = null;

  focus() {
    if (this.dom) {
      PubSub.notify('scrollto', this.dom.offsetTop);
    }
  }

  render() {
    const { options, value, onChange, error, prop } = this.props;
    return <div className="list-group step-lst mb-4" ref={dom => this.dom = dom} id={prop}>
      {options.map(option => <a
        key={option.id}
        id={option.id}
        className={classnames(
          `list-group-item list-group-item-action d-flex justify-content-between align-items-center`,
          value === option.id && 'active')}
        href="javascript:void(0)"
        onClick={() => onChange(option.id)}
      >
        <b className="text-left">{option.name}</b><span className="iconfont icon-more text-muted" />
      </a>)}
      {error && <label className="text-danger font-weight-bold">{error}</label>}
    </div>;
  }
}

interface IRadioProps {
  value: string;
  onChange?: (id: string) => void;
  options: IOption[];
  error?: string;
  prop?: string;
}

interface IRadioStates {
}

export interface IOption {
  id: string;
  name: string;
}

export default Radio;