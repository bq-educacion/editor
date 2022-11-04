import React from "react";
import { IEditorProps } from "..";
import {
  BoldButton,
  BulletListButton,
  CodeBlockButton,
  CodeButton,
  HeadingButtons,
  ImageButton,
  ItalicButton,
  LinkButton,
  OrderedListButton,
  TextColorButton,
  UnderlineButton,
} from "../extensions";

const toolbarHandlers = ({
  acceptMedia,
  enableImageResizing,
  codeLanguage,
  color,
  extensions = [],
  headingLevels,
  onUploadMedia,
  stringHandler,
}: IEditorProps) =>
  extensions.map((extensionsArray) =>
    extensionsArray.map((extension, index) => (
      <React.Fragment key={index}>
        {extension === "bold" && <BoldButton />}
        {extension === "bulletList" && <BulletListButton />}
        {extension === "code" && <CodeButton />}
        {extension === "codeBlock" && (
          <CodeBlockButton language={codeLanguage} />
        )}
        {extension === "heading" && <HeadingButtons levels={headingLevels} />}
        {extension === "image" && (
          <ImageButton
            accept={acceptMedia?.image}
            enableResizing={enableImageResizing}
            onUpload={onUploadMedia}
          />
        )}
        {extension === "italic" && <ItalicButton />}
        {extension === "link" && <LinkButton />}
        {extension === "orderedList" && <OrderedListButton />}
        {extension === "textColor" && stringHandler !== "markdown" && (
          <TextColorButton color={color} />
        )}
        {extension === "underline" && stringHandler !== "markdown" && (
          <UnderlineButton />
        )}
      </React.Fragment>
    ))
  );

export default toolbarHandlers;
