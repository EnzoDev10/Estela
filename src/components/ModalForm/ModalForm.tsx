// Reack Hooks
import { useState } from 'react';

// shadcn dialogs
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

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

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// shadcn selects
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

/* Imports for form */
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// This list should be expanded on the future when icons are used to identify each snippet.
const posibleLanguages = [
	'javascript',
	'typescript',
	'HTML',
	'less',
	'css',
	'scss',
	'json',
] as const;

import Database from '@tauri-apps/plugin-sql';

/* imported context to update shown snippets on form submission */
import { useSnippetsContext } from '@/App';

/* Type used to create the snippets */
type Snippet = {
	id: number;
	name: string;
	language: string;
	content?: string;
};
interface Props {
	parentMethod: () => void;
}
const CustomForm = ({ parentMethod }: Props) => {
	const { updateShownSnippets } = useSnippetsContext();

	const minChars = 2;
	const maxChars = 50;
	const formSchema = z.object({
		name: z
			.string()
			.min(minChars, {
				message: `The name must have atleast ${minChars} characters.`,
			})
			.max(50, {
				message: `The name must be shorter than ${maxChars} characters.`,
			}),
		language: z.enum(posibleLanguages),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			language: 'javascript',
		},
	});

	// Gets the database and inserts a snippet into the table.
	async function setSnippet(Snippet: Omit<Snippet, 'id'>) {
		try {
			const db = await Database.load('sqlite:main.db');
			const contentDefaultValue = `placeholder Text for ${Snippet.name}`;
			// It uses a placeholder text so it is easier to add the code later.
			await db.execute(
				'INSERT INTO Snippets (name,language,content) VALUES ($1, $2, $3)',
				[Snippet.name, Snippet.language, contentDefaultValue]
			);
			updateShownSnippets();
		} catch (error) {
			console.log(error);
		}
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		const name = values.name;
		const language = values.language;
		setSnippet({ name, language });
		parentMethod();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className=' text-start space-y-8'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Snippet Name</FormLabel>
							<FormControl>
								<Input placeholder='Ej. NavbarStructure' {...field} />
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{/* Creates options based on possibleLanguages const. */}
									{posibleLanguages.map((language) => (
										<SelectItem key={language} value={language}>
											{language}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								Note: there are languages that don't have intellisense but they
								still count with basic syntax colorization.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className='w-full' type='submit'>
					Submit
				</Button>
			</form>
		</Form>
	);
};

export const ModalForm = () => {
	const [open, setOpen] = useState(false);
	return (
		/* Used to close the dialog when the form is submitted. */
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='rounded-none text-emerald-500'>Create</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-950 text-white border-emerald-500 rounded'>
				<DialogHeader>
					<DialogTitle>Create a Snippet</DialogTitle>
					<DialogDescription>
						Provide a name and language to correctly identify it.
					</DialogDescription>
					<CustomForm parentMethod={() => setOpen(!open)} />
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
