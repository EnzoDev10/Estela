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

type SnippetsContextTypes = {
	updateShownSnippets: () => void;
	snippets: Snippet[] | undefined;
};

const snippetsContext = createContext<SnippetsContextTypes | undefined>(
	undefined
);

export function useSnippetsContext() {
	const content = useContext(snippetsContext);
	if (!content) {
		throw Error('Snippet context error');
	}
	return content;
}

const SnippetsProvider: React.Provider<SnippetsContextTypes> =
	snippetsContext.Provider as any;

type ContentContextTypes = {
	setSnippetForEditor: Dispatch<SetStateAction<Snippet | undefined>>;
	snippetForEditor: Snippet | undefined;
};

const contentContext = createContext<ContentContextTypes | undefined>(
	undefined
);

export function useContentContext() {
	const content = useContext(contentContext);
	if (!content) {
		throw Error(
			'UseContentCOntext requires ContentContextProvider to be used higher in the component tree.'
		);
	}
	return content;
}

const ContentProvider: React.Provider<ContentContextTypes> =
	contentContext.Provider as any;

type SettingsContextTypes = {
	theme: string;
	setTheme: Dispatch<SetStateAction<string>>;
};

const SettingsContext = createContext<SettingsContextTypes | null>(null);

export function useSettingsContext() {
	const content = useContext(SettingsContext);
	if (!content) {
		throw Error(
			'UseSettingsContext requires SettingsContextProvider to be used higher in the component tree.'
		);
	}
	return content;
}

const SettingsProvider: React.Provider<SettingsContextTypes> =
	SettingsContext.Provider as any;

function App() {
	const [snippetForEditor, setSnippetForEditor] = useState<
		Snippet | undefined
	>();
	const [theme, setTheme] = useState(() => {
		if (localStorage.getItem('theme') == undefined) {
			localStorage.setItem('theme', 'csb');
		}
		let test = JSON.parse(localStorage.getItem('theme')!);
		return test;
	});
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
			<SettingsProvider value={{ theme, setTheme }}>
				<div className={`${theme} flex w-full h-screen overflow-hidden`}>
					<SnippetsProvider
						value={{
							snippets,
							updateShownSnippets,
						}}
					>
						<ContentProvider
							value={{
								setSnippetForEditor,
								snippetForEditor,
							}}
						>
							<FileNavigation />
							<SnippetEditor currentSnippet={snippetForEditor} />
						</ContentProvider>
					</SnippetsProvider>
				</div>
			</SettingsProvider>
		</>
	);
}

export default App;
