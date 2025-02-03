import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import "./App.css";

import { FileNavigation, SnippetEditor } from "./components/index";

import Database from "@tauri-apps/plugin-sql";

type ContentContextTypes = {
  setContentToEdit: Dispatch<SetStateAction<string>>;
  setIdContentToEdit: Dispatch<SetStateAction<number>>;
};
type SnippetsContextTypes = {
  updateShownSnippets: () => void;
  snippets: Snippet[] | undefined;
};

type Snippet = {
  id: number;
  name: string;
  language: string;
  content: string;
};

const snippetsContext = createContext<SnippetsContextTypes | undefined>(
  undefined
);

const contentContext = createContext<ContentContextTypes | undefined>(
  undefined
);

/* Both functions should be improved to return something else in the case of an error. */
export function useContentContext() {
  const context = useContext(contentContext);
  if (!context) throw Error();
  return context;
}
export function useSnippetsContext() {
  const context = useContext(snippetsContext);
  if (!context) throw Error();
  return context;
}

function App() {
  const [contentToEdit, setContentToEdit] = useState<string>("");
  const [idContentToEdit, setIdContentToEdit] = useState<number>(0);

  const [snippets, setSnippets] = useState<Snippet[]>([]);

  async function updateShownSnippets() {
    try {
      const db = await Database.load("sqlite:main.db");
      const dbContent = await db.select<Snippet[]>("SELECT * FROM Snippets");
      // await db.execute('DELETE FROM snippets')

      setSnippets(dbContent);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex">
        <snippetsContext.Provider
          value={{
            snippets: snippets,
            updateShownSnippets: updateShownSnippets,
          }}
        >
          <contentContext.Provider
            value={{
              setContentToEdit: setContentToEdit,
              setIdContentToEdit: setIdContentToEdit,
            }}
          >
            <FileNavigation />
          </contentContext.Provider>
          <main className="bg-zinc-700 w-full text-white">
            <p className="h-[5vh]">Tabs Section</p>

            <SnippetEditor
              currentContent={contentToEdit}
              currentId={idContentToEdit}
            />
          </main>
        </snippetsContext.Provider>
      </div>
    </>
  );
}

export default App;
