import React, { useState } from "react";
import { ProsemirrorNode } from "remirror";
import Editor, { editorNodeToHtml, IEditorProps } from "../Editor";
import { colors } from "../theme";
import { ImageValueAttrs } from "../extensions";

export default {
  title: "Extensions",
  component: Editor,
};

const Template = (args: IEditorProps) => {
  const [doc, setDoc] = useState<ProsemirrorNode>();

  return (
    <>
      <Editor onChange={setDoc} {...args} />
      <p style={{ color: colors.grey1 }}>
        {doc &&
          JSON.stringify(
            args.stringHandler === "html" ? editorNodeToHtml(doc) : doc
          )}
      </p>
    </>
  );
};

export const RichText = Template.bind({});

RichText.args = {
  extensions: [
    {
      name: "heading",
      attrs: {
        levels: [1, 2, 3],
        translateFn: (key: string) =>
          key === "p" ? "Paragraph" : `Heading ${key.slice(1)}`,
      },
    },
    "bold",
    "italic",
    "underline",
  ],
};

export const Code = Template.bind({});

Code.args = {
  extensions: [
    "code",
    {
      name: "code-block",
      attrs: {
        language: "css",
      },
    },
  ],
};

export const Counter = Template.bind({});

Counter.args = {
  extensions: [
    {
      name: "counter",
      attrs: {
        maximumStrategy: "characters",
        maximum: 10,
      },
    },
  ],
};

export const TextColor = Template.bind({});

TextColor.args = {
  extensions: [
    {
      name: "text-color",
      attrs: {
        color: colors.orange1,
      },
    },
    {
      name: "text-highlight",
      attrs: {
        color: colors.orange1,
      },
    },
  ],
};

export const TextcolorHandler = Template.bind({});

TextcolorHandler.args = {
  colorHandler: (onChange: (value?: string) => void, value?: string) => (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
      }}
    >
      <button
        onClick={() => onChange(colors.red1)}
        disabled={value === colors.red1}
      >
        Red
      </button>
      <button
        onClick={() => onChange(colors.turquoise1)}
        disabled={value === colors.turquoise1}
      >
        Turquoise
      </button>
      <button
        onClick={() => onChange(colors.yellow1)}
        disabled={value === colors.yellow1}
      >
        Yellow
      </button>
      <button onClick={() => onChange()} disabled={value === undefined}>
        No color
      </button>
    </div>
  ),
  extensions: [
    {
      name: "text-color",
    },
    {
      name: "text-highlight",
    },
  ],
};

export const SubSup = Template.bind({});

SubSup.args = {
  extensions: ["sub", "sup"],
};

export const Lists = Template.bind({});

Lists.args = {
  extensions: ["bullet-list", "ordered-list"],
};

export const Link = Template.bind({});

Link.args = {
  extensions: [
    {
      name: "link",
      attrs: {
        linkHandler: (onChange: (value?: string) => void, value?: string) => {
          const [href, setHref] = useState(value);

          return (
            <div
              style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "baseline",
              }}
            >
              <input onChange={(e) => setHref(e.target.value)} value={href} />
              <button onClick={() => onChange(href)}>Submit</button>
              <button onClick={() => onChange()}>Delete</button>
            </div>
          );
        },
      },
    },
  ],
};

export const AutoLink = Template.bind({});

AutoLink.args = {
  extensions: [
    {
      name: "link",
      attrs: {
        autoLink: true,
      },
    },
  ],
  placeholder: `Type "www.educacion.bq.com" to insert a link`,
  stringHandler: "html",
};

export const Image = Template.bind({});

Image.args = {
  extensions: [
    {
      name: "image",
      attrs: {
        imageHandler: (
          onChange: (value?: string, attrs?: ImageValueAttrs) => void
        ) => {
          const [src, setSrc] = useState("");
          const [height, setHeight] = useState("");

          return (
            <div
              style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "baseline",
              }}
            >
              <label>Src</label>
              <input onChange={(e) => setSrc(e.target.value)} value={src} />
              <label>Height</label>
              <input
                onChange={(e) => setHeight(e.target.value)}
                value={height}
              />
              <button onClick={() => onChange(src, { height })}>Submit</button>
              <button onClick={() => onChange()}>Cancel</button>
            </div>
          );
        },
      },
    },
  ],
};

// export const ImageResizable = Template.bind({});

// ImageResizable.args = {
//   extensions: [
//     {
//       name: "image",
//       attrs: {
//         accept: [".png", ".gif", ".jpg", ".jpeg", ".webp", ".svg"],
//         resizable: true,
//         onUpload: () => {
//           return new Promise((resolve) => resolve(image));
//         },
//       },
//     },
//   ],
// };

export const Align = Template.bind({});

Align.args = {
  extensions: ["align"],
};

export const Indent = Template.bind({});

Indent.args = {
  extensions: ["indent"],
};