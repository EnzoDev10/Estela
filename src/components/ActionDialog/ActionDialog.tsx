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

interface Props {
	action: string;
	btnRef?: React.MutableRefObject<HTMLButtonElement | null>;
	snippetToUpdate?: Snippet;
}

/* Component solely created to show the form and pass some props to it. */
export const ActionDialog = ({ action, btnRef, snippetToUpdate }: Props) => {
	const [open, setOpen] = useState(false);
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					className={`focus-visible:ring-2 focus-visible:ring-emerald-600 hover:bg-zinc-800 hover:text-emerald-600 rounded p-1 ml-auto text-emerald-500 ${
						action === 'update' ? 'hidden' : ''
					}  `}
					ref={btnRef}
				>
					{action === 'create' ? <Plus /> : ''}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='bg-zinc-900 border-emerald-600 text-white rounded-xl max-w-96'>
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
					<Button variant='save' className='capitalize' form='form-id'>
						{action}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
