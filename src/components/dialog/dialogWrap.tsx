import React from 'react';
import Animate from 'rc-animate';
import Portal from '../portal';
import LazyRenderBox from './lazyRenderBox';
import './dialogWrap.less';

class DialogWrap extends React.Component<IDialogWrapProps, {}> {

  shouldComponentUpdate({ visible }: IDialogWrapProps) {
    return !!(this.props.visible || visible);
  }

  getContainer = () => {
    const container = document.createElement('div');
    if (this.props.getContainer) {
      this.props.getContainer().appendChild(container);
    } else {
      document.body.appendChild(container);
    }
    return container;
  }

  getMaskElement() {
    const { mask, visible, maskClosable = true, destroyOnClose, onClose = () => {} } = this.props;
    if (mask) {
      return <Animate
        key="mask"
        showProp="visible"
        transitionAppear
        component=""
        transitionName='ui-base-dialog-mask-fade'
      >
        {(!!visible || !destroyOnClose) ? <LazyRenderBox
          key="mask"
          className='ui-base-dialog-mask'
          hiddenClassName='ui-base-dialog-mask-hidden'
          visible={visible}
          onClick={() => { maskClosable && onClose(); }}
        /> : null}
      </Animate>;
    }
    return null;
  }

  render() {
    const { children, visible } = this.props;
    return <Portal getContainer={this.getContainer}>
      {this.getMaskElement()}
      {children}
    </Portal>;
  }
}

interface IDialogWrapProps {
  visible?: boolean;
  getContainer?: Function;
  maskClosable?: boolean;
  mask?: boolean;
  destroyOnClose?: boolean;
  onClose?: Function;
}

export default DialogWrap;