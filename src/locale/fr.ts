import { Locale } from "@/js/translation";

const fr: Locale = {
	pages: {
		home: "Accueil",
		timeline: "Frise des événements",
	},

	notFound: {
		title: "Page Introuvable",
		message: "Retourner à l'",
	},

	timeline: {
		campaignStart: "Début de la campagne",
		noEvent: "Aucun événement enregistré. Vous pouvez en ajouter sur l'",
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
	},

	status: {
		day: "Jour ",
		seasons: {
			spring: "Printemps",
			summer: "Été",
			autumn: "Automne",
			winter: "Hiver",
		},
		action: "Cliquez pour augmenter ou diminuer",
		cardCount: " carte(s) enregistrée(s)",
		selectors: {
			customOrder: "Ordre personnalisé",
			alphanumericOrder: "Ordre alphanumérique",
			tabLayout: "Disposition en onglets",
			columnLayout: "Disposition en colonnes",
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
		requiredField: "champ requis",
		dayNotValid: "jour invalide",
	},

	dialogs: {
		addQuest: "Ajouter une quête",
		addEvent: "Ajouter un événement",
		addLocation: "Ajouter une localité",
		addCharacter: "Ajouter un personnage",
		addFaction: "Ajouter une faction",
		addNote: "Ajouter une note",

		deleteTitle: "Supprimer ",
		deleteQuest: "Voulez-vous vraiment supprimer cette quête ?",
		deleteEvent:
			"Voulez-vous vraiment supprimer cet événement ? Cette action modifiera également la frise des événements.",
		deleteLocation: "Voulez-vous vraiment supprimer cette localité ?",
		deleteCharacter: "Voulez-vous vraiment supprimer ce personnage ?",
		deleteFaction: "Voulez-vous vraiment supprimer cette faction ?",
		deleteNote: "Voulez-vous vraiment supprimer cette note ?",
	},

	search: {
		search: "Recherche",
		containing: "Contenant",
		taggedWith: "Lié à",
		cardsMatching: " carte(s) correspondent à la recherche.",
		sortDisabled: "Tri des cartes désactivé pendant la recherche.",
	},

	actions: {
		close: "Fermer",
		save: "Sauvegarder",
		yes: "Oui",
		no: "Non",
		edit: "Modifier",
		delete: "Supprimer",
		quickNote: "Note rapide",
		changeCategory: "Clic ou Ctrl+Gauche/Droite pour changer de catégorie",
	},

	messages: {
		success: {
			saveFileImportSuccessful: "Fichier de sauvegarde importé.",
		},
		errors: {
			corruptedSave: "Données de sauvegarde corrompues ou incomplètes.",
			loadBackup: " Chargez une copie de sauvegarde valide pour récupérer les données.",
			saveFileImportCancelled: "Import du fichier de sauvegarde annulé.",
			saveFileImportFailed: "Le fichier de sauvegarde importé est illisible.",
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
			pages: {
				title: "Pages",
				toHome: "Naviguer vers l'Accueil",
				toTimeline: "Naviguer vers la Frise des événements",
			},
			content: {
				title: "Contenu",
				// showTabPrefix: "Afficher l'onglet/la colonne ",
				showTabQuest: "Afficher l'onglet/la colonne Quêtes",
				showTabEvent: "Afficher l'onglet/la colonne Événements",
				showTabLocation: "Afficher l'onglet/la colonne Localités",
				showTabCharacter: "Afficher l'onglet/la colonne Personnages",
				showTabFaction: "Afficher l'onglet/la colonne Factions",
				showTabNote: "Afficher l'onglet/la colonne Notes",
			},
			misc: {
				title: "Divers",
				openSearch: "Ouvrir/fermer la fenêtre de recherche",
				openOptions: "Ouvrir/fermer le menu des options",
			},
		},
	},
};
export default fr;
