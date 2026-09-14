import type { LanguageTranslations } from '../translationTypes'

export const fr = {
  navigation: {
    home: 'Accueil',
    circles: 'Cercles',
    create: 'Créer',
    profile: 'Profil',
  },

  app: {
    unableToLoadProfile:
      'Impossible de charger votre profil',
    tryAgain: 'Réessayer',
    loadingCircles:
      'Chargement de vos cercles...',

    errors: {
      network:
        'Nous n’avons pas pu joindre le serveur NimCircle. Vérifiez votre connexion et réessayez.',
      invalidResponse:
        'Le serveur a renvoyé une réponse invalide. Veuillez réessayer.',
      walletUsernameRequired:
        'L’adresse du portefeuille et le nom d’utilisateur sont requis.',
      usernameLength:
        'Votre nom d’utilisateur doit comporter entre 3 et 20 caractères.',
      usernameFormat:
        'Le nom d’utilisateur ne peut contenir que des lettres, des chiffres et des traits de soulignement.',
      displayNameLength:
        'Votre nom affiché doit comporter au maximum 30 caractères.',
      profileExists:
        'Un profil existe déjà pour ce portefeuille.',
      usernameTaken:
        'Ce nom d’utilisateur est déjà utilisé.',
      userAlreadyExists:
        'Un profil existe déjà avec cette adresse de portefeuille ou ce nom d’utilisateur.',
      userNotFound:
        'Utilisateur introuvable.',
      noValidUpdateFields:
        'Aucun champ de profil valide n’a été fourni.',
      circleFieldsRequired:
        'Certaines informations requises pour le Circle sont manquantes.',
      creatorNotFound:
        'Le créateur du Circle est introuvable.',
      creatorWalletMismatch:
        'Le portefeuille du créateur ne correspond pas à son profil.',
      goalOwnerNotFound:
        'Le propriétaire de l’objectif est introuvable.',
      goalOwnerWalletMismatch:
        'Le portefeuille du propriétaire de l’objectif ne correspond pas à son profil.',
      targetAmountInvalid:
        'Le montant cible n’est pas valide.',
      creatorCommitmentInvalid:
        'L’engagement du créateur n’est pas valide.',
      creatorCommitmentTooLarge:
        'L’engagement du créateur ne peut pas dépasser l’objectif du Circle.',
      invalidDeadline:
        'La date limite n’est pas valide.',
      deadlineNotFuture:
        'La date limite doit être dans le futur.',
      circleAlreadyExists:
        'Un Circle avec cet identifiant existe déjà.',
      circleNotFound:
        'Circle introuvable.',
      walletRequired:
        'Une adresse de portefeuille est requise.',
      invalidStatusChange:
        'La seule modification manuelle de statut autorisée est l’annulation.',
      onlyCreatorCanCancel:
        'Seul le créateur du Circle peut l’annuler.',
      circleStatusLocked:
        'Le statut de ce Circle ne peut plus être modifié.',
      onlyCreatorCanExtend:
        'Seul le créateur du Circle peut prolonger la date limite.',
      circleDeadlineLocked:
        'La date limite de ce Circle ne peut plus être prolongée.',
      deadlineRequired:
        'Une date limite est requise.',
      deadlineMustBeLater:
        'La nouvelle date limite doit être postérieure à la date actuelle.',
      transactionHashRequired:
        'Un hash de transaction est requis.',
      transactionNotFound:
        'La transaction est introuvable dans l’historique de la blockchain Nimiq.',
      transactionNotConfirmed:
        'La transaction n’a pas été confirmée sur la blockchain Nimiq.',
      transactionFailed:
        'La transaction Nimiq a échoué.',
      recipientMismatch:
        'Le destinataire de la transaction ne correspond pas au propriétaire de l’objectif du Circle.',
      amountMismatch:
        'Le montant de la transaction ne correspond pas au montant de la contribution.',
      memoMismatch:
        'Le mémo de la transaction ne correspond pas au Circle.',
      senderMismatch:
        'L’expéditeur de la transaction ne correspond pas au portefeuille du contributeur.',
      contributionNotFound:
        'Contribution introuvable.',
      personalCircleCommitmentInvalid:
        'Les cercles personnels ne peuvent pas avoir d’engagement du créateur.',
      fundraisingCommitmentRequired:
        'Les cercles de collecte nécessitent un engagement du créateur supérieur à zéro.',
      creatorCommitmentTooLow:
        'L’engagement du créateur ne peut pas être inférieur au montant que vous avez déjà contribué.',
      onlyCreatorCanUpdateCommitment:
        'Seul le créateur du cercle peut modifier l’engagement du créateur.',
      personalCircleNoCommitment:
        'Les cercles personnels n’ont pas d’engagement du créateur.',
      commitmentUpdateLocked:
        'Seuls les cercles actifs peuvent modifier l’engagement du créateur.',
      creatorCommitmentReached:
        'Vous avez atteint votre engagement pour ce cercle.',
      creatorCommitmentExceeded:
        'Cette contribution dépasse votre engagement restant.',
      commitmentCannotExceedTarget:
        'L’engagement du créateur ne peut pas dépasser l’objectif du Circle.',
      commitmentCannotBeBelowContributed:
        'L’engagement du créateur ne peut pas être inférieur au montant déjà versé.',
    },
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
    findCircle: 'Rechercher un Cercle',
    findCircleDescription:
      'Saisissez un ID de Cercle partagé pour ouvrir le Cercle.',
    circleIdPlaceholder: 'Saisissez l’ID du Cercle',
    search: 'Rechercher',
    searching: 'Recherche...',
    circleIdRequired: 'Saisissez un ID de Cercle.',
    circleNotFound:
      'Circle introuvable.',
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
    daysLeft: '{count} jours restants',
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
    circleId: 'ID du cercle',
    copyCircleId: 'Copier',
    circleIdCopyFailed: 'Impossible de copier l’ID du cercle',
    circleIdCopied: 'Copié',
    progress: 'Progression',
    shareDescription:
      'Rejoignez ce Circle et contribuez à atteindre l’objectif commun avec NimCircle.',
    you: 'Vous',
    personal: 'Personnel',
    fundraising: 'Collecte de fonds',
    goalType: 'Type d’objectif',
    commitmentDescription:
      'Le créateur s’est engagé à contribuer un montant total pendant ce Circle. Il peut le verser en plusieurs paiements.',
    editCommitment: 'Modifier l’engagement',
    committed: 'Engagé',
    contributed: 'Versé',
    shared: 'Partagé',
    refreshing: 'Actualisation...',
    refresh: 'Actualiser',
    pending: 'En attente',
    failed: 'Échec',
    newCommitment: 'Nouvel engagement',
    updatingCommitment: 'Mise à jour...',
    updateCommitment: 'Mettre à jour l’engagement',
    extending: 'Prolongation...',
    commitmentReached:
      'Engagement atteint',
    commitmentReachedDescription:
      'Vous avez atteint votre engagement actuel en tant que créateur. Vous pouvez modifier votre engagement ou continuer ce paiement comme une contribution normale.',
    contributionAmount:
      'Montant de la contribution',
    commitmentRemaining:
      'Engagement restant',
    contributeNormally:
      'Contribuer normalement',
    cancel:
      'Annuler',
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
    networkMainnet: 'Nimiq Mainnet',
    networkTestnet: 'Nimiq Testnet',
    networkDetecting: 'Détection du réseau...',
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
    testnetRequired:
      'Nimiq Testnet requis',
    testnetRequiredDescription:
      'NimCircle utilise actuellement Nimiq Testnet. Passe Nimiq Pay sur Testnet avant de contribuer.',
  },

  profileSetup: {
    eyebrow: 'NimCircle',
    title: 'Créer votre profil',
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
      'Veuillez choisir un nom d’utilisateur.',
    usernameTooShort:
      'Votre nom d’utilisateur doit comporter au moins 3 caractères.',
    usernameTooLong:
      'Votre nom d’utilisateur doit comporter au maximum 20 caractères.',
    usernameInvalid:
      'Le nom d’utilisateur ne peut contenir que des lettres, des chiffres et des underscores.',
    pleaseEnterDisplayName:
      'Veuillez saisir un nom affiché.',
    displayNameTooShort:
      'Votre nom affiché doit comporter au moins 2 caractères.',
    displayNameTooLong:
      'Votre nom affiché doit comporter au maximum 30 caractères.',
    usernameTaken:
      'Ce nom d’utilisateur est déjà utilisé.',
    profileExists:
      'Un profil existe déjà pour ce portefeuille.',
    userAlreadyExists:
      'Un profil existe déjà avec cette adresse de portefeuille ou ce nom d’utilisateur.',
    unableToCreate:
      'Impossible de créer votre profil. Veuillez réessayer.',
  },

  networkNotice: {
    testnetTitle: 'NimCircle est en phase de test',
    testnetDescription:
      'NimCircle fonctionne actuellement sur Nimiq Testnet pendant la phase de test. Passez le réseau de Nimiq Pay de Default à Testnet avant de connecter votre portefeuille ou de contribuer.',
    mainnetTitle: 'NimCircle est maintenant disponible',
    mainnetDescription:
      'La phase de test est terminée. NimCircle fonctionne maintenant sur Nimiq Mainnet. Passez le réseau de Nimiq Pay de Default à Mainnet avant de connecter votre portefeuille ou de contribuer.',
    testnet: 'Testnet',
    mainnet: 'Mainnet',
    howToSwitchTestnet: 'Comment passer sur Testnet',
    howToSwitchMainnet: 'Comment passer sur Mainnet',
    testnetGuide:
      'Dans Nimiq Pay, ouvrez le menu et maintenez Réglages appuyé pendant environ 10 secondes pour ouvrir les réglages du fournisseur. Sur cet écran, passez le réseau de Default à Testnet. Vous n’avez rien d’autre à modifier. Nimiq Pay rechargera automatiquement la Mini App. Vous pouvez obtenir gratuitement des NIM de test sur la page Nimiq Testnet et les utiliser pour tester NimCircle.',
    mainnetGuide:
      'Dans Nimiq Pay, ouvrez le menu et maintenez Réglages appuyé pendant environ 10 secondes pour ouvrir les réglages du fournisseur. Sur cet écran, passez le réseau de Default à Mainnet. Vous n’avez rien d’autre à modifier. Nimiq Pay rechargera automatiquement la Mini App.',
    hideGuide: 'Masquer les instructions',
    ignoreIfCorrect:
      'Vous utilisez déjà le bon réseau ? Vous pouvez ignorer ce message et continuer.',
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