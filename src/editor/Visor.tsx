import React, { FC } from "react";
import styled from "@emotion/styled";
import { EditorComponent, Remirror, useRemirror } from "@remirror/react";
import { defaultExtensions, IEditorProps } from ".";
import { managerExtensions } from "./lib";

export type IVisorProps = IEditorProps;

const Visor: FC<IVisorProps> = (props) => {
  const {
    extensions = defaultExtensions,
    initialContent: content,
    stringHandler,
  } = props;

  const input = {
    extensions,
    ...props,
  };

  const { manager, state: initialContent } = useRemirror({
    extensions: managerExtensions(input),
    content:
      (!stringHandler || stringHandler === "code") && content
        ? Object.create(JSON.parse(content))
        : content,
    stringHandler: stringHandler === "code" ? undefined : stringHandler,
  });

  return (
    <Remirror
      editable={false}
      manager={manager}
      initialContent={initialContent}
    >
      <Wrap>
        <EditorComponent />
      </Wrap>
    </Remirror>
  );
};

export default Visor;

export const Wrap = styled.div`
  display: contents;

  > div > div > pre {
    border-radius: 4px;
    margin: 0 !important;
  }
`;
