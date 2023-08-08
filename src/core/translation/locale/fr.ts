import { Locale } from "@/core/translation/translation";

const fr: Locale = {
	pages: {
		notFound: {
			title: "Page Introuvable",
			message: "Retourner aux ",
		},
		campaigns: {
			name: "Campagnes", 
			title: "Bienvenue sur LoreTracker !",
			subtitle: "Vos campagnes",
			table: {
				progress: "Progression",
				entryCount: "Nombre d'entrées",
				lastUpdate: "Dernière modification",
				empty: "Aucune campagne enregistrée.",
			},
		},
		timeline: {
			name: "Frise des événements", 
			title: "Frise des événements",
			content: {
				campaignStart: "Début de la campagne",
				noEvent: "Aucun événement enregistré. Vous pouvez en ajouter sur le ",
				ascOrder: "Ordre chronologique croissant",
				descOrder: "Ordre chronologique décroissant",
			},
		},
		loreBook: {
			name: "Lore book",
			banner: {
				statusAction: "Cliquez pour augmenter ou diminuer",
				search: "Recherche",
				selectors: {
					customOrder: "Ordre personnalisé",
					alphanumericOrder: "Ordre alphanumérique",
					largeTabDensity: "Densité spacieuse",
					comfortableTabDensity: "Densité confortable",
					compactTabDensity: "Densité compacte",
				},
			},

			sidePanel: {
				moveCard: "Déplacer",
				folderList: "Liste des dossiers",
				openFolder: "Ouvrir",
				relatedCards: "Cartes liées à",
				noRelatedCards: "Aucune carte liée.",
			},

			quickNote: {
				name: "Note rapide",
			},

			fields: {
				labels: {
					category: "Catégorie",
					name: "Nom",
					title: "Titre",
					desc: "Description",
					tags: "Liens",
					noTag: "Aucun lien",
					mdSupport: "Langage Markdown supporté",
					tasks: "Tâches",
					noTask: "Aucune tâche",
					ongoing: "En cours",
					completed: "Accompli",
					eventType: "Type d'événement",
					eventDay: "Date de l'événement",
					race: "Race",
					class: "Classe",
					role: "Rôle",
					npc: "PNJ",
					player: "Joueur",
					alive: "En vie",
					dead: "Mort",
				},
				content: {
					unknownRace: "Race inconnue",
					unknownClass: "Classe inconnue",
					unknownRole: "Rôle inconnu",
				},
				errors: {
					requiredField: "Champ requis",
					dayNotValid: "Jour invalide",
					illegalCharacters: "Le nom contient des caractères invalides",
					nameAlreadyUsed: "Nom déjà utilisé",
					maxCharacterCount: ({ n }) => `${n} caractères max.`,
				},
			},
		},
	},

	data: {
		campaign: {
			name: ["Aucune campagne", "Campagne", "Campagnes"],
			day: "Jour",
			entryCount: ["Aucune entrée", "entrée", "entrées"],
			seasons: {
				spring: "Printemps",
				summer: "Été",
				autumn: "Automne",
				winter: "Hiver",
			},
		},
		categories: {
			quest: ["Aucune quête", "Quête", "Quêtes"],
			event: ["Aucun événement", "Événement", "Événements"],
			location: ["Aucune localité", "Localité", "Localités"],
			character: ["Aucun personnage", "Personnage", "Personnages"],
			faction: ["Aucune faction", "Faction", "Factions"],
			note: ["Aucune note", "Note", "Notes"],
		},
		eventTypes: {
			combat: "Combat",
			encounter: "Rencontre",
			discovery: "Découverte",
			travel: "Voyage",
			other: "Autre",
		},
		cardTypes: {
			folder: ["Aucun dossier", "Dossier", "Dossiers"],
			file: ["Aucun fichier", "Fichier", "Fichiers"],
		},
	},

	dialogs: {
		addCampaign: "Nouvelle campagne",
		addFolder: "Nouveau dossier",
		addQuest: "Nouvelle quête",
		addEvent: "Nouveau événement",
		addLocation: "Nouvelle localité",
		addCharacter: "Nouveau  personnage",
		addFaction: "Nouvelle faction",
		addNote: "Nouvelle note",

		editFolder: "Modifier un dossier",
		editQuest: "Modifier une quête",
		editEvent: "Modifier un événement",
		editLocation: "Modifier une localité",
		editCharacter: "Modifier un personnage",
		editFaction: "Modifier une faction",
		editNote: "Modifier une note",

		deleteCampaign: "Supprimer une campagne",
		deleteFolder: "Supprimer un dossier",
		deleteQuest: "Supprimer une quête",
		deleteEvent: "Supprimer un événement",
		deleteLocation: "Supprimer une localité",
		deleteCharacter: "Supprimer un personnage",
		deleteFaction: "Supprimer une faction",
		deleteNote: "Supprimer une note",
		deleteConfirm: "Voulez-vous vraiment supprimer ",
		deleteConfirmFolder: "Cela supprimera tous ses sous-dossiers et fichiers.",
		deleteConfirmCampaign: "Cela supprimera toutes les entrées enregistrées.",
	},

	actions: {
		close: "Fermer",
		save: "Sauvegarder",
		yes: "Oui",
		no: "Non",
		showRelated: "Voir les cartes liées",
		edit: "Modifier",
		delete: "Supprimer",
		moveTo: "Déplacer vers",
		dropCardHere: "Déposer une carte ici",
		dragSort: "Trier les cartes",
		multipleDragItems: "éléments",
	},

	messages: {
		success: {
			saveFileImportSuccessful: "Fichier de sauvegarde importé.",
			newCardStored: "sauvegardé(e)",
			newCardStoredInFolder: "sauvegardé(e) dans le dossier",
		},
		errors: {
			genericError: "Une erreur est survenue.",
			save: {
				corruptedSave: "Données de sauvegarde corrompues ou incomplètes.",
				loadBackup: " Chargez une copie de sauvegarde valide pour récupérer les données.",
				saveFileImportCancelled: "Import du fichier de sauvegarde annulé",
				saveFileImportFailed: "Le fichier de sauvegarde importé est illisible.",
			},
			campaign: {
				campaignNotFound: {
					title: "Campagne introuvable",
					action: "Retourner à la liste des campagnes",
				},
			},
			files: {
				invalidOperation: {
					title: "Opération impossible",
				},
				folderNotFound: {
					title: "Dossier introuvable",
					action: "Retourner au dossier racine",
				},
				nameAlreadyUsed: {
					title: "Nom déjà utilisé",
				},
			},
			sidePanel: {
				formAlreadyOpen: {
					title: "Le panneau latéral ne peut être ouvert : un formulaire est déjà ouvert.",
				},
			},
		},
		info: {
			updateNotif: {
				title: "LoreTracker a reçu une nouvelle mise à jour !",
				message: "Voir les détails sur GitHub.",
			},
		},
	},

	options: {
		themes: {
			optionName: "Changer de thème",
			light: "Clair",
			dark: "Sombre",
		},
		lang: {
			optionName: "Changer de langue",
		},
		save: {
			optionName: "Gérer la sauvegarde",
			downloadText: "Télécharger la sauvegarde",
			uploadText: "Charger une sauvegarde",
			uploadInputLabel: "Charger le fichier",
			uploadInputHint: "Fichier au format JSON requis",
			deleteText: "Supprimer la sauvegarde",
			deleteDialogTitle: "Supprimer la sauvegarde ?",
			deleteDialogMessage:
				"Vous perdrez toutes les données enregistrées. Si vous souhaitez effacer les données, il est conseillé d'en faire une copie d'abord.",
		},
		about: {
			optionName: "A propos",
			title: "A propos de Lore Tracker",
			link: "Code source",
		},
		hotkeys: {
			optionName: "Afficher les raccourcis",
			title: "Raccourcis clavier",
			hold: "Maintenir",
			content: {
				title: "Contenu",
				showTab: ({ category }) => `Afficher l'onglet ${category}`,
			},
			misc: {
				title: "Divers",
				openOptions: "Ouvrir/fermer le menu des options",
			},
		},
	},
};
export default fr;
