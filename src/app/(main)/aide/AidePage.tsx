'use client';
import { useState } from 'react';
import { Icon, Item, Tabs, Text } from 'react-basics';
import PageHeader from '@/components/layout/PageHeader';
import Icons from '@/components/icons';
import Lightbulb from '@/assets/lightbulb.svg';
import styles from './AidePage.module.css';

const guideSections = [
  {
    id: 'introduction',
    title: 'Bienvenue',
    icon: <Lightbulb />,
    content: (
      <div className={styles.section}>
        <h2>Bienvenue dans Actistat</h2>
        <p>
          Actistat est votre plateforme d'analyse web qui vous permet de consulter et d'analyser
          les statistiques de vos sites web en toute simplicité.
        </p>
        <h3>Que pouvez-vous faire avec Actistat ?</h3>
        <ul>
          <li>
            <strong>Consulter vos statistiques :</strong> Visualisez le trafic de vos sites web en
            temps réel
          </li>
          <li>
            <strong>Analyser les performances :</strong> Comprenez comment vos visiteurs
            interagissent avec votre site
          </li>
          <li>
            <strong>Créer des rapports :</strong> Générez des analyses détaillées sur mesure
          </li>
          <li>
            <strong>Suivre l'évolution :</strong> Observez les tendances et l'évolution de votre
            trafic dans le temps
          </li>
        </ul>
        <h3>Navigation dans l'interface</h3>
        <p>
          Utilisez les onglets en haut de la page pour naviguer entre les différentes sections :
        </p>
        <ul>
          <li>
            <strong>Tableau de bord :</strong> Vue d'ensemble de tous vos sites
          </li>
          <li>
            <strong>Sites web :</strong> Accédez aux statistiques détaillées de chaque site
          </li>
          <li>
            <strong>Rapports :</strong> Créez et consultez vos rapports personnalisés
          </li>
          <li>
            <strong>Paramètres :</strong> Configurez vos préférences et gérez vos sites
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'tableau-de-bord',
    title: 'Le tableau de bord',
    icon: <Icons.Dashboard />,
    content: (
      <div className={styles.section}>
        <h2>Comprendre le tableau de bord</h2>
        <p>
          Le tableau de bord est votre point de départ. Il vous donne une vue d'ensemble rapide de
          tous vos sites web en un seul endroit.
        </p>
        <h3>Que voyez-vous sur le tableau de bord ?</h3>
        <p>
          Pour chaque site web, vous pouvez voir les principales métriques sous forme de cartes :
        </p>
        <ul>
          <li>
            <strong>Visiteurs :</strong> Le nombre de visiteurs uniques qui ont visité votre site
            sur la période sélectionnée
          </li>
          <li>
            <strong>Vues de pages :</strong> Le nombre total de pages consultées par tous vos
            visiteurs
          </li>
          <li>
            <strong>Taux de rebond :</strong> Le pourcentage de visiteurs qui n'ont consulté qu'une
            seule page avant de quitter
          </li>
          <li>
            <strong>Durée moyenne :</strong> Le temps moyen passé par les visiteurs sur votre site
          </li>
        </ul>
        <h3>Graphiques et tendances</h3>
        <p>
          Sous les métriques, vous trouverez des graphiques qui montrent l'évolution de ces
          statistiques dans le temps. Vous pouvez :
        </p>
        <ul>
          <li>Changer la période d'analyse (24h, 7 jours, 30 jours, etc.)</li>
          <li>Comparer différentes périodes pour voir l'évolution</li>
          <li>Zoomer sur des périodes spécifiques pour plus de détails</li>
        </ul>
        <h3>Navigation vers les détails</h3>
        <p>
          Cliquez sur le nom d'un site web pour accéder à ses statistiques détaillées et voir plus
          d'informations.
        </p>
      </div>
    ),
  },
  {
    id: 'sites-web',
    title: 'Les sites web',
    icon: <Icons.Globe />,
    content: (
      <div className={styles.section}>
        <h2>Consulter les statistiques d'un site</h2>
        <p>
          La section <strong>Sites web</strong> vous permet d'accéder à toutes les statistiques
          détaillées de chacun de vos sites.
        </p>
        <h3>Liste de vos sites</h3>
        <p>
          Sur la page <strong>Sites web</strong>, vous verrez la liste de tous vos sites avec leurs
          statistiques principales. Cliquez sur un site pour accéder à ses détails complets.
        </p>
        <h3>Vue d'ensemble d'un site</h3>
        <p>Une fois dans les détails d'un site, vous avez accès à plusieurs onglets :</p>
        <ul>
          <li>
            <strong>Vue d'ensemble :</strong> Les statistiques principales et les graphiques
            généraux
          </li>
          <li>
            <strong>Pages :</strong> La liste des pages les plus visitées de votre site
          </li>
          <li>
            <strong>Sessions :</strong> Les visites individuelles avec tous leurs détails
          </li>
          <li>
            <strong>Événements :</strong> Les actions spécifiques suivies sur votre site
          </li>
          <li>
            <strong>Temps réel :</strong> Les visiteurs actuellement sur votre site
          </li>
        </ul>
        <h3>Filtres et périodes</h3>
        <p>
          En haut de chaque page, vous pouvez sélectionner la période que vous souhaitez analyser
          (aujourd'hui, cette semaine, ce mois, etc.) et utiliser des filtres pour affiner vos
          recherches.
        </p>
      </div>
    ),
  },
  {
    id: 'pages',
    title: 'Les pages',
    icon: <Icons.Eye />,
    content: (
      <div className={styles.section}>
        <h2>Analyser les pages de votre site</h2>
        <p>
          L'onglet <strong>Pages</strong> vous montre quelles pages de votre site sont les plus
          consultées par vos visiteurs.
        </p>
        <h3>Que pouvez-vous voir ?</h3>
        <ul>
          <li>
            <strong>URL de la page :</strong> L'adresse de chaque page de votre site
          </li>
          <li>
            <strong>Nombre de vues :</strong> Combien de fois chaque page a été consultée
          </li>
          <li>
            <strong>Visiteurs uniques :</strong> Combien de visiteurs différents ont consulté chaque
            page
          </li>
          <li>
            <strong>Pourcentage :</strong> La part de trafic que représente chaque page
          </li>
        </ul>
        <h3>Comment utiliser ces informations ?</h3>
        <p>
          Ces statistiques vous aident à comprendre quels contenus intéressent le plus vos
          visiteurs. Vous pouvez ainsi :
        </p>
        <ul>
          <li>Identifier vos pages les plus populaires</li>
          <li>Découvrir quelles pages méritent plus d'attention</li>
          <li>Comprendre le comportement de navigation de vos visiteurs</li>
        </ul>
        <h3>Recherche et filtres</h3>
        <p>
          Utilisez la barre de recherche pour trouver rapidement une page spécifique, ou les
          filtres pour affiner votre analyse selon différents critères.
        </p>
      </div>
    ),
  },
  {
    id: 'sessions',
    title: 'Les sessions',
    icon: <Icons.Visitor />,
    content: (
      <div className={styles.section}>
        <h2>Comprendre les sessions</h2>
        <p>
          Les <strong>Sessions</strong> représentent les visites individuelles sur votre site. Chaque
          session correspond à un visiteur qui a consulté votre site.
        </p>
        <h3>Informations sur chaque session</h3>
        <p>Pour chaque session, vous pouvez voir :</p>
        <ul>
          <li>
            <strong>Le parcours :</strong> Toutes les pages visitées par le visiteur, dans l'ordre
          </li>
          <li>
            <strong>La durée :</strong> Combien de temps le visiteur est resté sur votre site
          </li>
          <li>
            <strong>Le pays :</strong> D'où provient le visiteur
          </li>
          <li>
            <strong>L'appareil :</strong> Ordinateur, tablette ou mobile
          </li>
          <li>
            <strong>Le navigateur :</strong> Chrome, Safari, Firefox, etc.
          </li>
          <li>
            <strong>La source :</strong> Comment le visiteur est arrivé sur votre site (recherche,
            lien direct, etc.)
          </li>
        </ul>
        <h3>Consulter une session</h3>
        <p>
          Cliquez sur une session pour voir tous les détails : le parcours complet du visiteur,
          toutes les pages consultées, et le temps passé sur chaque page.
        </p>
        <h3>Filtres disponibles</h3>
        <p>
          Vous pouvez filtrer les sessions par pays, appareil, navigateur, source de trafic, et bien
          d'autres critères pour analyser des groupes spécifiques de visiteurs.
        </p>
      </div>
    ),
  },
  {
    id: 'evenements',
    title: 'Les événements',
    icon: <Icons.Bolt />,
    content: (
      <div className={styles.section}>
        <h2>Consulter les événements</h2>
        <p>
          Les <strong>Événements</strong> sont des actions spécifiques qui ont été suivies sur votre
          site, comme les clics sur un bouton, les téléchargements, ou les soumissions de
          formulaire.
        </p>
        <h3>Que voyez-vous ?</h3>
        <ul>
          <li>
            <strong>Nom de l'événement :</strong> Le type d'action qui a été enregistrée
          </li>
          <li>
            <strong>Nombre d'occurrences :</strong> Combien de fois cet événement s'est produit
          </li>
          <li>
            <strong>Visiteurs :</strong> Combien de visiteurs différents ont déclenché cet événement
          </li>
          <li>
            <strong>Données associées :</strong> Les informations supplémentaires liées à
            l'événement (si disponibles)
          </li>
        </ul>
        <h3>Comment utiliser ces données ?</h3>
        <p>
          Les événements vous permettent de mesurer l'engagement de vos visiteurs avec des actions
          spécifiques. Par exemple :
        </p>
        <ul>
          <li>Voir combien de personnes ont cliqué sur un bouton particulier</li>
          <li>Mesurer les téléchargements de documents</li>
          <li>Suivre les soumissions de formulaires</li>
          <li>Analyser l'efficacité de certains éléments de votre site</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'rapports',
    title: 'Les rapports',
    icon: <Icons.Reports />,
    content: (
      <div className={styles.section}>
        <h2>Créer et consulter des rapports</h2>
        <p>
          Les <strong>Rapports</strong> vous permettent de créer des analyses personnalisées et
          approfondies de vos données.
        </p>
        <h3>Types de rapports disponibles</h3>
        <ul>
          <li>
            <strong>Funnel (Entonnoir) :</strong> Analysez le parcours de conversion de vos
            visiteurs étape par étape
          </li>
          <li>
            <strong>Objectifs :</strong> Suivez l'atteinte d'objectifs spécifiques que vous avez
            définis
          </li>
          <li>
            <strong>Insights :</strong> Découvrez automatiquement des tendances et des patterns
            dans vos données
          </li>
          <li>
            <strong>Rétention :</strong> Analysez le retour de vos visiteurs sur votre site
          </li>
          <li>
            <strong>UTM :</strong> Suivez l'efficacité de vos campagnes marketing et publicitaires
          </li>
          <li>
            <strong>Parcours :</strong> Visualisez les parcours complets de vos visiteurs
          </li>
          <li>
            <strong>Revenus :</strong> Analysez les revenus générés par votre site (si applicable)
          </li>
        </ul>
        <h3>Créer un nouveau rapport</h3>
        <ol>
          <li>Allez dans la section <strong>Rapports</strong></li>
          <li>Cliquez sur <strong>Créer un rapport</strong></li>
          <li>Choisissez le type de rapport qui correspond à vos besoins</li>
          <li>Configurez les paramètres selon ce que vous souhaitez analyser</li>
          <li>Donnez un nom à votre rapport et enregistrez-le</li>
        </ol>
        <h3>Consulter vos rapports</h3>
        <p>
          Tous vos rapports sauvegardés apparaissent dans la liste. Cliquez sur un rapport pour le
          consulter, le modifier ou le supprimer.
        </p>
      </div>
    ),
  },
  {
    id: 'parametres',
    title: 'Les paramètres',
    icon: <Icons.Gear />,
    content: (
      <div className={styles.section}>
        <h2>Configurer vos préférences</h2>
        <p>
          La section <strong>Paramètres</strong> vous permet de personnaliser votre expérience
          selon vos préférences.
        </p>
        <h3>Paramètres de votre profil</h3>
        <p>Dans votre profil, vous pouvez modifier :</p>
        <ul>
          <li>
            <strong>Langue :</strong> Choisissez la langue d'affichage de l'interface
          </li>
          <li>
            <strong>Thème :</strong> Sélectionnez le mode clair ou sombre selon votre préférence
          </li>
          <li>
            <strong>Fuseau horaire :</strong> Ajustez l'affichage des heures selon votre localisation
          </li>
          <li>
            <strong>Plage de dates par défaut :</strong> Définissez la période d'analyse qui
            s'affichera par défaut
          </li>
          <li>
            <strong>Mot de passe :</strong> Modifiez votre mot de passe si nécessaire
          </li>
        </ul>
        <h3>Gestion des sites web</h3>
        <p>
          Dans <strong>Paramètres → Sites web</strong>, vous pouvez consulter la liste de tous vos
          sites et leurs informations de base.
        </p>
        <h3>Équipes (si applicable)</h3>
        <p>
          Si vous travaillez en équipe, vous pouvez gérer les équipes et partager l'accès à vos
          sites web avec d'autres utilisateurs.
        </p>
      </div>
    ),
  },
  {
    id: 'faq',
    title: 'Questions fréquentes',
    icon: <Lightbulb />,
    content: (
      <div className={styles.section}>
        <h2>Questions fréquentes</h2>
        <div className={styles.faq}>
          <h3>Comment changer la période d'analyse ?</h3>
          <p>
            Utilisez le sélecteur de dates en haut de chaque page pour choisir la période que vous
            souhaitez analyser. Vous pouvez sélectionner une période prédéfinie (aujourd'hui, cette
            semaine, ce mois) ou choisir une période personnalisée.
          </p>
          <h3>Puis-je exporter mes statistiques ?</h3>
          <p>
            Oui, vous pouvez exporter vos données depuis la plupart des sections. Recherchez le
            bouton d'export (généralement représenté par une icône de téléchargement) dans les
            tableaux de données.
          </p>
          <h3>Que signifie "taux de rebond" ?</h3>
          <p>
            Le taux de rebond représente le pourcentage de visiteurs qui n'ont consulté qu'une
            seule page avant de quitter votre site. Un taux de rebond élevé peut indiquer que les
            visiteurs ne trouvent pas ce qu'ils cherchent, ou qu'ils ont trouvé l'information
            rapidement.
          </p>
          <h3>Comment voir les statistiques en temps réel ?</h3>
          <p>
            Allez dans <strong>Sites web → [Votre site] → Temps réel</strong> pour voir les
            visiteurs actuellement sur votre site, leurs pages consultées, et leur localisation.
          </p>
          <h3>Puis-je comparer deux périodes ?</h3>
          <p>
            Oui, sur la plupart des graphiques, vous pouvez activer la comparaison avec une période
            précédente pour voir l'évolution de vos statistiques.
          </p>
          <h3>Que sont les "sessions" ?</h3>
          <p>
            Une session représente une visite sur votre site. Un visiteur peut avoir plusieurs
            sessions s'il revient plusieurs fois. Chaque session contient toutes les pages
            consultées et les actions effectuées pendant cette visite.
          </p>
        </div>
      </div>
    ),
  },
];

export default function AidePage() {
  const [selectedTab, setSelectedTab] = useState('introduction');

  const selectedSection = guideSections.find((section) => section.id === selectedTab);

  return (
    <section>
      <PageHeader title="Guide d'aide Actistat" icon={<Lightbulb />} />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Tabs
            selectedKey={selectedTab}
            onSelect={(key: string) => setSelectedTab(key)}
            className={styles.tabs}
          >
            {guideSections.map((section) => (
              <Item key={section.id} className={styles.tabItem}>
                <Icon className={styles.tabIcon}>{section.icon}</Icon>
                <Text>{section.title}</Text>
              </Item>
            ))}
          </Tabs>
        </div>
        <div className={styles.content}>
          {selectedSection && (
            <>
              <div className={styles.contentHeader}>
                <Icon size="lg" className={styles.sectionIcon}>
                  {selectedSection.icon}
                </Icon>
                <h1 className={styles.sectionTitle}>{selectedSection.title}</h1>
              </div>
              <div className={styles.contentBody}>{selectedSection.content}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
