import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import Animate from 'rc-animate';
import LazyRenderBox from './lazyRenderBox';
import DialogWrap from './dialogWrap';
import classnames from 'classnames';
import './fullDialog.less';

class FullDialog extends React.Component<IFullDialogProps, IFullDialogStates> {

  componentDidUpdate(prevProps: IFullDialogProps, prevState: IFullDialogStates) {
    this.update();
  }

  componentDidMount() {
    this.update();
  }

  update() {
    if (this.props.visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  render() {
    const { title, className, visible = false, onClose = () => { }, maskClosable = true,
      needMask = true, destroyOnClose = false, style = {}, children } = this.props;
  
    return (<DialogWrap destroyOnClose visible={visible} onClose={onClose} maskClosable={maskClosable} mask={needMask}>
      <Animate
        key="fullDialog"
        showProp="visible"
        transitionAppear
        component=""
        transitionName={`ui-full-dialog`}
      >
        {(!!visible || !destroyOnClose) ? <LazyRenderBox
          key="fullDialog"
          style={style}
          className={`modal modal-fullpage`}
          hiddenClassName='ui-full-dialog-hidden'
          visible={visible}
        >
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content" >
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button type="button" onClick={onClose} className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><i className="icon-close font-sm" /></span>
                </button>
              </div>
              {children}
            </div>
          </div>
        </LazyRenderBox> : null}
      </Animate>
    </DialogWrap>);
  }
}

interface IFullDialogProps {
  visible: boolean;
  onClose?: () => void;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  style?: Object;
  closeDirection?: string;
  className?: string;
  title?: string | React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  needMask?: boolean;
}

interface IFullDialogStates {
  size: number;
  direction: string;
}

export default FullDialog;