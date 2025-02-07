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

import { Button } from '../ui/button';

import { X } from 'lucide-react';

import { DeleteAlert, ModalForm } from '@/components/index';

import { useEffect, useState, useRef } from 'react';

import { useContentContext, useSnippetsContext } from '@/App';

export const FileNavigation = () => {
	const { updateShownSnippets, snippets } = useSnippetsContext();
	const { setSnippetToEdit } = useContentContext();

	const [snippetToDelete, setSnippetToDelete] = useState<Snippet | undefined>(
		undefined
	);

	/* Ref created to open dialog with external buttons. */
	const dialogRef = useRef<HTMLButtonElement | null>(null);

	function clickDialogBtn() {
		if (dialogRef.current) {
			dialogRef.current.click();
		}
	}

	/* Functions that helps update the content  */
	function handleDeleteAction(snippetToDelete: Snippet) {
		setSnippetToDelete(snippetToDelete);
		clickDialogBtn();
	}

	/* 
	function that populates the component with the existing snippets 
	and the buttons to interact with them individually. */
	const ListOfSnippets = () => {
		return snippets?.map((snippet: Snippet) => (
			<SidebarMenuItem key={snippet.id} className='my-1 flex items-center'>
				<SidebarMenuButton asChild>
					<button
						onClick={() => {
							setSnippetToEdit(snippet);
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

	/* Shows the existing snippets on every reload or when opening the app. */
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
					<DeleteAlert btnRef={dialogRef} snippetToDelete={snippetToDelete} />
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
};
