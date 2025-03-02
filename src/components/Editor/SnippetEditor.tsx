import { Editor, type Monaco } from '@monaco-editor/react';
import { Button } from '../ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { editor } from 'monaco-editor';
import csb from './themes/csb.json';
import firewatch from './themes/firewatch.json';
import poimadres from './themes/poimadres.json';
import { useSnippetsContext, useContentContext } from '@/App';

import Database from '@tauri-apps/plugin-sql';
import { X } from 'lucide-react';

import { useSettingsContext } from '@/App';
import { useTranslation } from 'react-i18next';

interface Props {
	currentSnippet: Snippet | undefined;
}

export const SnippetEditor = ({ currentSnippet }: Props) => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const { updateShownSnippets } = useSnippetsContext();
	const { setSnippetForEditor } = useContentContext();
	const { theme } = useSettingsContext();
	const { t } = useTranslation();

	const [wereChangesMade, setWereChangesMade] = useState(false);

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
	function handleEditorDidMountBefore(monaco: Monaco) {
		monaco.editor.defineTheme('csb', {
			base: 'vs-dark',
			inherit: true,
			...csb,
		});

		monaco.editor.defineTheme('firewatch', {
			base: 'vs-dark',
			inherit: true,
			...firewatch,
		});

		monaco.editor.defineTheme('poimadres', {
			base: 'vs-dark',
			inherit: true,
			...poimadres,
		});
	}

	function saveContent() {
		const contentOfEditor = editorRef.current?.getValue();
		if (wereChangesMade && contentOfEditor != undefined) {
			editSnippetContent(contentOfEditor);
			setWereChangesMade(false);
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
		<main className='bg-sidebar w-full text-white'>
			<header className='flex justify-between'>
				<div className='flex gap-4 h-10 items-center px-2 border-zinc-500 border border-b-0 border-l-0 min-h-7 bg-[var(--editor-background)]'>
					<span className='text-sm'>
						<i className={` mr-2 ${currentSnippet?.iconClass}`}></i>
						{currentSnippet?.name}
					</span>

					{currentSnippet && (
						<Button
							className='p-1  text-zinc-400 w-fit ml-auto hover:text-red-400'
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
				theme={theme}
				value={currentSnippet ? currentSnippet?.content : ''}
				options={{
					fontSize: 14,
					fontFamily: 'Jetbrains-Mono',
					fontLigatures: true,
					wordWrap: 'on',
					cursorBlinking: 'expand',
					formatOnPaste: true,
					suggest: {
						showFields: true,
						showFunctions: true,
					},
				}}
				beforeMount={handleEditorDidMountBefore}
				onMount={handleEditorDidMount}
				onChange={() => checkIfChanged()}
			/>
			<Button
				ref={saveBtnRef}
				onClick={saveContent}
				className='bg-sidebar-ring hover:bg-[var(--focus-color)] absolute bottom-8 right-12 hover:scale-110'
				title='Ctrl + S'
				// Prevents the button from being clicked when
				// there are no changes made or the editor doesn't have a snippet inside.
				disabled={!currentSnippet || !wereChangesMade ? true : false}
			>
				{t('saveBtn')}
			</Button>
		</main>
	);
};
