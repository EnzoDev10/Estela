import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

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

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '../ui/button';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSettingsContext } from '@/App';
import { useState } from 'react';
import { Settings2 } from 'lucide-react';

const themes = ['tokyo', 'codename', 'poimadres'] as const;
const appLanguages = ['English', 'Spanish'] as const;

export const SettingsMenu = () => {
	const [open, setOpen] = useState(false);
	const { theme, setTheme, appLanguage, setAppLanguage } = useSettingsContext();

	const formSchema = z.object({
		theme: z.enum(themes),
		appLanguage: z.enum(appLanguages),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			appLanguage: 'English',
		},
	});

	function changeSettings(theme: string, appLanguage: string) {
		console.log(theme, appLanguage);
		localStorage.setItem('theme', JSON.stringify(theme));
		setTheme(theme);
		/* 
		setAppLanguage(appLanguage)
		*/
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		const theme = values.theme;
		const appLanguage = values.appLanguage;
		changeSettings(theme, appLanguage);
		setOpen(false);
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger className='text-sidebar-ring focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:bg-zinc-800 rounded p-1'>
				<Settings2 />
			</AlertDialogTrigger>
			<AlertDialogContent
				className={`${theme} bg-zinc-900 border-sidebar-ring text-white rounded-xl w-fit min-w-80`}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>Settings</AlertDialogTitle>
					<AlertDialogDescription>
						Change The app colors or appLanguage.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<Form {...form}>
					<form
						id='form-theme'
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col my-2 gap-2'
					>
						<FormField
							control={form.control}
							name='theme'
							render={({ field }) => (
								<FormItem className='flex items-center gap-6'>
									<FormLabel className='text-left'>Themes</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={theme}>
										<FormControl className='w-48 ml-auto'>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent className='bg-sidebar text-sidebar-foreground'>
											<SelectItem value='tokyo'>
												<div className='flex gap-2'>
													<div className='bg-indigo-600 w-5 h-5 rounded-full' />
													<span> Tokyo</span>
												</div>
											</SelectItem>
											<SelectItem value='codename'>
												<div className='flex gap-2'>
													<div className='bg-orange-600 w-5 h-5 rounded-full' />
													<span> Codename</span>
												</div>
											</SelectItem>
											<SelectItem value='poimadres'>
												<div className='flex gap-2'>
													<div className='bg-teal-600 w-5 h-5 rounded-full' />
													<span> Poimadres</span>
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='appLanguage'
							render={({ field }) => (
								<FormItem className='text-left flex items-center justify-end gap-6'>
									<FormLabel>Language</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl className='w-48'>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent className='bg-sidebar text-sidebar-foreground'>
											{appLanguages.map((appLanguage) => (
												<SelectItem key={appLanguage} value={appLanguage}>
													{appLanguage}
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

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant='save'
						className='focus:bg-[var(--focus-color)] hover:bg-[var(--focus-color)] bg-sidebar-ring capitalize'
						form='form-theme'
					>
						Save Changes
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

/*
 */
