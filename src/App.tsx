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

export function useSnippetsContext() {
	const content = useContext(snippetsContext);
	if (content === undefined) {
		throw Error('Snippet context error');
	}
	return content;
}

const SnippetsProvider: React.Provider<SnippetsContextTypes> =
	snippetsContext.Provider as any;

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
	const [snippetToEdit, setSnippetToEdit] = useState<Snippet>();

	const [snippets, setSnippets] = useState<Snippet[]>([]);

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
					<ContentProvider value={{ setSnippetToEdit: setSnippetToEdit }}>
						<FileNavigation />
					</ContentProvider>
					<main className='bg-zinc-800 w-full text-white'>
						<header className='flex justify-between'>
							<span className=' border-zinc-500 border border-b-0 min-w-16 min-h-7 px-5 py-1.5 text-center'>
								{snippetToEdit?.name}
							</span>
							<span className='pr-5  min-w-16 min-h-7 px-5 py-1.5 text-center'>
								{snippetToEdit?.language}
							</span>
						</header>

						<SnippetEditor currentSnippet={snippetToEdit} />
					</main>
				</SnippetsProvider>
			</div>
		</>
	);
}

export default App;
