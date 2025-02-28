import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languagedetector from 'i18next-browser-languagedetector';

i18n
	.use(initReactI18next)
	.use(languagedetector)
	.init({
		fallbackLng: 'en',
		debug: true,
		resources: {
			en: {
				translation: {
					sidebarTitle: 'Your Snippets',
					createTitle: 'Create a Snippet',
					updateTitle: 'Update ',
					createDesc:
						"Give it a recognizable name and a language to start. Don't worry to much about it, it can be changed later.",
					nameLabel: 'Name',
					languageLabel: 'Language',
					lngWarning: '↓ languages without intellisense',
					nameMessage: {
						short: 'The name must have atleast 2 characters',
						long: 'The name must be shorter than 40 characters',
						alreadyUsed: 'A snippet with this name already exists',
					},
					cancelBtn: 'Cancel',
					createBtn: 'Create',
					updateBtn: 'update',
					deleteTitle: 'Want to Delete ',
					deleteText:
						'This will permanently delete this snippet and it cannot be undone. ',
					deleteBtn: 'Delete',
					saveBtn: 'Save',
					copyBtn: 'Copy',
					settingsTitle: 'Settings',
					settingsDesc: 'Change The colors or Language of the app.',
					themesLabel: 'Themes',
					appLanguageLabel: 'Language',
				},
			},
			es: {
				translation: {
					sidebarTitle: 'Tus Fragmentos',
					createTitle: 'Crea un Fragmento',
					updateTitle: 'Actualizar ',
					createDesc:
						'Dale un nombre reconocible y un lenguaje para empezar. No te preocupes mucho al respecto, puede ser cambiado mas adelante.',
					nameLabel: 'Nombre',
					languageLabel: 'Lenguaje',
					lngWarning: '↓ Lenguajes sin intellisense',
					nameMessage: {
						short: 'El nombre debe contener por lo menos 2 caracteres.',
						long: 'El nombre debe ser mas corto que 40 caracteres.',
						alreadyUsed: 'un fragmento con este nombre ya existe.',
					},
					cancelBtn: 'Cancelar',
					createBtn: 'Crear',
					updateBtn: 'Actualizar',
					deleteTitle: '¿Quieres eliminar ',
					deleteText:
						'Esto eliminara permanentemente este fragmento y no hay manera de revertirlo.',
					deleteBtn: 'Borrar',
					saveBtn: 'Guardar',
					copyBtn: 'Copiar',
					settingsTitle: 'Configuración',
					settingsDesc: 'Cambia los colores o lenguaje de la applicación.',
					themesLabel: 'Paletas',
					appLanguageLabel: 'Lenguaje',
				},
			},
		},
		ns: ['translation'],
		defaultNS: 'translation',
	});

i18n.languages = ['en', 'es'];

export default i18n;
