import React, { Component } from 'react';
import PlayAudio from 'react-simple-audio-player';
import chroma from 'chroma-js';

import './Audio.css';
const colorScale = chroma.scale(['#A9A9A9', '#181818']).mode('lch').colors(3);

class Audio extends Component {
  render() {
    return (
      <div id="audio">
        <PlayAudio
          url={'../HaroldBudd.mp3'}
          colorScale={colorScale}
          width={'30px'}
          simpleMode={true}
          playing={true}
        />
      </div>
    );
  }
}
export default Audio;
