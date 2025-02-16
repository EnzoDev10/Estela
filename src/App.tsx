import React, {
	createContext,
	useState,
	Dispatch,
	SetStateAction,
	useContext,
} from 'react';
import './App.css';

import { FileNavigation, SnippetEditor } from './components/index';

import Database from '@tauri-apps/plugin-sql';
/* 
SnippetsContext shares both the state variable that contains 
the created snippets and a function to update it based on the content of the database.
*/
type SnippetsContextTypes = {
	updateShownSnippets: () => void;
	snippets: Snippet[] | undefined;
};

const snippetsContext = createContext<SnippetsContextTypes | undefined>(
	undefined
);

export function useSnippetsContext() {
	const content = useContext(snippetsContext);
	if (content === undefined) {
		throw Error('Snippet context error');
	}
	return content;
}

const SnippetsProvider: React.Provider<SnippetsContextTypes> =
	snippetsContext.Provider as any;

/*
contentContext provides the setter for a state variable that contains
the data of the chosen snippet to be edited.
 */
type ContentContextTypes = {
	setSnippetForEditor: Dispatch<SetStateAction<Snippet | undefined>>;
	snippetForEditor: Snippet | undefined;
};

const contentContext = createContext<ContentContextTypes | undefined>(
	undefined
);

export function useContentContext() {
	const content = useContext(contentContext);
	if (content == undefined) {
		throw Error(
			'UseContentCOntext requires ContentContextProvider to be used higher in the component tree.'
		);
	}
	return content;
}

const ContentProvider: React.Provider<ContentContextTypes> =
	contentContext.Provider as any;

function App() {
	const [snippetForEditor, setSnippetForEditor] = useState<
		Snippet | undefined
	>();

	const [snippets, setSnippets] = useState<Snippet[]>([]);
	/* 
	connects to the database and updates a state variable that
	 contains all the currently created snippets. */
	async function updateShownSnippets() {
		try {
			const db = await Database.load('sqlite:main.db');
			const dbContent = await db.select<Snippet[]>('SELECT * FROM Snippets');
			// await db.execute('DELETE FROM snippets')

			setSnippets(dbContent);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<>
			<div className='flex'>
				<SnippetsProvider
					value={{
						snippets: snippets,
						updateShownSnippets: updateShownSnippets,
					}}
				>
					<ContentProvider
						value={{
							setSnippetForEditor: setSnippetForEditor,
							snippetForEditor: snippetForEditor,
						}}
					>
						<FileNavigation />
						<main className='bg-zinc-800 w-full text-white'>
							<SnippetEditor currentSnippet={snippetForEditor} />
						</main>
					</ContentProvider>
				</SnippetsProvider>
			</div>
		</>
	);
}

export default App;
