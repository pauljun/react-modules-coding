import React from 'react';
import PropTypes from 'prop-types';
import addEventListener from 'add-dom-event-listener';

export default class PlayDragEvent extends React.Component {
  static childContextTypes = {
    getPlayContainer: PropTypes.func,
    player: PropTypes.object,
    fileData: PropTypes.object,
    playStatus: PropTypes.string,
    setPlayStatus: PropTypes.func,
    isLiving: PropTypes.bool,
    stretching: PropTypes.string,
    setStretching: PropTypes.func,
    isLoop: PropTypes.bool
  };
  componentDidMount() {
    console.log(this.props)
    // const { getPlayContainer } = this.context;
    // console.log(getPlayContainer());
  }
  initEvent(){
    const {playInstance} = this.props;
    this.playDom = playInstance.playerContainerRef.current;

  }
  render() {
    return <div className="drag-marker-video" draggable={true}></div>;
  }
}
