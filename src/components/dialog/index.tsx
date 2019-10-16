
import React from 'react';
import classnames from 'classnames';
import RCDialog from 'rc-dialog';
import './index.less';
import pic from './sprite.png';

export default class Dialog extends React.Component<IDialogProps, {}> {
  render() {
    const { visible = false, center = true, style, onClose, afterClose, mousePosition = null, destroyOnClose = true,
      title, iconClass, showClose = true, maskClosable = false, buttons, children } = this.props;
    const icon = iconClass && <i className={iconClass} />;
    return <RCDialog
      style={style}
      visible={visible}
      animation="zoom"
      maskAnimation="fade"
      onClose={onClose}
      afterClose={afterClose}
      mousePosition={mousePosition}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      wrapClassName={classnames({ center, dialog_show_close: showClose })}
    >
      <div className="widget-container">
        {title && <div className="heading">
          {icon} {title}
        </div>}
        <div className="widget-content">
          <div>
            {children}
          </div>
          {buttons && <div className="dialog_button_container">
            {buttons}
          </div>}
        </div>
      </div>
    </RCDialog>;
  }
}

interface IDialogProps {
  visible?: boolean;
  center?: boolean;
  style?: Object;
  onClose?: (e: React.SyntheticEvent<HTMLDivElement>) => any;
  afterClose?: () => any;
  mousePosition?: IPosition;
  destroyOnClose?: boolean;
  title?: string;
  iconClass?: string;
  showClose?: boolean;
  maskClosable?: boolean;
  buttons?: React.ComponentClass[];
}
