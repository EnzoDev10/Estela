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

import { Pen, TrashIcon } from 'lucide-react';

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

		const languagesIconClasses: { [key: string]: string } = {
			javascript: 'devicon-javascript-plain',
			typescript: 'devicon-typescript-plain',
			css: 'devicon-css3-plain',
			less: 'devicon-less-plain-wordmark',
			scss: 'devicon-sass-original',
			HTML: 'devicon-html5-plain',
			json: 'devicon-json-plain',
			XML: 'devicon-xml-plain',
			php: 'devicon-php-plain',
			CSharp: 'devicon-csharp-plain',
			CPlusPlus: 'devicon-cplusplus-plain',
			markdown: 'devicon-markdown-original',
			java: 'devicon-java-plain',
			VB: 'devicon-visualbasic-plain',
			Coffeescript: 'devicon-coffeescript-original',
			Handlebars: 'devicon-handlebars-original',
			batch: 'none',
			pug: 'none',
			FSharp: 'devicon-fsharp-plain',
			lua: 'devicon-lua-plain',
			Powershell: 'devicon-powershell-plain',
			python: 'devicon-python-plain',
			Ruby: 'devicon-ruby-plain',
			R: 'devicon-r-plain',
			ObjectiveC: 'devicon-objectivec-plain',
		};

		return snippets?.map((snippet: Snippet) => (
			<SidebarMenuItem
				key={snippet.id}
				className='focus-visible:*:ring-emerald-600 my-1 flex items-center'
			>
				<SidebarMenuButton asChild>
					<button
						onClick={() => {
							snippet.iconClass = languagesIconClasses[snippet.language];
							setSnippetForEditor(snippet);
							setOpenMobile(false);
						}}
					>
						<i
							className={`text-lg ${languagesIconClasses[snippet.language]}`}
						></i>
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
