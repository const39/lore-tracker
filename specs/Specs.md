# Specs

## Features

**Principales :**
* Affichage de "panneaux" pour chacun des types d'information à sauvegarder
    * 3 types d'affichage des boîtes :
        * Panneaux consécutifs : affichage les uns à la suite des autres (scroll)
        * Panneaux en onglets : affichage de l'onglet sélectionné 
        * Panneaux en colonnes : panneaux juxtaposés en colonnes sur la page
* Chaque panneau contient une "carte" contenant une information (ex: une ville)
* On peut ajouter/modifier/supprimer de nouvelles cartes sur chaque panneau
* Chaque carte peut contenir des références/hyperliens vers d'autres cartes

**Extra :**
* Affichage d'une frise des événements
    * Différentes icônes sur les noeuds en fonction du type d'événement
    * Au survol d'un noeud, affichage d'une tooltip présentant le lieu et le détail de l'événement
* Affichage des localisations sur une carte interactive
* Lancer de dés


## Types d'informations

Stockées dans des panneaux (*panels*).



* Objectifs
    * Infos à propos de l'objectifs, ex : *Retrouver Zyrlat.*
    * Localité de l'événement, ex : *Langdale* (optionnel)
    * Personnages impliqués, ex : *Acménos, Halvor...* (optionnel)

* Événements
    * Infos à propos de l'événement, ex : *Une grande bataille...*
    * Localité de l'événement, ex : *Langdale* (optionnel)
    * Personnages impliqués, ex : *Acménos, Halvor...* (optionnel)
    * Type d'événement [Combat, Rencontre, Découverte, Voyage, Autre]

* Localités
    * Nom de la localité, ex : *Langdale*
    * Infos à propos de la localité, ex : *Un petit village perdu dans une plaine. Une taverne, L'Auberge Noire, s'y trouve. Le village a connu une bataille lorsque...* (optionnel)

* Personnages
    * Nom, ex : *Acménos*
    * Race, ex : *Tiefflin* (optionnel)
    * Classe, ex : *Roublard* (optionnel)
    * Rôle, ex : *Marchand* (optionnel)
    * Joueur ou non-joueur, ex : *Joueur*
    * Infos supplémentaires, ex : *A rencontré Halvor dans une taverne.* (optionnel)

* Notes diverses
    * Titre, ex : *Lorem ipsum...* (optionnel)
    * Infos, ex : *Lorem ipsum...*


Maquettes sur Lucidchart

## TODO

* Gestion des erreurs lors de l'ajout de nouvelles cartes
* Mise à jour de cartes existantes
* Suppression de cartes existantes
* Ajuster les couleurs pour le Dark theme