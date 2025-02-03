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
  setSnippetToEdit: Dispatch<SetStateAction<Snippet | undefined>>;
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
  const [snippetToEdit, setSnippetToEdit] = useState<Snippet>();

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
            value={{ setSnippetToEdit: setSnippetToEdit }}
          >
            <FileNavigation />
          </contentContext.Provider>
          <main className="bg-zinc-800 w-full text-white">
            <header className="flex justify-between">
              <span className=" border-zinc-500 border border-b-0 min-w-16 min-h-7 px-5 py-1.5 text-center">
                {snippetToEdit?.name}
              </span>
              <span className="pr-5  min-w-16 min-h-7 px-5 py-1.5 text-center">
                {snippetToEdit?.language}
              </span>
            </header>

            <SnippetEditor currentSnippet={snippetToEdit} />
          </main>
        </snippetsContext.Provider>
      </div>
    </>
  );
}

export default App;
