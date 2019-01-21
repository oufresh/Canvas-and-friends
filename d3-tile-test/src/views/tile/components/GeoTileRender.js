//@flow
import { branch, renderNothing } from "recompose";
import { TileRender, type TileRenderPropsType } from "./TileRender";

// $FlowFixMe
const GeoTileRender = branch(
  (props: TileRenderPropsType): boolean =>
    !(props.width && props.height && props.scales),
  renderNothing
)(TileRender);

export { GeoTileRender };
