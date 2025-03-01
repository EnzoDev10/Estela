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

import { useTranslation } from 'react-i18next';

const themes = ['csb', 'firewatch', 'poimadres'] as const;
const appLanguages = ['en', 'es'] as const;

export const SettingsMenu = () => {
	const [open, setOpen] = useState(false);
	const { theme, setTheme } = useSettingsContext();

	const { t, i18n } = useTranslation();

	const formSchema = z.object({
		theme: z.enum(themes),
		appLanguage: z.enum(appLanguages),
	});

	let currentLanguage = localStorage.getItem('i18nextLng');

	function selectDefaultValue() {
		for (let i in appLanguages)
			if (appLanguages[i] == currentLanguage) return appLanguages[i];
		return 'en';
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			appLanguage: selectDefaultValue(),
		},
	});

	function ChangeSettings(theme: string, appLanguage: string) {
		localStorage.setItem('theme', JSON.stringify(theme));
		setTheme(theme);
		i18n.changeLanguage(appLanguage);
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		ChangeSettings(values.theme, values.appLanguage);
		setOpen(false);
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger className='focus:outline-none text-sidebar-ring focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:bg-zinc-800 rounded p-1'>
				<Settings2 />
			</AlertDialogTrigger>
			<AlertDialogContent
				className={`${theme} bg-zinc-900 border-sidebar-ring text-white rounded-xl w-fit min-w-80`}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>{t('settingsTitle')}</AlertDialogTitle>
					<AlertDialogDescription>{t('settingsDesc')}</AlertDialogDescription>
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
									<FormLabel className='text-left'>
										{t('themesLabel')}
									</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={theme}>
										<FormControl className='w-48 ml-auto'>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent className='bg-sidebar text-sidebar-foreground'>
											<SelectItem value='csb'>
												<div className='flex gap-2'>
													<div className='violet-circle w-5 h-5 rounded-full' />
													<span>CSB</span>
												</div>
											</SelectItem>
											<SelectItem value='poimadres'>
												<div className='flex gap-2'>
													<div className='green-circle w-5 h-5 rounded-full' />
													<span> Poimadres</span>
												</div>
											</SelectItem>
											<SelectItem value='firewatch'>
												<div className='flex gap-2'>
													<div className='orange-circle w-5 h-5 rounded-full' />
													<span> Firewatch</span>
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
								<FormItem className='text-left flex items-center justify-between  gap-6'>
									<FormLabel>{t('appLanguageLabel')}</FormLabel>
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
											<SelectItem value='en'>English</SelectItem>
											<SelectItem value='es'>Spanish</SelectItem>
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>

				<AlertDialogFooter>
					<AlertDialogCancel>{t('cancelBtn')}</AlertDialogCancel>
					<Button
						variant='save'
						className='focus:bg-[var(--focus-color)] hover:bg-[var(--focus-color)] bg-sidebar-ring capitalize'
						form='form-theme'
					>
						{t('saveBtn')}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

/*
 */
