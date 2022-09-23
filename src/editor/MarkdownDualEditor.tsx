import {
  ReactExtensions,
  Remirror,
  useRemirror,
  UseRemirrorReturn,
} from "@remirror/react";
import { createContextState } from "create-context-state";
import langMarkdown from "refractor/lang/markdown.js";
import React, { FC } from "react";
import { DocExtension } from "remirror/extensions";
import { CodeBlockExtension } from "./extensions";
import { managerExtensions } from "./lib";
import { IEditorProps } from ".";
import { RemirrorEventListenerProps } from "remirror";

interface Props {
  visual: UseRemirrorReturn<ReactExtensions<any>[number]>;
  markdown: UseRemirrorReturn<ReactExtensions<any>>;
}

interface Context extends Props {
  setMarkdown: (markdown: string) => void;
  setVisual: (markdown: string) => void;
}

const [EditorProvider, useEditor] = createContextState<Context, Props>(
  ({ props }) => {
    return {
      ...props,
      setMarkdown: (text: string) => {
        return props.markdown.getContext()?.setContent({
          type: "doc",
          content: [
            {
              type: "codeBlock",
              attrs: { language: "markdown" },
              content: text ? [{ type: "text", text }] : undefined,
            },
          ],
        });
      },
      setVisual: (markdown: string) => {
        return props.visual.getContext()?.setContent(markdown);
      },
    };
  }
);

const MarkdownDualEditor: FC<IEditorProps> = ({
  children,
  initialContent: content,
  stringHandler,
  ...props
}) => {
  const input = {
    stringHandler,
    ...props,
  };

  const visual = useRemirror({
    extensions: managerExtensions(input),
    content,
    stringHandler,
  });

  const markdown = useRemirror({
    extensions: () => [
      new DocExtension({ content: "codeBlock" }),
      new CodeBlockExtension({
        defaultLanguage: "markdown",
        supportedLanguages: [langMarkdown],
        syntaxTheme: "base16_ateliersulphurpool_light",
        defaultWrap: true,
      }),
    ],
    builtin: {
      exitMarksOnArrowPress: false,
    },
    stringHandler,
  });

  const Provider: any = EditorProvider;

  return (
    <Provider visual={visual} markdown={markdown}>
      <VisualEditor>{children}</VisualEditor>
      <MarkdownTextEditor />
    </Provider>
  );
};

const VisualEditor: FC = ({ children }) => {
  const { visual, setMarkdown } = useEditor();

  return (
    <Remirror
      manager={visual.manager}
      onChange={({
        helpers,
        state,
      }): RemirrorEventListenerProps<Remirror.Extensions> => {
        setMarkdown(helpers.getMarkdown(state));
        return null;
      }}
      initialContent={visual.state}
    >
      {children}
    </Remirror>
  );
};

const MarkdownTextEditor: FC = () => {
  const { markdown, setVisual } = useEditor();

  return (
    <Remirror
      manager={markdown.manager}
      autoRender="end"
      onChange={({
        helpers,
        state,
      }): RemirrorEventListenerProps<Remirror.Extensions> => {
        const text = helpers.getText({ state });
        setVisual(text);
        return null;
      }}
    />
  );
};

export default MarkdownDualEditor;
