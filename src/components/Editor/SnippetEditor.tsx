import { Editor } from "@monaco-editor/react";
import { Button } from "../ui/button";
import { useRef } from "react";

/* Imports editor types to manipulate the content inside the */
import type { editor } from "monaco-editor";

import { useSnippetsContext } from "@/App";

import Database from "@tauri-apps/plugin-sql";

interface Props {
  currentContent: string;
  currentId: number;
}

export const SnippetEditor = ({ currentContent, currentId }: Props) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const { updateShownSnippets } = useSnippetsContext();

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  async function editSnippetContent(newContent: string) {
    try {
      const db = await Database.load("sqlite:main.db");
      // It uses a placeholder text so it is easier to add the code later.
      await db.execute("UPDATE Snippets SET content = $1 WHERE id = $2", [
        newContent,
        currentId,
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  function onClickHandle() {
    const contentOfEditor = editorRef.current?.getValue();
    if (contentOfEditor) {
      editSnippetContent(contentOfEditor);
      updateShownSnippets();
    }
  }

  return (
    <section>
      <Editor
        height="95vh"
        width=""
        defaultLanguage="javascript"
        theme="vs-dark"
        value={currentContent}
        onMount={handleEditorDidMount}
      />
      <Button
        onClick={onClickHandle}
        className="absolute bottom-4 right-10 bg-emerald-500 text-black"
        variant="secondary"
        /* If there is no snippet being edited, disable the button */
        disabled={currentId ? false : true}
      >
        save
      </Button>
    </section>
  );
};
