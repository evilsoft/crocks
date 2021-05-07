import React from "react";
import CodeBlock from "@theme-init/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Embed from "react-runkit";
import clsx from "clsx";

import styles from "./styles.module.css";

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    const playgroundRef = React.useRef(null);
    const [height, setHeight] = React.useState(0);
    React.useLayoutEffect(() => {
      const newHeight = playgroundRef.current?.getBoundingClientRect().height;
      if (height !== newHeight) {
        setHeight(newHeight);
      }
    }, []);
    if (props.runkit) {
      return (
        <div ref={playgroundRef} className={styles.playgroundPreview}>
          <Tabs
            defaultValue="source"
            values={[
              { label: "Source", value: "source" },
              { label: "Runkit", value: "runkit" },
            ]}
          >
            <TabItem value="runkit">
              <div
                style={{
                  minHeight: height,
                }}
              >
                <Embed
                  data-gutter="inside"
                  source={props.children?.replace(
                    /import (.*?) from '([^']+)'/g,
                    'const $1 = require("$2");'
                  )}
                  {...props}
                />
              </div>
            </TabItem>
            <TabItem value="source">
              <Component {...props} />
            </TabItem>
          </Tabs>
        </div>
      );
    }

    return Component ? (
      <Component {...props} />
    ) : (
      <div>{JSON.stringify(props)}</div>
    );
  };

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
