//@flow
import React from "react";

export type ReactVisibleProps = {
  visible: boolean,
  children: any
};

const ReactVisible = (props: ReactVisibleProps) => {
  return props.visible ? props.children : null;
};

// $FlowFixMe
function reactVisible<Props: {}>(
  // $FlowFixMe
  WrappedComponent: React.ComponentType<Props>
  // $FlowFixMe
): React.ComponentType<$Diff<Props, { visible: boolean | void }>> {
  const ReactVisibleHoc = (props: ReactVisibleProps) => {
    return props.visible === true ? <WrappedComponent {...props} /> : null;
  };

  return ReactVisibleHoc;
}

export { ReactVisible };
export default reactVisible;
