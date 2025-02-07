import { Editor } from '@monaco-editor/react';
import { Button } from '../ui/button';
import { useRef, useState } from 'react';

import type { editor } from 'monaco-editor';

import { useSnippetsContext } from '@/App';

import Database from '@tauri-apps/plugin-sql';

interface Props {
	currentSnippet: Snippet | undefined;
}

export const SnippetEditor = ({ currentSnippet }: Props) => {
	// Ref to get the content of the editor.
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const { updateShownSnippets } = useSnippetsContext();

	const [wereChangesMade, setWereChangesMade] = useState(false);

	// Declaring a variable just to update the content inside the editor.
	// Tried to also use it for Props but it gave errors.

	let snippet: Snippet;

	if (currentSnippet) snippet = currentSnippet;

	// function to update content of a snippet with the value inside editor.
	async function editSnippetContent(newContent: string) {
		try {
			const db = await Database.load('sqlite:main.db');
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
		if (wereChangesMade) {
			const contentOfEditor = editorRef.current?.getValue();

			if (contentOfEditor) {
				snippet.content = contentOfEditor;
				editSnippetContent(contentOfEditor);
				setWereChangesMade(false);
			}
		}
	}

	/* Changes appearance only if the content of the editor is not equal to the original content. */
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
				className='absolute bottom-4 right-10 bg-emerald-500 text-black'
				variant='secondary'
				disabled={!wereChangesMade}
			>
				save
			</Button>
		</section>
	);
};
