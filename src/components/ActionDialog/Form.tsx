// shadcn forms
import {
	Form,
	FormControl,
	FormDescription,
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

/* list of  */
const availableLanguages = [
	'javascript',
	'typescript',
	'css',
	'less',
	'scss',
	'HTML',
	'json',
	'XML',
	'php',
	// los dos C deben estar en su forma original para funcionar en el editor.
	'CSharp',
	'CPlusPlus',
	//
	'markdown',
	'java',
	'VB',
	'Coffeescript',
	'Handlebars',
	// batch y pug no tienen icono ni colorizacion
	'Batch',
	'Pug',
	'FSharp',
	'lua',
	'Powershell',
	'python',
	'Ruby',
	'sass',
	'R',
	'ObjectiveC',
] as const;

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
	const formSchema = z.object({
		name: z
			.string()
			.min(2, {
				message: 'The name must have atleast 2 characters.',
			})
			.max(50, {
				message: 'The name must be shorter than 50 characters.',
			}),
		language: z.enum(availableLanguages),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			language: 'javascript',
		},
	});

	// if updating a snippet, use said snippet's language as the default value for the select field.
	function selectDefaultValue() {
		if (snippetToUpdate) {
			return snippetToUpdate.language;
		} else {
			return 'javascript';
		}
	}

	const { updateShownSnippets } = useSnippetsContext();

	// Inserts a snippet into the database Table.
	async function setSnippet(snippet: Omit<Snippet, 'id'>) {
		try {
			const db = await Database.load('sqlite:main.db');
			await db.execute(
				'INSERT INTO Snippets (name,language,content) VALUES ($1, $2, $3)',
				[snippet.name, snippet.language, '']
			);
			updateShownSnippets();
		} catch (error) {
			console.log(error);
		}
	}

	// updates a snippet name and language.
	async function updateSnippet(
		name: string,
		language: string,
		id: number | undefined
	) {
		try {
			const db = await Database.load('sqlite:main.db');
			await db.execute(
				'UPDATE Snippets SET name = $1, language = $2 WHERE id = $3',
				[name, language, id]
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
			const id = snippetToUpdate?.id;
			updateSnippet(name, language, id);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className=' text-start space-y-8'
				id='form-id'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='Ej. Navbar Template' {...field} />
							</FormControl>
							<FormDescription>
								Tip: Name it something that would help you identify it easily on
								the future.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='language'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Language</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={selectDefaultValue()}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{availableLanguages.map((language) => (
										<SelectItem key={language} value={language}>
											{language}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								Note: Languages after JSON don't have IntelliSense and only come
								with basic syntax colorization.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};
