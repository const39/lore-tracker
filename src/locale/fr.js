export default {
	pages: {
		loreTracker: "Lore Tracker",
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

	objectTypes: {
		all: "Tous",
		objective: "Objectif",
		event: "Événement",
		location: "Localité",
		character: "Personnage",
		note: "Note",
	},

	status: {
		day: "Jour",
		seasons: {
			spring: "Printemps",
			summer: "Été",
			autumn: "Automne",
			winter: "Hiver",
		},
		action: "Cliquez pour augmenter ou diminuer"
	},

	fields: {
		name: "Nom",
		title: "Titre",
		desc: "Description",
		tags: "Liens",
		mdSupport: "Langage Markdown supporté",
		otherCounter: " autre(s)",
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
		addObjective: "Ajouter un objectif",
		addEvent: "Ajouter un événement",
		addLocation: "Ajouter une localité",
		addCharacter: "Ajouter un personnage",
		addNote: "Ajouter une note",

		editObjective: "Modifier un objectif",
		editEvent: "Modifier un événement",
		editLocation: "Modifier une localité",
		editCharacter: "Modifier un personnage",
		editNote: "Modifier une note",

		deleteTitle: "Supprimer ",
		deleteObjective: "Voulez-vous vraiment supprimer cet objectif ?",
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
	},

	options: {
		themes: {
			optionName: "Changer de thème",
			light: "Clair",
			dark: "Sombre",
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
		hotkeys: {
			optionName: "Afficher les raccourcis",
			title: "Raccourcis clavier",
			pages: {
				title: "Pages",
				toLoreTracker: "Naviguer vers le Lore Tracker",
				toTimeline: "Naviguer vers la Frise des événements",
			},
			content: {
				title: "Contenu",
				// showTabPrefix: "Afficher l'onglet/la colonne ",
				showTabObjective: "Afficher l'onglet/la colonne Objectifs",
				showTabEvent: "Afficher l'onglet/la colonne Événement",
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
