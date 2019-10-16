import React from 'react';
import { Portal, GlobalSpin, Dot  } from '@components';
import { PhotoSwipe } from 'react-photoswipe';
import 'react-photoswipe/lib/photoswipe.css';

class PreviewImages extends React.Component<IPreviewImagesProps, IPreviewImagesStates> {

  constructor(props: IPreviewImagesProps) {
    super(props);
    this.state = {
      showPhotoSwipe: false,
      photos: [],
      loading: false,
    };
  }

  componentDidMount() {
    const { isOpen } = this.props;
    isOpen && this.loadImages();
  }

  loadImages() {
    const { photos } = this.props;

    if (!photos.length) return;
    this.setState({ loading: true });
    const promiseAll : Promise<HTMLImageElement>[] = [];
    photos.map((photo: IPhotoProps) => {
      if (photo.isloaded) return;
      const promise = new Promise<HTMLImageElement>((reslove, reject) => {
        const image = new Image();
        image.src = photo.src;
        image.title = photo.title;
        image.onload = () => {
          reslove(image);
        };
      });
      promiseAll.push(promise);
    });
    Promise.all(promiseAll).then((imgs: HTMLImageElement[]) => {

      imgs.map((img: HTMLImageElement) => {
        if (!img) return;
        photos.map((item: IPhotoProps) => {
          if (item.src === img.src) {
            item.w = img.width;
            item.h = img.height;
            item.isloaded = true;
          }
        });
      });
      this.setState({
        photos,
        showPhotoSwipe: true,
        loading: false
      });
    });
  }

  render() {
    const { currentIndex, onClose } = this.props;
    const { showPhotoSwipe, photos, loading } = this.state;
    const options = {
      mainClass: 'pswp--minimal--dark',
      barsSize: {
        top: 0,
        bottom: 0
      },
      captionEl: false,
      fullscreenEl: true,
      shareEl: false,
      tapToClose: true,
      tapToToggleControls: false,
      index: currentIndex || 0,
      history: false,
      bgOpacity: 0.7,
      showHideOpacity: true
    };
    return <Portal>
      {loading &&
      <GlobalSpin
          visible={this.state.loading}
          onClose={() => { this.setState({ loading: false }); }}
          message={<span>Loading<Dot /></span>}
      />
      }
      <PhotoSwipe isOpen={showPhotoSwipe} items={photos} options={options} close={() => setTimeout(onClose)} />
    </Portal>;
  }
}

interface IPreviewImagesProps {
  isOpen?: boolean;
  currentIndex?: number;
  photos: IPhotoProps[];
  onClose?: Function;
}

export interface IPhotoProps {
  title?: string;
  src: string;
  w: number;
  h: number;
  isloaded?: boolean;
}

interface IPreviewImagesStates {
  showPhotoSwipe?: boolean;
  photos?: IPhotoProps[];
  loading?: boolean;
}

export default PreviewImages;