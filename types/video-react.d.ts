export const Bezel: any;
export const BigPlayButton: any;
export const ControlBar: any;
export const CurrentTimeDisplay: any;
export const DurationDisplay: any;
export const ForwardControl: any;
export const FullscreenToggle: any;
export const LoadProgressBar: any;
export const LoadingSpinner: any;
export const MenuButton: any;
export const MouseTimeDisplay: any;
export const PlayProgressBar: any;
export const PlayToggle: any;
export const PlaybackRate: any;
export const PlaybackRateMenuButton: any;
export const Player: any;
export const PosterImage: any;
export const ProgressControl: any;
export const RemainingTimeDisplay: any;
export const ReplayControl: any;
export const SeekBar: any;
export const Shortcut: any;
export const Slider: any;
export const TimeDivider: any;
export const Video: any;
export const VolumeMenuButton: any;
export const operationReducer: any;
export namespace playerActions {
  const FULLSCREEN_CHANGE: string;
  const OPERATE: string;
  const PLAYER_ACTIVATE: string;
  const USER_ACTIVATE: string;
  function activate(activity: any): any;
  function changeRate(rate: any, ...args: any[]): any;
  function changeVolume(volume: any, ...args: any[]): any;
  function forward(seconds: any, ...args: any[]): any;
  function handleFullscreenChange(isFullscreen: any): any;
  function mute(muted: any, ...args: any[]): any;
  function pause(...args: any[]): any;
  function play(...args: any[]): any;
  function replay(seconds: any, ...args: any[]): any;
  function seek(time: any, ...args: any[]): any;
  function toggleFullscreen(player: any): any;
  function togglePlay(...args: any[]): any;
  function userActivate(activity: any): any;
}
export const playerReducer: any;
export namespace videoActions {
  const ABORT: string;
  const CAN_PLAY: string;
  const CAN_PLAY_THROUGH: string;
  const DURATION_CHANGE: string;
  const EMPTIED: string;
  const END: string;
  const END_SEEKING: string;
  const ERROR: string;
  const LOADED_DATA: string;
  const LOADED_META_DATA: string;
  const LOAD_START: string;
  const PAUSE: string;
  const PLAY: string;
  const PLAYING: string;
  const PROGRESS_CHANGE: string;
  const RATE_CHANGE: string;
  const RESIZE: string;
  const SEEKED: string;
  const SEEKING: string;
  const SEEKING_TIME: string;
  const STALLED: string;
  const SUSPEND: string;
  const TIME_UPDATE: string;
  const VOLUME_CHANGE: string;
  const WAITING: string;
  function handleAbort(videoProps: any): any;
  function handleCanPlay(videoProps: any): any;
  function handleCanPlayThrough(videoProps: any): any;
  function handleDurationChange(videoProps: any): any;
  function handleEmptied(videoProps: any): any;
  function handleEnd(videoProps: any): any;
  function handleEndSeeking(time: any): any;
  function handleError(videoProps: any): any;
  function handleLoadStart(videoProps: any): any;
  function handleLoadedData(videoProps: any): any;
  function handleLoadedMetaData(videoProps: any): any;
  function handlePause(videoProps: any): any;
  function handlePlay(videoProps: any): any;
  function handlePlaying(videoProps: any): any;
  function handleProgressChange(videoProps: any): any;
  function handleRateChange(videoProps: any): any;
  function handleResize(videoProps: any): any;
  function handleSeeked(videoProps: any): any;
  function handleSeeking(videoProps: any): any;
  function handleSeekingTime(time: any): any;
  function handleStalled(videoProps: any): any;
  function handleSuspend(videoProps: any): any;
  function handleTimeUpdate(videoProps: any): any;
  function handleVolumeChange(videoProps: any): any;
  function handleWaiting(videoProps: any): any;
}
