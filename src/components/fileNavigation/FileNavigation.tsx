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
	SidebarMenuAction,
	useSidebar,
	SidebarTrigger,
} from '@/components/ui/sidebar';

import { FileText, Pen, TrashIcon } from 'lucide-react';

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
		const { setOpenMobile } = useSidebar();

		const reversedSnippets = snippets?.toReversed();

		return reversedSnippets?.map((snippet: Snippet) => (
			<SidebarMenuItem
				key={snippet.id}
				className='focus-visible:*:ring-emerald-600 my-1 flex items-center'
			>
				<SidebarMenuButton asChild>
					<button
						onClick={() => {
							setSnippetForEditor(snippet);
							setSnippetForEditor(snippet);
							setOpenMobile(false);
							console.log(snippet);
						}}
					>
						{snippet.iconClass == 'plain' ? (
							<FileText />
						) : (
							<i className={`text-lg ${snippet.iconClass}`}></i>
						)}
						{snippet.name}
					</button>
				</SidebarMenuButton>

				<SidebarMenuAction
					className='text-zinc-700 mr-10'
					onClick={() => handleUpdateAction(snippet)}
				>
					<Pen /> <span></span>
				</SidebarMenuAction>
				<SidebarMenuAction
					className='text-zinc-700 '
					onClick={() => handleDeleteAction(snippet)}
				>
					<TrashIcon />
				</SidebarMenuAction>
			</SidebarMenuItem>
		));
	};

	/* Shows the existing snippets on every reload or when opening the app. */
	useEffect(() => {
		updateShownSnippets();
	}, []);

	return (
		<SidebarProvider className='bg-zinc-900 flex flex-col text-white'>
			<SidebarTrigger
				className='focus:bg-emerald-600 ml-auto mr-1'
				title='Ctrl + b'
			/>
			<Sidebar className='mt-7 text-white border-none'>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel className='text-zinc-400 p-0'>
							Your Snippets
							<ActionDialog action='create' />
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
