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

import { X, Pen } from 'lucide-react';

import { DeleteAlert, ActionDialog } from '@/components/index';

import { useEffect, useState, useRef } from 'react';

import { useContentContext, useSnippetsContext } from '@/App';

export const FileNavigation = () => {
	const { updateShownSnippets, snippets } = useSnippetsContext();
	const { setSnippetForEditor } = useContentContext();
	const [snippetToDelete, setSnippetToDelete] = useState<Snippet | undefined>(
		undefined
	);

	const [snippetToUpdate, setSnippetToUpdate] = useState<Snippet | undefined>(
		undefined
	);

	const deleteBtnRef = useRef<HTMLButtonElement | null>(null);

	const updateBtnRef = useRef<HTMLButtonElement | null>(null);
	function clickDialogBtn(
		btnRef: React.MutableRefObject<HTMLButtonElement | null>
	) {
		if (btnRef.current) {
			btnRef.current.click();
		}
	}

	/* Functions that helps update the content  */
	function handleDeleteAction(snippetToDelete: Snippet) {
		setSnippetToDelete(snippetToDelete);
		clickDialogBtn(deleteBtnRef);
	}

	function handleUpdateAction(snippetToUpdate: Snippet) {
		setSnippetToUpdate(snippetToUpdate);
		clickDialogBtn(updateBtnRef);
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
							setSnippetForEditor(snippet);
						}}
					>
						{snippet.name}
					</button>
				</SidebarMenuButton>
				<Button
					variant='ghost'
					className='text-zinc-600'
					onClick={() => handleUpdateAction(snippet)}
				>
					<Pen />
				</Button>
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
				<ActionDialog action='create' />
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
						btnRef={deleteBtnRef}
						snippetToDelete={snippetToDelete}
					/>
					<ActionDialog
						action='update'
						btnRef={updateBtnRef}
						snippetToUpdate={snippetToUpdate}
					/>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
};
