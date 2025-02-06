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

async function deleteSnippet(snippetToDelete: Snippet) {
	try {
		const db = await Database.load('sqlite:main.db');
		// It uses a placeholder text so it is easier to add the code later.
		await db.execute('DELETE FROM Snippets where id=$1', [snippetToDelete.id]);
	} catch (error) {
		console.log(error);
	}
}

type Snippet = {
	id: number;
	name: string;
	language: string;
	content: string;
};

interface Props {
	snippetToDelete: Snippet | undefined;
	parentMethod: () => void;
	btnRef: React.MutableRefObject<HTMLButtonElement | null>;
}

export const DeleteAlert = ({
	snippetToDelete,
	parentMethod,
	btnRef,
}: Props) => {
	function handleOnClick() {
		if (snippetToDelete) {
			deleteSnippet(snippetToDelete);
			parentMethod();
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
