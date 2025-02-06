import { Editor } from '@monaco-editor/react';
import { Button } from '../ui/button';
import { useRef, useState } from 'react';

/* Imports editor types to manipulate the content inside the */
import type { editor } from 'monaco-editor';

import { useSnippetsContext } from '@/App';

import Database from '@tauri-apps/plugin-sql';

type Snippet = {
	id: number;
	name: string;
	language: string;
	content: string;
};

interface Props {
	currentSnippet: Snippet | undefined;
}

export const SnippetEditor = ({ currentSnippet }: Props) => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const { updateShownSnippets } = useSnippetsContext();
	const [wereChangesMade, setWereChangesMade] = useState(false);

	/* 
  Declaring a variable just to update shown content inside editor.
  Tried to also use it for editor Props but it gives errors.
  */
	let snippet: Snippet;

	if (currentSnippet) snippet = currentSnippet;

	async function editSnippetContent(newContent: string) {
		try {
			const db = await Database.load('sqlite:main.db');
			// It uses a placeholder text so it is easier to add the code later.
			await db.execute('UPDATE Snippets SET content = $1 WHERE id = $2', [
				newContent,
				snippet.id,
			]);
			updateShownSnippets();
		} catch (error) {
			console.log(error);
		}
	}
	function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
		editorRef.current = editor;
	}

	function onClickHandle() {
		const contentOfEditor = editorRef.current?.getValue();
		if (contentOfEditor) {
			snippet.content = contentOfEditor;
			editSnippetContent(contentOfEditor);
			setWereChangesMade(false);
		}
	}

	/* The button only changes color when the content on the editor is not equal to the original content. */
	function checkIfChanged() {
		if (currentSnippet?.content === editorRef.current?.getValue()) {
			setWereChangesMade(false);
		} else {
			setWereChangesMade(true);
		}
	}

	return (
		<section>
			<Editor
				height='95vh'
				width=''
				language={currentSnippet?.language}
				theme='vs-dark'
				value={currentSnippet?.content}
				onMount={handleEditorDidMount}
				onChange={() => checkIfChanged()}
			/>
			<Button
				onClick={onClickHandle}
				className={`absolute bottom-4 right-10 text-black ${
					wereChangesMade ? 'bg-emerald-500' : ''
				} `}
				variant='secondary'
				/* If there is no snippet being edited, disable the button */
				disabled={currentSnippet?.id ? false : true}
			>
				save
			</Button>
		</section>
	);
};
