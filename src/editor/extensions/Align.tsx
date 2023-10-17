import { useRemirrorContext } from "@remirror/react";
import React, { FC } from "react";
import { NodeFormattingExtension } from "remirror/extensions";
import AlignCenterIcon from "../assets/icons/AlignCenter";
import AlignLeftIcon from "../assets/icons/AlignLeft";
import AlignRightIcon from "../assets/icons/AlignRight";
import { ToolbarButton } from "../components";

export const AlignName = "align";

export type AlignAttrs = Record<string, never>;

const AlignButtons: FC<AlignAttrs> = () => {
  const { commands } = useRemirrorContext({ autoUpdate: true });

  return (
    <>
      <ToolbarButton onClick={() => commands.leftAlign()}>
        <AlignLeftIcon />
      </ToolbarButton>
      <ToolbarButton onClick={() => commands.centerAlign()}>
        <AlignCenterIcon />
      </ToolbarButton>
      <ToolbarButton onClick={() => commands.rightAlign()}>
        <AlignRightIcon />
      </ToolbarButton>
    </>
  );
};

export { AlignButtons, NodeFormattingExtension };
