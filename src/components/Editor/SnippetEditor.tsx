import { Editor } from '@monaco-editor/react';
import { Button } from '../ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { editor } from 'monaco-editor';

import { useSnippetsContext, useContentContext } from '@/App';

import Database from '@tauri-apps/plugin-sql';
import { X } from 'lucide-react';

interface Props {
	currentSnippet: Snippet | undefined;
}

export const SnippetEditor = ({ currentSnippet }: Props) => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const { updateShownSnippets } = useSnippetsContext();
	const { setSnippetForEditor } = useContentContext();

	const [wereChangesMade, setWereChangesMade] = useState(false);

	// Declaring a variable just to update the content inside the editor.
	// Tried to also use it for Props but it gave errors.

	// ! revisar esto, puede que sea innecesario.
	let snippet: Snippet;

	if (currentSnippet) snippet = currentSnippet;

	// function to update content of a snippet with the value inside editor.
	async function editSnippetContent(newContent: string) {
		try {
			const db = await Database.load('sqlite:main.db');
			await db.execute('UPDATE Snippets SET content = $1 WHERE id = $2', [
				newContent,
				currentSnippet?.id,
			]);
			updateShownSnippets();
		} catch (error) {
			console.log(error);
		}
	}
	function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
		editorRef.current = editor;
	}

	// ! revisar esto por que no lo entiendo.
	function saveContent() {
		if (wereChangesMade) {
			const contentOfEditor = editorRef.current?.getValue();

			if (contentOfEditor != undefined) {
				snippet.content = contentOfEditor;
				editSnippetContent(contentOfEditor);
				setWereChangesMade(false);
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

	// Cleans the editor when the snippet is removed with the button that is inside the header.
	function editorValueSetter() {
		return currentSnippet ? currentSnippet?.content : '';
	}

	let editorValue = editorValueSetter();

	return (
		<main className='bg-zinc-800 w-full text-white'>
			<header className='flex justify-between'>
				<div className='flex gap-4 h-10 items-center px-2 border-zinc-500 border border-b-0 min-h-7 bg-zinc-800'>
					<span className='text-sm'>
						<i className={` mr-2 ${currentSnippet?.iconClass}`}></i>
						{currentSnippet?.name}
					</span>

					{currentSnippet && (
						<Button
							variant='link'
							className='p-1 bg-zinc-800 text-zinc-400 w-fit ml-auto hover:text-red-400'
							onClick={() => {
								setSnippetForEditor(undefined);
							}}
						>
							<X />
						</Button>
					)}
				</div>
			</header>
			<Editor
				language={currentSnippet?.language}
				theme='vs-dark'
				value={editorValue}
				onMount={handleEditorDidMount}
				onChange={() => checkIfChanged()}
			/>
			<Button
				ref={saveBtnRef}
				onClick={saveContent}
				className='
				transition delay-75 hover:scale-110 absolute bottom-8 right-12 bg-emerald-500 text-black 
				focus:translate-y-3 disabled:bg-white hover:bg-emerald-600  '
				title='Ctrl + S'
				// Prevents the button from being clicked when
				// there are no changes made or the editor doesn't have a snippet inside.
				disabled={!currentSnippet || !wereChangesMade ? true : false}
			>
				Save
			</Button>
		</main>
	);
};
