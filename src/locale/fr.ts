import { Locale } from "@/js/types";

const fr: Locale = {
	pages: {
		home: "Accueil",
		timeline: "Frise des événements",
	},

	timeline: {
		campaignStart: "Début de la campagne",
		noEvent: "Aucun événement enregistré. Vous pouvez en ajouter sur le",
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
	},

	fields: {
		name: "Nom",
		title: "Titre",
		desc: "Description",
		tags: "Liens",
		mdSupport: "Langage Markdown supporté",
		otherCounter: " autre(s)",
		tasks: "Tâches",
		noTask: "Aucune tâche ajoutée",
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
		addNote: "Ajouter une note",

		editQuest: "Modifier une quête",
		editEvent: "Modifier un événement",
		editLocation: "Modifier une localité",
		editCharacter: "Modifier un personnage",
		editNote: "Modifier une note",

		deleteTitle: "Supprimer ",
		deleteQuest: "Voulez-vous vraiment supprimer cette quête ?",
		deleteEvent:
			"Voulez-vous vraiment supprimer cet événement ? Cette action modifiera également la frise des événements.",
		deleteLocation: "Voulez-vous vraiment supprimer cette localité ?",
		deleteCharacter: "Voulez-vous vraiment supprimer ce personnage ?",
		deleteNote: "Voulez-vous vraiment supprimer cette note ?",
	},

	search: {
		search: "Rechercher",
		containing: "Contenant",
		in: "Dans",
		cardsShown: " carte(s) affichée(s)",
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
		copyData: {
			optionName: "Copier les données",
			success: "Données copiées dans le presse-papier",
		},
		deleteData: {
			optionName: "Effacer les données",
			title: "Effacer les données ?",
			message:
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
