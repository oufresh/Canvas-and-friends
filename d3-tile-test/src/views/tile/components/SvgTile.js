//@flow
import React from "react";
import { TILE_SIZE } from "../../../modules";

export type SvgTilePropsType = {
  svgContent?: string, //da usare in futuro con fetch fatta nel middleware
  url?: string,
  x: number,
  y: number,
  z: number,
  tilePromise?: string => Promise<any>
};

/**
 * Crea l'oggetto per iniettare il markup svg nel componente
 * @param {string} svg markup della tile
 */
const createSvgMarkup = (svg?: string): Object => {
  return { __html: svg };
};

type State = {
  svgString: string
};

/**
 * Componente React per il rendering delle Tile
 */
export class SvgTile extends React.PureComponent<SvgTilePropsType, State> {
  state: State;

  constructor(props: SvgTilePropsType) {
    super(props);
    this.state = {
      svgString: this.props.svgContent ? this.props.svgContent : ""
    };
  }

  componentDidMount() {
    const { url, tilePromise } = this.props;
    if (url) {
      if (tilePromise) {
        tilePromise(url).then(svgString =>
          this.setState({
            svgString
          })
        );
      } else {
        fetch(url)
          .then(r => {
            if (r.ok === true) return r.text();
            else throw new Error(r.statusText);
          })
          .then(svgString => {
            //console.log('Received tile: ' + svgString);
            this.setState({
              svgString
            });
          })
          .catch(e => {
            /* eslint-disable no-console */
            console.error(e);
            /* eslint-enable no-console */
          });
      }
    }
  }

  render() {
    const content = createSvgMarkup(this.state.svgString);
    //prettier-ignore
    const transform = "translate(" + this.props.x * TILE_SIZE + " " + this.props.y * TILE_SIZE + ")";

    return (
      <g
        transform={transform}
        width={TILE_SIZE}
        height={TILE_SIZE}
        dangerouslySetInnerHTML={content}
      />
    );
  }
}
