//@flow
/* eslint react/prop-types: 0 */
/* eslint-disable no-alert, no-console */
import React from "react";
import styled from "styled-components";
import { ZoomingSurface } from "../../src/views/zoom/ZoomingSurface";

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const MapContainer = styled.div`
  position: relative;
  border: 1px solid black;
  width: 800px;
  height: 600px;
  background-color: black;
`;

const viewPortWidth = 800;
const viewPortHeight = 600;
const defaultObjectPosition = [0, 0];

const DemoShape = () => {
  return (
    <React.Fragment>
      <g>
        <rect
          x="0"
          y="0"
          width="800"
          height="600"
          style={{ fill: "rgb(200,200,200)" }}
        />
      </g>
      <g>
        <line
          x1={0}
          y1={0}
          x2={viewPortWidth}
          y2={viewPortHeight}
          style={{ stroke: "rgb(255,0,0)", strokeWidth: 1 }}
        />
        <line
          x1={0}
          y1={viewPortHeight}
          x2={viewPortWidth}
          y2={0}
          style={{ stroke: "rgb(255,0,0)", strokeWidth: 1 }}
        />
      </g>
    </React.Fragment>
  );
};

class SurfaceDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: [0, 0],
      enableZoom: true,
      transform: {
        x: 0,
        y: 0,
        k: 1
      }
    };
  }

  onZoomed = (x, y, k) => {
    const transform = { x, y, k };
    this.setState({ transform });
  };

  onMouseMove = coords => {
    this.setState({ coords });
  };

  onEnableZoom = () => {
    this.setState({ enableZoom: !this.state.enableZoom });
  };

  render() {
    return (
      <Container>
        <MapContainer>
          <ZoomingSurface
            id={"Prova"}
            width={viewPortWidth}
            height={viewPortHeight}
            onZoomed={this.onZoomed}
            transform={this.state.transform}
            onMouseMove={this.onMouseMove}
            enableZoom={this.state.enableZoom}
            enableButtonMovement={true}
          >
            <DemoShape />
          </ZoomingSurface>
        </MapContainer>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Map X</td>
                <td>{this.state.coords[0]}</td>
              </tr>
              <tr>
                <td>Map Y</td>
                <td>{this.state.coords[1]}</td>
              </tr>
              <tr>
                <td>Zoom enabled</td>
                <td>
                  <button onClick={this.onEnableZoom}>
                    {this.state.enableZoom ? "ON" : "OFF"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    );
  }
}

export default SurfaceDemo;
