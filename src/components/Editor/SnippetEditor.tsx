import { Editor /* , DiffEditor, loader */ } from "@monaco-editor/react";

export const SnippetEditor = () => {
  return (
    <>
      <Editor
        height="95vh"
        defaultLanguage="javascript"
        defaultValue='const example = "this is an example"'
        theme="vs-dark"
      />
    </>
  );
};
