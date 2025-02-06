/* Shadcn sidebar */
import {
	SidebarProvider,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

import { DeleteAlert, ModalForm } from '@/components/index';

import { useEffect, useState, useRef } from 'react';

import { Button } from '../ui/button';

import { useContentContext, useSnippetsContext } from '@/App';
import { X } from 'lucide-react';

export const FileNavigation = () => {
	const { updateShownSnippets, snippets } = useSnippetsContext();
	const { setSnippetToEdit } = useContentContext();
	const [snippetToDelete, setSnippetToDelete] = useState<Snippet | undefined>(
		undefined
	);

	const dialogRef = useRef<HTMLButtonElement | null>(null);

	function clickDialogBtn() {
		if (dialogRef.current) {
			dialogRef.current.click();
		}
	}

	const ListOfSnippets = () => {
		function handleDeleteAction(snippetToDelete: Snippet) {
			setSnippetToDelete(snippetToDelete);
			clickDialogBtn();
		}

		return snippets?.map((snippet: Snippet) => (
			<SidebarMenuItem key={snippet.id} className='my-1 flex items-center'>
				<SidebarMenuButton asChild>
					<button
						onClick={() => {
							setSnippetToEdit(snippet);
							clickDialogBtn();
						}}
					>
						{snippet.name}
					</button>
				</SidebarMenuButton>
				<Button
					variant='ghost'
					className='text-zinc-600'
					onClick={() => handleDeleteAction(snippet)}
				>
					<X />
				</Button>
			</SidebarMenuItem>
		));
	};

	useEffect(() => {
		updateShownSnippets();
	}, []);

	return (
		<SidebarProvider className='flex flex-col'>
			<Sidebar collapsible='none' className='dark text-white'>
				<ModalForm />
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel className='text-zinc-400'>
							Your Snippets
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<ListOfSnippets />
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<DeleteAlert
						btnRef={dialogRef}
						snippetToDelete={snippetToDelete}
						parentMethod={() => updateShownSnippets()}
					/>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
};
