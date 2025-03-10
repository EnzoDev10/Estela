import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Database from '@tauri-apps/plugin-sql';

import { useSnippetsContext } from '@/App';
import { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

const availableLanguages = [
	'javascript',
	'typescript',
	'css',
	'html',
	'json',
	'↓ languages without intellisense',
	'python',
	'java',
	'csharp',
	'cpp',
	'c',
	'ruby',
	'php',
	'swift',
	'go',
	'rust',
	'kotlin',
	'sql',
	'shell',
	'dart',
	'elixir',
	'scala',
	'plaintext',
] as const;

const IconClasses: { [key: string]: string } = {
	javascript: 'devicon-javascript-plain',
	typescript: 'devicon-typescript-plain',
	css: 'devicon-css3-plain',
	html: 'devicon-html5-plain',
	json: 'devicon-json-plain',
	python: 'devicon-python-plain',
	java: 'devicon-java-plain',
	csharp: 'devicon-csharp-plain',
	cpp: 'devicon-cplusplus-plain',
	c: 'devicon-c-plain',
	ruby: 'devicon-ruby-plain',
	php: 'devicon-php-plain',
	swift: 'devicon-swift-plain',
	go: 'devicon-go-plain',
	rust: 'devicon-rust-plain',
	kotlin: 'devicon-kotlin-plain',
	sql: 'devicon-sqlite-plain',
	shell: 'devicon-bash-plain',
	dart: 'devicon-dart-plain',
	elixir: 'devicon-elixir-plain',
	scala: 'devicon-scala-plain',
	plaintext: 'plain',
};

interface actionFormProps {
	action: string;
	closeDialog: React.Dispatch<SetStateAction<boolean>>;
	snippetToUpdate?: Snippet;
}

export const ActionForm = ({
	action,
	closeDialog,
	snippetToUpdate,
}: actionFormProps) => {
	const { snippets, updateShownSnippets } = useSnippetsContext();
	const { t } = useTranslation();

	const formSchema = z.object({
		name: z
			.string()
			.min(2, {
				message: t('nameMessage.short'),
			})
			.max(40, {
				message: t('nameMessage.long'),
			})
			.trim()
			// Shows error if the name is already being used
			// except on updates where the snippet has the same name.
			.refine(
				(name) => {
					if (snippetToUpdate && name === snippetToUpdate.name) {
						return true;
					} else {
						const exists = !snippets?.some((snippet) => snippet.name === name);

						return exists;
					}
				},
				{
					message: t('nameMessage.alreadyUsed'),
				}
			),
		language: z.enum(availableLanguages),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			language: 'javascript',
		},
	});

	// Inserts a snippet into the database Table.
	async function setSnippet(snippet: Pick<Snippet, 'name' | 'language'>) {
		try {
			const db = await Database.load('sqlite:main.db');
			await db.execute(
				'INSERT INTO Snippets (name,language, iconClass) VALUES ($1, $2, $3)',
				[snippet.name, snippet.language, IconClasses[snippet.language]]
			);
			updateShownSnippets();
		} catch (error) {
			console.log(error);
		}
	}

	// updates a snippet name and language.
	async function updateSnippet(
		snippet: Pick<Snippet, 'name' | 'language' | 'id'>
	) {
		try {
			const db = await Database.load('sqlite:main.db');
			await db.execute(
				'UPDATE Snippets SET name = $1, language = $2, iconClass = $3 WHERE id = $4',
				[
					snippet.name,
					snippet.language,
					IconClasses[snippet.language],
					snippet.id,
				]
			);
			updateShownSnippets();
		} catch (error) {
			console.log(error);
		}
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		const name = values.name;
		const language = values.language;
		closeDialog(false);
		if (action == 'create') {
			setSnippet({ name, language });
		} else {
			if (snippetToUpdate) {
				const id = snippetToUpdate.id;
				updateSnippet({ name, language, id });
			}
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-2'
				id='form-id'
			>
				<FormField
					control={form.control}
					name='name'
					defaultValue={snippetToUpdate ? snippetToUpdate.name : ''}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('nameLabel')}</FormLabel>
							<FormControl>
								<Input placeholder='Ej. Navbar Template' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='language'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('languageLabel')}</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={
									snippetToUpdate ? snippetToUpdate.language : 'javascript'
								}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='text-white bg-zinc-800'>
									{availableLanguages.map((language) => (
										<SelectItem
											key={language}
											value={language}
											disabled={
												language === '↓ languages without intellisense'
													? true
													: false
											}
										>
											{language === '↓ languages without intellisense'
												? t('lngWarning')
												: language}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};
