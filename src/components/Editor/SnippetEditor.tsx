import { Editor } from '@monaco-editor/react';
import { Button } from '../ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';

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

	function saveContent() {
		if (wereChangesMade) {
			const contentOfEditor = editorRef.current?.getValue();

			if (contentOfEditor != undefined) {
				snippet.content = contentOfEditor;
				editSnippetContent(contentOfEditor);
				setWereChangesMade(false);
			} else {
				console.log('empty');
			}
		}
	}

	const saveBtnRef = useRef<HTMLButtonElement>(null);

	const handleKeyPress = useCallback((event: KeyboardEvent) => {
		if (event.ctrlKey && event.key === 's') {
			saveBtnRef.current?.click();
		}
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

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
				ref={saveBtnRef}
				onClick={saveContent}
				className='absolute bottom-4 right-10 bg-emerald-500 text-black'
				variant='secondary'
				// Prevents the button from being clicked when
				// there are no changes made or the editor doesn't have a snippet inside.
				disabled={!currentSnippet || !wereChangesMade ? true : false}
			>
				Ctrl + S
			</Button>
		</section>
	);
};
