import "./App.css";

import { FileNavigation, SnippetEditor } from "./components/index";

function App() {
  return (
    <>
      <div className="flex">
        <FileNavigation />
        <main className="bg-zinc-700 w-full text-white">
          <SnippetEditor />
        </main>
      </div>
    </>
  );
}

export default App;
