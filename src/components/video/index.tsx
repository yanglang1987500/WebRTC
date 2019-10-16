import React, { Component, SyntheticEvent } from "react";
import { Portal, Dialog } from "@components";
import classnames from 'classnames';
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
import "./index.less";

export default class ModelVideo extends Component<IModelVideo, {}> {
  render() {
    const { onClick, src, autoPlay = true, isOpen, onClose, style = { width: "80%" }, onDownload = () => true } = this.props;
    return (
      <>
        <a href="javascript:void(0)" onClick={onClick} className="d-block file file-video">
          <i className="iconfont icon-mp4 text-white" />
        </a>
        <Portal>
          <Dialog style={style} visible={isOpen} onClose={onClose}>
            <Player src={src} autoPlay={autoPlay} >
              <ControlBar>
                <DownloadButton order={12} onClick={() => onDownload(src)} />
              </ControlBar>
            </Player>
          </Dialog>
        </Portal>
      </>
    );
  }
}

const DownloadButton = (props: IDownloadButton) => {
  const { player, className, onClick = () => true } = props;
  const { currentSrc } = player;
  return <a
    className={classnames(className, 'video-react-download', 'video-react-control', 'video-react-button')}
    href={currentSrc}
    download
    onClick={e => {
      if (!onClick()) {
        e.preventDefault();
      }
    }}
    tabIndex={12}
  >
    <i className="iconfont icon-download" />
  </a>;
};

export const Video = React.forwardRef<any, IVideoProps>((props, ref) => <Player {...props} ref={ref} >
  <ControlBar>
    <DownloadButton order={12} onClick={() => props.onDownload(props.src)} />
  </ControlBar>
</Player>);

interface IDownloadButton extends IKeyValueMap {
  player?: any;
  className?: string;
  onClick?: () => boolean;
}

interface IVideoProps extends IKeyValueMap {
  src: string;
  autoPlay?: boolean;
  onDownload?: (src: string) => boolean;
  style?: React.CSSProperties;
}

interface IModelVideo extends IVideoProps {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  isOpen: boolean;
  onClose?: (e: SyntheticEvent<HTMLDivElement, Event>) => void;
}