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

import { DeleteAlert, ActionDialog, SettingsMenu } from '@/components/index';

import { useEffect, useState, useRef } from 'react';

import {
	useContentContext,
	useSnippetsContext,
	useSettingsContext,
} from '@/App';

import { useTranslation } from 'react-i18next';

export const FileNavigation = () => {
	const { updateShownSnippets, snippets } = useSnippetsContext();
	const { setSnippetForEditor } = useContentContext();
	const { theme } = useSettingsContext();
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
			<SidebarMenuItem key={snippet.id} className='my-1 flex items-center'>
				<SidebarMenuButton
					onClick={() => {
						setSnippetForEditor(snippet);
						setOpenMobile(false);
					}}
				>
					{snippet.iconClass == 'plain' ? (
						<FileText />
					) : (
						<i className={`text-lg ${snippet.iconClass}`}></i>
					)}
					<span className='w-2/3 text-ellipsis line-clamp-1'>
						{snippet.name}
					</span>
				</SidebarMenuButton>

				<SidebarMenuAction
					className='text-zinc-600 mr-11 p-1'
					onClick={() => handleUpdateAction(snippet)}
				>
					<Pen />
				</SidebarMenuAction>
				<SidebarMenuAction
					className='text-zinc-600 mr-[2px] p-1'
					onClick={() => handleDeleteAction(snippet)}
				>
					<TrashIcon />
				</SidebarMenuAction>
			</SidebarMenuItem>
		));
	};

	const Trigger = () => {
		const { state, isMobile } = useSidebar();

		return (
			<SidebarTrigger
				className={`focus-visible:bg-sidebar-ring hover:bg-sidebar-ring hover:text-sidebar-foreground ml-auto p-3 ${
					state == 'expanded' && !isMobile ? 'mr-[10px]' : ''
				}`}
				title='Ctrl + b'
			/>
		);
	};

	/* Shows the existing snippets on every reload or when opening the app. */
	useEffect(() => {
		updateShownSnippets();
	}, []);

	const { t } = useTranslation();

	return (
		<SidebarProvider className='bg-sidebar flex flex-col text-white'>
			<Trigger />
			<Sidebar className='mt-7 text-white border-none'>
				<SidebarContent>
					<SidebarGroup className={`pt-1 ${theme}`}>
						<SidebarGroupLabel className='p-0'>
							{t('sidebarTitle')}
							<div className='ml-auto flex gap-3 items-center'>
								<SettingsMenu />
								<ActionDialog action='create' />
							</div>
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
