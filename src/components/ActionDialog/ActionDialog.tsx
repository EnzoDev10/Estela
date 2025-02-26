import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '../ui/button';
import { ActionForm } from './Form';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { useSettingsContext } from '@/App';

interface Props {
	action: string;
	btnRef?: React.MutableRefObject<HTMLButtonElement | null>;
	snippetToUpdate?: Snippet;
}

/* Component solely created to show the form and pass some props to it. */
export const ActionDialog = ({ action, btnRef, snippetToUpdate }: Props) => {
	const [open, setOpen] = useState(false);
	const { theme } = useSettingsContext();
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					className={`focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:bg-zinc-800 rounded p-1 ml-auto text-sidebar-ring ${
						action === 'update' ? 'hidden' : ''
					}  `}
					ref={btnRef}
				>
					{action === 'create' ? <Plus /> : ''}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent
				className={`${theme} bg-zinc-900 border-sidebar-ring text-white rounded-xl w-fit min-w-80`}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{action === 'create'
							? 'Create a Snippet'
							: `Update ${snippetToUpdate?.name}`}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{action === 'create'
							? "Give it a recognizable name and a language to start. Don't worry to much about it, it can be changed later."
							: ''}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<ActionForm
					closeDialog={setOpen}
					action={action}
					snippetToUpdate={snippetToUpdate}
				/>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant='save'
						className='focus:bg-[var(--focus-color)] hover:bg-[var(--focus-color)] bg-sidebar-ring capitalize'
						form='form-id'
					>
						{action}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
