/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { PolygonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { connect } from 'react-redux';
import GL from '@luma.gl/constants';

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
};

const findColor = (object, lineLetter) => {
  for (let routes in object) {
    if (routes.indexOf(lineLetter.toLowerCase()) > -1) {
      return object[routes];
    }
  }
};

const timestampsForCurrentTime = (timestamps, currentTime) => {
  const initialTime = timestamps[0];
  // console.log(curren)
  return timestamps.map(
    (timestamp) => currentTime + ((timestamp - initialTime) % 86400)
  );
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 0.0,
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 20,
  position: [-74.05, 40.7, 8000],
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const material = {
  ambient: 1.0,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70],
};

const mapBorders = {
  width: '100vw',
  height: '100vh',
};

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColors: {
    a_c_e: [0, 175, 245],
    b_d_f_m: [255, 116, 0],
    g: [0, 255, 39],
    j_z: [236, 79, 0],
    n_q_r_w: [236, 236, 0],
    l: [235, 235, 235],
    '1_2_3': [245, 50, 50],
    '4_5_6': [0, 200, 100],
    '7': [197, 0, 236],
  },
  trailColor0: [255, 116, 0],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect],
};

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0,
};

const landCover = [
  [
    [-74.0, 40.7],
    [-74.02, 40.7],
    [-74.02, 40.72],
    [-74.0, 40.72],
  ],
];

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 86400, // unit corresponds to the timestamp in source data
      animationSpeed = 1, // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength,
    });

    this._animationFrame = window.requestAnimationFrame(
      this._animate.bind(this)
    );
  }

  _renderLayers() {
    const {
      buildings = DATA_URL.BUILDINGS,
      trailLength = 300,
      theme = DEFAULT_THEME,
    } = this.props;
    return [
      // This is only needed when using shadow effects
      new PolygonLayer({
        id: 'ground',
        data: landCover,
        getPolygon: (f) => f,
        stroked: false,
        getFillColor: [0, 0, 0, 0],
      }),
      new TripsLayer({
        id: 'trips',
        data: this.props.lines,
        getPath: (d) => d.path,
        getTimestamps: (d) =>
          timestampsForCurrentTime(d.timestamps, this.state.time),
        getColor: (d) => theme.trailColor0,
        opacity: 0.7,
        widthMinPixels: 5,
        rounded: true,
        trailLength,
        currentTime: this.state.time,

        shadowEnabled: true,
      }),
      new PolygonLayer({
        id: 'buildings',
        data: buildings,
        extruded: true,
        wireframe: false,
        opacity: 0.7,
        getPolygon: (f) => f.polygon,
        getElevation: (f) => f.height,
        getFillColor: theme.buildingColor,
        material: theme.material,
      }),
    ];
  }

  render() {
    const {
      viewState,
      mapStyle = 'mapbox://styles/bjlmckelway/ck8df7aqb0q661is3wxma06lt',
      theme = DEFAULT_THEME,
    } = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        effects={theme.effects}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={true}
        style={mapBorders}
        parameters={{
          clearColor: [0, 0.2, 0.2, 0.2],
          // blendColor: [1, 0, 0, 0.1],
          blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
          blendEquation: GL.FUNC_ADD,
        }}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={
            'pk.eyJ1IjoiYmpsbWNrZWx3YXkiLCJhIjoiY2s3dW9ubGU1MDY4MjNkbW4zaHIxcDRheCJ9.c3HiQrOPIJZXgK-sC_qhcg'
          }
        />
      </DeckGL>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lines: state.lines,
  };
};

export default connect(mapStateToProps)(Map);
