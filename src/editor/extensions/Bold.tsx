import { useActive, useCommands } from "@remirror/react";
import classNames from "classnames";
import React, { FC } from "react";
import { BoldExtension } from "remirror/extensions";
import { extensions, ExtensionType } from "../../types.d";
import ToolbarButton from "../ToolbarButton";

const BoldButton: FC = () => {
  const active = useActive();
  const { toggleBold } = useCommands();

  return (
    <ToolbarButton
      className={classNames({ active: active.bold() })}
      disabled={!toggleBold.enabled()}
      onClick={() => {
        toggleBold();
        focus();
      }}
    >
      B
    </ToolbarButton>
  );
};

const Bold: ExtensionType = {
  extensionFunction: BoldExtension,
  toolbarHandler: BoldButton,
  name: extensions.bold,
};

export default Bold;
