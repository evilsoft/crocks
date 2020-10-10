import React from "react";
import CodeBlock from "@theme-init/CodeBlock";
import Embed from "react-runkit";
import clsx from "clsx";

import styles from "./styles.module.css";

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    const [run, setRun] = React.useState(false);
    if (props.runkit) {
      return (
        <div className={styles.playgroundPreview}>
          {run ? (
            <Embed
              data-gutter="inside"
              source={props.children?.replace(
                /import (.*?) from '([^']+)'/g,
                'const $1 = require("$2");'
              )}
              {...props}
            />
          ) : (
            <Component {...props} />
          )}
          <button
            className={clsx("button", "button--warning")}
            type="button"
            onClick={() => setRun((prevState) => !prevState)}
          >
            {run ? "Source" : "runkit"}
          </button>
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
