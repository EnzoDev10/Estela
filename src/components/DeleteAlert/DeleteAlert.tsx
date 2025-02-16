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

export const DeleteAlert = ({ snippetToDelete, btnRef }: Props) => {
	const { updateShownSnippets } = useSnippetsContext();
	const { snippetForEditor, setSnippetForEditor } = useContentContext();

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
						Want to delete {snippetToDelete?.name}?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						snippet and there is no way of going back.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='bg-zinc-800'>Cancel</AlertDialogCancel>
					<AlertDialogAction className='bg-red-500' onClick={handleOnClick}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
