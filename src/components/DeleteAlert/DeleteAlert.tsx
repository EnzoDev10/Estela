import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import Database from '@tauri-apps/plugin-sql';

// Deletes a snippet based on the id.

interface Props {
	snippetToDelete: Snippet | undefined;
	btnRef: React.MutableRefObject<HTMLButtonElement | null>;
}
import { useSnippetsContext, useContentContext } from '@/App';
import { useTranslation } from 'react-i18next';

export const DeleteAlert = ({ snippetToDelete, btnRef }: Props) => {
	const { updateShownSnippets } = useSnippetsContext();
	const { snippetForEditor, setSnippetForEditor } = useContentContext();

	const { t } = useTranslation();

	async function deleteSnippet(id: number) {
		try {
			const db = await Database.load('sqlite:main.db');
			await db.execute('DELETE FROM Snippets where id=$1', [id]);
			updateShownSnippets();
		} catch (error) {
			console.log(error);
		}
	}

	function handleOnClick() {
		if (snippetToDelete) {
			deleteSnippet(snippetToDelete.id);

			if (snippetToDelete.id === snippetForEditor?.id) {
				setSnippetForEditor(undefined);
			}
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button ref={btnRef} tabIndex={-1}></button>
			</AlertDialogTrigger>
			<AlertDialogContent className='bg-zinc-900 border-red-600 text-white rounded'>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{`${t('deleteTitle')} ${snippetToDelete?.name}`}?
					</AlertDialogTitle>
					<AlertDialogDescription>{t('deleteText')}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='bg-zinc-800'>
						{t('cancelBtn')}
					</AlertDialogCancel>
					<AlertDialogAction className='bg-red-500' onClick={handleOnClick}>
						{t('deleteBtn')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
