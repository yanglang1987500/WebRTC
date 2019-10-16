import React from 'react';
import PreviewImages, { IPhotoProps } from './previewImages';

class PreviewAttach extends React.Component<IPreviewAttachProps, IPreviewAttachStates> {

  constructor(props: IPreviewAttachProps) {
    super(props);
    this.state = {
      currentIndex: 0,
      photoSwipe: false,
      photos: [],
    };
  }

  static getDerivedStateFromProps(props: IPreviewAttachProps, state: IPreviewAttachStates) {
    const { attachments = [], index, isOpen } = props;
    if (!isOpen) return;
    return PreviewAttach.doPreview(attachments, index, state);
  }

  static doPreview(attachments: IAttachment[], index: number, state: IPreviewAttachStates) {
    const attach = attachments[index];
    if (!attach) return;
    // preview image
    if (attach.ContentType.indexOf('image') > -1) {
      return PreviewAttach.showPhotoSwipe(attachments, index, state);
    }
  }

  // package photoSwipe data
  static showPhotoSwipe(attachments: IAttachment[], index: number, state: IPreviewAttachStates) {
    const key = attachments[index].FileUrl;
    const images =  attachments.filter((item: IAttachment) => {
      return item.ContentType.indexOf('image') > -1;
    });
    const currentIndex = images.findIndex((item: IAttachment) => {
      return item.FileUrl === key;
    });
    const photos : IPhotoProps[] = [];
    images.map((item: IAttachment) => {
      const photo = {
        src: item.FileUrl,
        w: 1200,
        h: 900,
        title: item.FileName
      };
      photos.push(photo);
    });
    return {
      currentIndex,
      photos,
      photoSwipe: true
    };
  }

  hidePhotoSwipe() {
    const { onClose } = this.props;
    onClose();
    this.setState({
      photoSwipe: false
    });
  }
  
  render() {
    const { photos, photoSwipe, currentIndex } = this.state;
    return <React.Fragment>
      {photoSwipe && <PreviewImages
        photos={photos}
        isOpen={photoSwipe}
        onClose={()=>this.hidePhotoSwipe()}
        currentIndex={currentIndex}
      />}
    </React.Fragment>;
  }
}

interface IPreviewAttachProps {
  attachments?: IAttachment[];
  index: number;
  isOpen: boolean;
  onClose?: Function;
}

interface IPreviewAttachStates {
  currentIndex?: number;
  photoSwipe?: boolean;
  photos?: IPhotoProps[];
}

export default PreviewAttach;