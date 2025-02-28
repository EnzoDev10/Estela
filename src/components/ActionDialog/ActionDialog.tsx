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

import { useTranslation } from 'react-i18next';

interface Props {
	action: string;
	btnRef?: React.MutableRefObject<HTMLButtonElement | null>;
	snippetToUpdate?: Snippet;
}

/* Component solely created to show the form and pass some props to it. */
export const ActionDialog = ({ action, btnRef, snippetToUpdate }: Props) => {
	const [open, setOpen] = useState(false);
	const { theme } = useSettingsContext();
	const { t } = useTranslation();

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
				className={`${theme} bg-sidebar border-sidebar-ring text-sidebar-foreground rounded-xl w-fit min-w-80 flex flex-col gap-6`}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{action === 'create'
							? t('createTitle')
							: `${t('updateTitle')}${snippetToUpdate?.name}`}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{action === 'create' ? t('createDesc') : ''}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<ActionForm
					closeDialog={setOpen}
					action={action}
					snippetToUpdate={snippetToUpdate}
				/>
				<AlertDialogFooter>
					<AlertDialogCancel>{t('cancelBtn')}</AlertDialogCancel>
					<Button
						variant='save'
						className='focus:bg-[var(--focus-color)] hover:bg-[var(--focus-color)] bg-sidebar-ring capitalize'
						form='form-id'
					>
						{action === 'create' ? t('createBtn') : t('updateBtn')}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
