if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function () {

    'use strict';

    return {
        submit_button: "Envoyer",
        reset_button: "Réinitialiser",
        //menu and selector titles
        resourceType: " Type de Ressource ",
        referencePeriod: "Période de Référence ",
        referenceArea: "Zone de Référence",
        dataDomain: "Domaine des Données",
        statusOfConfidentiality: "Statut Confidentiel",
        uid: "Uid",
        region : "Région",
        content : "Contenu",
        search_by_id : "Rechercher par ID",
        accessibility : "Accessibilité",
        action_select : "Sélectionner",
        action_download : "Télécharger",
        action_view : "Visualiser",
        //Errors
        request : "Erreur de demande",
        empty_values : "Sélection vide",
        courtesy_intro_title: "Bienvenue à la Section d’Analyse de la Plateforme Fenix",
        courtesy_intro: "Ici, vous pouvez produire des analyses statistiques en utilisant toutes les données stockées dans le Réseau Fenix.<br> Commencez à utiliser votre premier AVB (Boîte de visualisation et d’analyse) en choisissant une ressource à partir du catalogue en cliquant sur le bouton pulsant ci-dessus.",
        tooltip_open_catalog : "Ouvrir le Catalogue FENIX "
    }
});