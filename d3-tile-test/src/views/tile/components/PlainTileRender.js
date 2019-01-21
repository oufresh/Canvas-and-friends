//@flow
import { branch, renderNothing } from "recompose";
import { TileRender, type TileRenderPropsType } from "./TileRender";

// $FlowFixMe
const PlainTileRender = branch(
  (props: TileRenderPropsType): boolean =>
    !(props.width && props.height && props.scales && props.objectSize),
  renderNothing
)(TileRender);

export { PlainTileRender };
