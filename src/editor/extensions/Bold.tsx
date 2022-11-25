import {
  useActive,
  useChainedCommands,
  useCommands,
  useCurrentSelection,
} from "@remirror/react";
import classNames from "classnames";
import React, { FC } from "react";
import { BoldExtension } from "remirror/extensions";
import BoldIcon from "../assets/icons/Bold";
import { ToolbarButton } from "../utils";

const BoldButton: FC = () => {
  const active = useActive();
  const chain = useChainedCommands();
  const { toggleBold } = useCommands();
  const { to, from } = useCurrentSelection();

  return (
    <ToolbarButton
      className={classNames({ active: active.bold() })}
      disabled={!toggleBold.enabled()}
      onClick={() => {
        chain.focus({ to, from }).run();
        toggleBold();
      }}
    >
      <BoldIcon />
    </ToolbarButton>
  );
};

export { BoldButton, BoldExtension };
