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
					className={`rounded text-emerald-600 ${
						action === 'update' ? 'hidden' : ''
					}  `}
					variant='ghost'
					ref={btnRef}
				>
					{action === 'create' ? 'create' : ''}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='bg-zinc-900 border-emerald-600 text-white rounded'>
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
					<AlertDialogCancel className='bg-zinc-800'>Cancel</AlertDialogCancel>
					<Button className='bg-emerald-600 capitalize' form='form-id'>
						{action}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
