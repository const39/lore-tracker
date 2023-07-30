import { Locale } from "@/core/translation/translation";

const fr: Locale = {
	pages: {
		campaigns: "Campagnes",
		loreBook: "Lore book",
		timeline: "Frise des événements",
	},

	notFound: {
		title: "Page Introuvable",
		message: "Retourner au ",
	},

	campaign: {
		name: "Campagne",
		table: {
			title: "Bienvenue sur LoreTracker !",
			subtitle: "Vos campagnes",
			progress: "Progression",
			entryCount: "Nombre d'entrées",
			lastUpdate: "Dernière modification",
			empty: "Aucune campagne enregistrée.",
		},
		state: {
			day: "Jour",
			entry: "entrée(s)",
			seasons: {
				spring: "Printemps",
				summer: "Été",
				autumn: "Automne",
				winter: "Hiver",
			},
		},
	},

	timeline: {
		campaignStart: "Début de la campagne",
		noEvent: "Aucun événement enregistré. Vous pouvez en ajouter sur le ",
		ascOrder: "Ordre chronologique croissant",
		descOrder: "Ordre chronologique décroissant",
	},

	eventTypes: {
		combat: "Combat",
		encounter: "Rencontre",
		discovery: "Découverte",
		travel: "Voyage",
		other: "Autre",
	},

	categories: {
		all: "Tous",
		quest: "Quête",
		event: "Événement",
		location: "Localité",
		character: "Personnage",
		faction: "Faction",
		note: "Note",

		folder: "Dossier",
		file: "Fichier",
	},

	status: {
		action: "Cliquez pour augmenter ou diminuer",
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
	},

	dragAndDrop: {
		desc: "Mode de glisser-déposer",
		modes: {
			disabled: "Désactivé",
			moveToFolder: "Déplacer vers dossier",
			sort: "Trier les cartes",
			link: "Lier une carte",
		},
	},

	fields: {
		category: "Catégorie",
		name: "Nom",
		title: "Titre",
		desc: "Description",
		tags: "Liens",
		noTag: "Aucun lien",
		mdSupport: "Langage Markdown supporté",
		otherCounter: " autre(s)",
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
		unknownRace: "Race inconnue",
		unknownClass: "Classe inconnue",
		unknownRole: "Rôle inconnu",
		requiredField: "Champ requis",
		dayNotValid: "Jour invalide",
		illegalCharacters: "Le nom contient des caractères invalides",
		nameAlreadyUsed: "Nom déjà utilisé",
		maxCharacterCount: " caractères max.",
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
		edit: "Modifier",
		delete: "Supprimer",
		moveTo: "Déplacer vers",
		quickNote: "Note rapide",
		dropCardHere: "Déposer une carte ici",
	},

	messages: {
		success: {
			saveFileImportSuccessful: "Fichier de sauvegarde importé.",
			newCardStored: "sauvegardé(e)",
			newCardStoredInFolder: "sauvegardé(e) dans le dossier",
		},
		errors: {
			genericError: "Une erreur est survenue.",
			corruptedSave: "Données de sauvegarde corrompues ou incomplètes.",
			loadBackup: " Chargez une copie de sauvegarde valide pour récupérer les données.",
			saveFileImportCancelled: "Import du fichier de sauvegarde annulé",
			saveFileImportFailed: "Le fichier de sauvegarde importé est illisible.",
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
		},
		info: {
			updateNotifTitle: "LoreTracker a reçu une nouvelle mise à jour !",
			updateNotifMessage: "Voir les détails sur GitHub.",
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
			pages: {
				title: "Pages",
				toLoreBook: "Naviguer vers le Lore book",
				toTimeline: "Naviguer vers la Frise des événements",
			},
			content: {
				title: "Contenu",
				showTabQuest: "Afficher l'onglet Quêtes",
				showTabEvent: "Afficher l'onglet Événements",
				showTabLocation: "Afficher l'onglet Localités",
				showTabCharacter: "Afficher l'onglet Personnages",
				showTabFaction: "Afficher l'onglet Factions",
				showTabNote: "Afficher l'onglet Notes",
			},
			misc: {
				title: "Divers",
				openOptions: "Ouvrir/fermer le menu des options",
			},
		},
	},
};
export default fr;
