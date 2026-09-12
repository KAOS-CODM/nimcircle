import type { LanguageTranslations } from '../translationTypes'

export const fr = {
  navigation: {
    home: 'Accueil',
    circles: 'Cercles',
    create: 'Créer',
    profile: 'Profil',
  },

  home: {
    welcomeBack: 'Bon retour',
    description: 'Épargnez ensemble. Atteignez vos objectifs ensemble.',
    startAGoal: 'Commencer un objectif',
    createCircle: 'Créer un Cercle',
    createCircleDescription:
      'Définissez un objectif d’épargne et invitez d’autres personnes à contribuer.',
    yourGoals: 'Vos objectifs',
    created: 'Créés',
    joined: 'Rejoints',
    totalRaised: 'Total collecté',
    nimAcrossActiveGoals: 'NIM sur les objectifs actifs',
    activeGoals: 'Objectifs actifs',
    activeGoalsDescription:
      'Suivez les objectifs que vous aidez à atteindre.',
    viewAll: 'Tout voir',
    noActiveGoals: 'Aucun objectif actif',
    noActiveGoalsDescription:
      'Vous n’avez pas encore d’objectif d’épargne actif.',
    yourFirstCircle: 'Votre premier Cercle',
    yourFirstCircleDescription:
      'Créez un objectif d’épargne partagé et commencez à contribuer ensemble.',
    activeGoal: 'Objectif actif',
    sharedNimSavingsGoal: 'Objectif d’épargne NIM partagé',
    nimRaised: 'NIM collectés',
    nimToGo: 'NIM restants',
    contributor: 'Contributeur',
    contributors: 'Contributeurs',
    viewAllGoals: 'Voir tous les objectifs',
  },

  circles: {
    title: 'Cercles',
    heading: 'Vos Cercles',
    description: 'Objectifs que vous avez créés ou rejoints.',
    create: 'Créer un Cercle',
    created: 'Créés',
    joined: 'Rejoints',
    createdGoalTarget: 'Objectif des Cercles créés',
    joinedGoalTarget: 'Objectif des Cercles rejoints',
    across: 'sur',
    circle: 'Cercle',
    circles: 'Cercles',
    loading: 'Chargement des Cercles...',
    noJoinedCircles: 'Aucun Cercle rejoint',
    joinedDescription:
      'Les Cercles auxquels vous contribuez apparaîtront ici.',
    createFirstCircle: 'Créez votre premier Cercle',
    createFirstDescription:
      'Commencez un objectif d’épargne NIM partagé avec vos amis, votre famille ou votre communauté.',
    createCircle: 'Créer un Cercle',
    noDescription: 'Aucune description',
    raised: 'Collecté',
    target: 'Objectif',
    funded: 'financé',
    contributor: 'Contributeur',
    contributors: 'Contributeurs',
    creatorCommitment: 'Engagement du créateur',
    deadline: 'Date limite',
    goalOwner: 'Propriétaire de l’objectif',
    openCircle: 'Ouvrir le Cercle',
  },

  createCircle: {
    back: 'Retour',
    newCircle: 'Nouveau Cercle',
    heading: 'Créer un objectif d’épargne',
    description:
      'Définissez un objectif, choisissez le propriétaire et décidez du montant que vous engagerez.',
    circleName: 'Nom du Cercle',
    circleNamePlaceholder: 'ex. Nouvel ordinateur portable',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Pour quoi épargnez-vous ?',
    targetAmount: 'Montant cible',
    targetPlaceholder: 'ex. 100',
    goalOwnerWallet: 'Portefeuille du propriétaire',
    goalOwnerPlaceholder: 'adresse de portefeuille nq...',
    goalOwnerDescription:
      'Les NIM seront envoyés à ce portefeuille lorsque l’objectif sera atteint.',
    personalCircle: 'Cercle personnel',
    creatorCommitment: 'Votre engagement',
    commitmentPlaceholder: 'ex. 20',
    commitmentDescription:
      'Le montant que vous vous engagez à contribuer à ce Cercle.',
    personalCommitmentDescription:
      'Votre engagement fait partie de l’objectif et ne peut pas être modifié après la création.',
    deadline: 'Date limite',
    nameRequired: 'Veuillez entrer un nom pour le Cercle.',
    targetInvalid:
      'Veuillez entrer un montant cible valide supérieur à 0.',
    commitmentInvalid:
      'Veuillez entrer un montant d’engagement valide.',
    commitmentTooHigh:
      'Votre engagement ne peut pas être supérieur au montant cible.',
    deadlineRequired: 'Veuillez choisir une date limite.',
    deadlineInvalid: 'Veuillez choisir une date limite future.',
    walletInvalid:
      'Veuillez entrer une adresse de portefeuille Nimiq valide.',
    creating: 'Création...',
    createCircle: 'Créer un Cercle',
  },

  circle: {
    back: 'Retour',
    loading: 'Chargement du Cercle...',
    loadingDescription:
      'Récupération des dernières informations du Cercle.',
    unableToLoad: 'Impossible de charger le Cercle',
    tryAgain: 'Veuillez réessayer.',
    refreshError:
      'Une erreur est survenue lors de l’actualisation de ce Cercle.',
    retrying: 'Nouvelle tentative...',
    retry: 'Réessayer',
    sharedGoal: 'Objectif partagé',
    completed: 'Terminé',
    cancelled: 'Annulé',
    expired: 'Expiré',
    active: 'Actif',
    raised: 'Collecté',
    target: 'Objectif',
    complete: 'atteint',
    goalReached: 'Objectif atteint',
    remaining: 'restant',
    deadline: 'Date limite',
    contributors: 'Contributeurs',
    contributor: 'Contributeur',
    peopleContributing: 'personnes contribuent',
    personContributing: 'personne contribue',
    shareCircle: 'Partager le Cercle',
    linkCopied: 'Lien copié',
    unableToCopy: 'Impossible de copier le lien',
    aboutCircle: 'À propos de ce Cercle',
    creator: 'Créateur',
    goalOwner: 'Propriétaire de l’objectif',
    creatorCommitment: 'Engagement du créateur',
    created: 'Créé',
    contributorsDescription:
      'Personnes ayant contribué à cet objectif.',
    loadingContributors: 'Chargement des contributeurs...',
    noContributors: 'Aucun contributeur pour le moment',
    noContributorsDescription:
      'Soyez la première personne à contribuer à ce Cercle.',
    contributionHistory: 'Historique des contributions',
    contributionHistoryDescription:
      'Contributions récentes à ce Cercle.',
    loadingContributionHistory:
      'Chargement de l’historique des contributions...',
    noContributions: 'Aucune contribution pour le moment',
    noContributionsDescription:
      'Les contributions apparaîtront ici une fois confirmées.',
    contribution: 'Contribution',
    confirmed: 'Confirmée',
    creatorControls: 'Contrôles du créateur',
    manageCircle: 'Gérer le Cercle',
    fixedCommitment: 'Engagement fixe',
    cannotChange:
      'Votre engagement ne peut pas être modifié après la création.',
    extendDeadline: 'Prolonger la date limite',
    extendDeadlineDescription:
      'Donnez plus de temps à ce Cercle pour atteindre son objectif.',
    cancelCircle: 'Annuler le Cercle',
    cancelCircleDescription:
      'Annulez ce Cercle si vous ne souhaitez plus continuer.',
    cancelConfirm: 'Annuler le Cercle ?',
    cancelWarning:
      'Cette action est irréversible. Les contributeurs ne pourront plus contribuer.',
    keepCircle: 'Garder le Cercle',
    cancelling: 'Annulation...',
    giveMoreTime: 'Donner plus de temps',
    newDeadline: 'Nouvelle date limite',
    newDeadlineDescription:
      'Choisissez une nouvelle date postérieure à la date actuelle.',
    closeDeadlineEditor:
      'Fermer l’éditeur de date limite',
    updateDeadline: 'Mettre à jour la date limite',
    updatingDeadline:
      'Mise à jour de la date limite...',
    chooseNewDeadline:
      'Choisissez une nouvelle date limite',
    validNewDeadline:
      'Choisissez une date postérieure à la date limite actuelle.',
    currentDeadlineInvalid:
      'La date limite actuelle n’est plus valide.',
    newDeadlineMustBeLater:
      'La nouvelle date limite doit être postérieure à l’actuelle.',
    goalCompleted: 'Objectif terminé',
    deadlineUnavailable: 'Date limite indisponible',
    deadlinePassed: 'Date limite dépassée',
    lessThanDay: 'Moins d’un jour restant',
    daysLeft: 'jours restants',
    goalReachedDescription:
      'Ce Cercle a atteint son objectif d’épargne.',
    circleExpired: 'Cercle expiré',
    circleExpiredDescription:
      'La date limite est passée avant que l’objectif d’épargne soit atteint.',
    circleCancelled: 'Cercle annulé',
    circleCancelledDescription:
      'Ce Cercle a été annulé par son créateur.',
    contributeNim: 'Contribuer en NIM',
    contributeAmount: 'Montant de la contribution',
    creatorCommitmentUnavailable:
      'Engagement du créateur indisponible',
    goalFullyFunded: 'Objectif entièrement financé',
    creatorContributionDescription:
      'Le créateur s’est engagé à contribuer à ce Cercle.',
    goalOwnerDescription:
      'Ce portefeuille recevra les NIM lorsque l’objectif sera atteint.',
    noCreatorCommitmentDescription:
      'Le créateur n’a pas défini d’engagement pour ce Cercle.',
    contributorDescription:
      'Merci d’aider ce Cercle à atteindre son objectif.',
  },

  profile: {
    account: 'Compte',
    yourProfile: 'Votre profil',
    profileDescription:
      'Gérez votre profil et consultez votre activité de contribution.',
    created: 'Créés',
    joined: 'Rejoints',
    nimGiven: 'NIM donnés',
    supported: 'Soutenus',
    recentContributions: 'Contributions récentes',
    recentContributionsDescription:
      'Vos dernières contributions confirmées.',
    yourWallet: 'Votre portefeuille',
    copyAddress: 'Copier l’adresse',
    addressCopied: 'Adresse copiée',
    memberSince: 'Membre depuis',
    unableToLoadActivity:
      'Impossible de charger l’activité',
    noContributions: 'Aucune contribution pour le moment',
    noContributionsDescription:
      'Vos contributions confirmées apparaîtront ici.',
    language: 'Langue',
    languageDescription:
      'Choisissez la langue que vous souhaitez utiliser dans NimCircle.',
  },

  connectWallet: {
    eyebrow: 'NimCircle',
    title: 'Épargnons ensemble.',
    description:
      'Créez des objectifs NIM communs, invitez des participants et voyez chacun contribuer au même objectif.',
    walletCardTitle: 'Connecter votre portefeuille Nimiq',
    walletCardDescription:
      'NimCircle utilise votre portefeuille Nimiq Pay pour vous identifier et envoyer des contributions en NIM.',
    connect: 'Connecter le portefeuille',
    connecting: 'Connexion...',
    connectionFailed: 'Échec de la connexion du portefeuille',
    diagnostics: 'État de la connexion',
    nimiqProvider: 'Fournisseur Nimiq',
    ready: 'Prêt',
    notInitialized: 'Non initialisé',
    wallet: 'Portefeuille',
    notConnected: 'Non connecté',
    securityNote:
      'Vos clés privées ne quittent jamais Nimiq Pay.',
  },

  walletRestoring: {
    eyebrow: 'NimCircle',
    title: 'Démarrage de NimCircle',
    description: 'Connexion à Nimiq Pay...',
    initializing: 'Initialisation de votre connexion au portefeuille',
  },

  welcomeBack: {
    eyebrow: 'NimCircle',
    title: 'Bon retour, {name}',
    description:
      'Votre portefeuille et votre profil sont prêts. Retrouvons vos cercles.',
    continue: 'Continuer',
  },

  contributeModal: {
    sharedGoal: 'Objectif partagé',
    contributeNim: 'Contribuer en NIM',
    confirmCreatorCommitment: 'Confirmer l’engagement du créateur',
    amount: 'Montant',
    creatorCommitment: 'Engagement du créateur',
    fixedCommitment: 'Engagement fixe',
    remaining: 'Restant',
    recipient: 'Destinataire',
    circleMemo: 'Mémo du cercle',
    close: 'Fermer',
    contribute: 'Contribuer',
    contributeAmount: 'Contribuer {amount} NIM',
    confirmContribution: 'Confirmation de la contribution...',
    transaction: 'Transaction',
    contributionConfirmed: 'Contribution confirmée',
    contributionConfirmedDescription:
      'Votre contribution de {amount} NIM a été confirmée sur la blockchain Nimiq.',
    done: 'Terminé',
    walletApproval:
      'Nimiq Pay vous demandera d’approuver cette transaction.',
    validAmount: 'Saisissez un montant NIM valide.',
    maximumAmount:
      'Vous pouvez contribuer un maximum de {amount} NIM.',
    minimumAmount:
      'La contribution minimale est de 0.00001 NIM.',
    creatorCommitmentCannotChange:
      'Votre engagement en tant que créateur ne peut pas être modifié.',
    invalidRecipient:
      'Ce cercle possède une adresse de destinataire invalide.',
    transactionCancelled:
      'Vous avez annulé la transaction.',
    serverUnavailable:
      'Nous n’avons pas pu joindre le serveur NimCircle. Vérifiez votre connexion et réessayez.',
    processingError:
      'Une erreur s’est produite lors du traitement de la contribution. Veuillez réessayer.',
    transactionConfirmationFailed:
      'La transaction n’a pas pu être confirmée.',
    transactionSentWarning:
      'Votre transaction a été envoyée, mais NimCircle n’a pas pu terminer son traitement. Vos fonds ont peut-être déjà été transférés.',
    unknownTransaction: 'inconnue',
    transactionLabel: 'Transaction : {hash}',
    paymentNoAccount:
      'Aucun compte Nimiq n’est connecté.',
    
    paymentInvalidRecipient:
      'Ce cercle possède une adresse de destinataire invalide.',
    
    paymentInvalidRecipientFormat:
      'Le destinataire du cercle n’est pas une adresse Nimiq valide.',
    
    paymentMissingCircleId:
      'L’identifiant du cercle est manquant.',
    
    paymentConsensusNotEstablished:
      'Le consensus Nimiq n’est pas encore établi. Attendez que Nimiq Pay termine la synchronisation, puis réessayez.',
    
    paymentAmountInvalid:
      'Le montant en NIM doit être supérieur à zéro.',
    
    paymentAmountTooLarge:
      'Le montant en NIM est trop élevé.',
    
    paymentTransactionFailed:
      'Nimiq Pay n’a pas pu envoyer la transaction.',
  },

  profileSetup: {
    eyebrow: 'NimCircle',
    title: 'Créez votre profil',
    description:
      'Choisissez un nom d’utilisateur et un nom permettant aux membres de votre cercle de vous reconnaître.',
    username: 'Nom d’utilisateur',
    usernamePlaceholder: 'kaos',
    usernameHint:
      '3 à 20 caractères avec des lettres, des chiffres ou des underscores.',
    displayName: 'Nom affiché',
    displayNamePlaceholder: 'ex. Kaos',
    connectedWallet: 'Portefeuille connecté',
    createProfile: 'Créer le profil',
    pleaseChooseUsername:
      'Choisissez un nom d’utilisateur.',
    usernameTooShort:
      'Votre nom d’utilisateur doit comporter au moins 3 caractères.',
    usernameTooLong:
      'Votre nom d’utilisateur doit comporter 20 caractères ou moins.',
    usernameInvalid:
      'Le nom d’utilisateur ne peut contenir que des lettres, des chiffres et des underscores.',
    pleaseEnterDisplayName:
      'Saisissez un nom affiché.',
    displayNameTooShort:
      'Votre nom affiché doit comporter au moins 2 caractères.',
    displayNameTooLong:
      'Votre nom affiché doit comporter 30 caractères ou moins.',
  },

  language: {
    title: 'Langue',
    english: 'English',
    spanish: 'Español',
    german: 'Deutsch',
    french: 'Français',
    portuguese: 'Português',
  },
} satisfies LanguageTranslations