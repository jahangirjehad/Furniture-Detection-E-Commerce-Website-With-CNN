
import React, { Component } from 'react';
import YouTube from 'react-youtube';
import Sidebar from './CustomNavbar';

class Iframee extends Component {
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
    const opts = {
      height: '300',
      width: '400',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };

    return (
      <>
      
      <div style={{display:"flex", justifyContent:'center', justifyItems:'center'}}>
      <YouTube videoId="d8k7rTscr_g" opts={opts} onReady={this._onReady} style={{margin:'20px'}} />
      <YouTube videoId="d8k7rTscr_g" opts={opts} onReady={this._onReady} style={{margin:'20px'}} />
      </div>
      </>
    );
  }
}

export default Iframee;
