import React from 'react';
import classnames from 'classnames';
import DialogWrap from '../dialog/dialogWrap';
import '../dialog/dialogWrap.less';

class GlobalSpin extends React.Component<IGlobalSpinProps, IGlobalSpinStates> {

  render() {
    const { visible = false, needMask = true, onClose, message = 'LOADING...' } = this.props;
    return <DialogWrap destroyOnClose mask={needMask} visible={visible} onClose={onClose}>
      {visible && <div className="global-loading"><div className="global-loading-cell">
        <div className="global-loading-bg">
            <div className="global-loading-lst">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <h4>{message}</h4>
        </div>
      </div></div>}
    </DialogWrap>;
  }
}

interface IGlobalSpinProps {
  visible?: boolean;
  needMask?: boolean;
  onClose?: () => void;
  message?: string | React.ReactNode;
}

interface IGlobalSpinStates {
}

export default GlobalSpin;