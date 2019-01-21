//@flow
import { branch, renderNothing } from "recompose";
import { SvgRender, type SvgRenderPropsType } from "./SvgRender";

// $FlowFixMe
const SingleSvg = branch(
  (props: SvgRenderPropsType): boolean =>
    !(props.width && props.height && props.transform),
  renderNothing
)(SvgRender);

export { SingleSvg };
