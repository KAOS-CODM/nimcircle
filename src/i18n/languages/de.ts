import type { LanguageTranslations } from '../translationTypes'

export const de = {
  navigation: {
    home: 'Startseite',
    circles: 'Kreise',
    create: 'Erstellen',
    profile: 'Profil',
  },

  home: {
    welcomeBack: 'Willkommen zurück',
    description: 'Gemeinsam sparen. Gemeinsam Ziele erreichen.',
    startAGoal: 'Ziel starten',
    createCircle: 'Kreis erstellen',
    createCircleDescription:
      'Setze ein Sparziel und lade andere zum Mitmachen ein.',
    yourGoals: 'Deine Ziele',
    created: 'Erstellt',
    joined: 'Beigetreten',
    totalRaised: 'Gesamt gesammelt',
    nimAcrossActiveGoals: 'NIM über aktive Ziele',
    activeGoals: 'Aktive Ziele',
    activeGoalsDescription:
      'Behalte die Ziele im Blick, die du mitfinanzierst.',
    viewAll: 'Alle anzeigen',
    noActiveGoals: 'Keine aktiven Ziele',
    noActiveGoalsDescription:
      'Du hast noch keine aktiven Sparziele.',
    yourFirstCircle: 'Dein erster Kreis',
    yourFirstCircleDescription:
      'Erstelle ein gemeinsames Sparziel und beginnt gemeinsam zu sparen.',
    activeGoal: 'Aktives Ziel',
    sharedNimSavingsGoal: 'Gemeinsames NIM-Sparziel',
    nimRaised: 'NIM gesammelt',
    nimToGo: 'NIM verbleibend',
    contributor: 'Beitragender',
    contributors: 'Beitragende',
    viewAllGoals: 'Alle Ziele anzeigen',
  },

  circles: {
    title: 'Kreise',
    heading: 'Deine Kreise',
    description: 'Ziele, die du erstellt hast oder denen du beigetreten bist.',
    create: 'Kreis erstellen',
    created: 'Erstellt',
    joined: 'Beigetreten',
    createdGoalTarget: 'Ziel der erstellten Kreise',
    joinedGoalTarget: 'Ziel der beigetretenen Kreise',
    across: 'über',
    circle: 'Kreis',
    circles: 'Kreise',
    loading: 'Kreise werden geladen...',
    noJoinedCircles: 'Keine beigetretenen Kreise',
    joinedDescription:
      'Kreise, zu denen du beiträgst, erscheinen hier.',
    createFirstCircle: 'Erstelle deinen ersten Kreis',
    createFirstDescription:
      'Starte ein gemeinsames NIM-Sparziel mit Freunden, Familie oder deiner Community.',
    createCircle: 'Kreis erstellen',
    noDescription: 'Keine Beschreibung',
    raised: 'Gesammelt',
    target: 'Ziel',
    funded: 'finanziert',
    contributor: 'Beitragender',
    contributors: 'Beitragende',
    creatorCommitment: 'Beitrag des Erstellers',
    deadline: 'Frist',
    goalOwner: 'Zielinhaber',
    openCircle: 'Kreis öffnen',
  },

  createCircle: {
    back: 'Zurück',
    newCircle: 'Neuer Kreis',
    heading: 'Erstelle ein Sparziel',
    description:
      'Lege ein Ziel fest, wähle den Zielinhaber und bestimme deinen eigenen Beitrag.',
    circleName: 'Name des Kreises',
    circleNamePlaceholder: 'z. B. Neuer Laptop',
    descriptionLabel: 'Beschreibung',
    descriptionPlaceholder: 'Wofür sparst du?',
    targetAmount: 'Zielbetrag',
    targetPlaceholder: 'z. B. 100',
    goalOwnerWallet: 'Wallet des Zielinhabers',
    goalOwnerPlaceholder: 'nq... Wallet-Adresse',
    goalOwnerDescription:
      'Die NIM werden an diese Wallet gesendet, wenn das Ziel erreicht wurde.',
    personalCircle: 'Persönlicher Kreis',
    creatorCommitment: 'Dein Beitrag',
    commitmentPlaceholder: 'z. B. 20',
    commitmentDescription:
      'Der Betrag, den du zu diesem Kreis beitragen möchtest.',
    personalCommitmentDescription:
      'Dein Beitrag ist Teil des Ziels und kann nach der Erstellung nicht mehr geändert werden.',
    deadline: 'Frist',
    nameRequired: 'Bitte gib einen Namen für den Kreis ein.',
    targetInvalid: 'Bitte gib einen gültigen Zielbetrag größer als 0 ein.',
    commitmentInvalid: 'Bitte gib einen gültigen Beitragsbetrag ein.',
    commitmentTooHigh:
      'Dein Beitrag darf nicht größer als der Zielbetrag sein.',
    deadlineRequired: 'Bitte wähle eine Frist.',
    deadlineInvalid: 'Bitte wähle eine zukünftige Frist.',
    walletInvalid: 'Bitte gib eine gültige Nimiq-Wallet-Adresse ein.',
    creating: 'Wird erstellt...',
    createCircle: 'Kreis erstellen',
  },

  circle: {
    back: 'Zurück',
    loading: 'Kreis wird geladen...',
    loadingDescription: 'Die neuesten Informationen werden abgerufen.',
    unableToLoad: 'Kreis konnte nicht geladen werden',
    tryAgain: 'Bitte versuche es erneut.',
    refreshError: 'Beim Aktualisieren dieses Kreises ist ein Fehler aufgetreten.',
    retrying: 'Erneuter Versuch...',
    retry: 'Erneut versuchen',
    sharedGoal: 'Gemeinsames Ziel',
    completed: 'Abgeschlossen',
    cancelled: 'Abgebrochen',
    expired: 'Abgelaufen',
    active: 'Aktiv',
    raised: 'Gesammelt',
    target: 'Ziel',
    complete: 'erreicht',
    goalReached: 'Ziel erreicht',
    remaining: 'verbleibend',
    deadline: 'Frist',
    contributors: 'Beitragende',
    contributor: 'Beitragender',
    peopleContributing: 'Personen beitragen',
    personContributing: 'Person beiträgt',
    shareCircle: 'Kreis teilen',
    linkCopied: 'Link kopiert',
    unableToCopy: 'Link konnte nicht kopiert werden',
    aboutCircle: 'Über diesen Kreis',
    creator: 'Ersteller',
    goalOwner: 'Zielinhaber',
    creatorCommitment: 'Beitrag des Erstellers',
    created: 'Erstellt',
    contributorsDescription:
      'Personen, die zu diesem Ziel beigetragen haben.',
    loadingContributors: 'Beitragende werden geladen...',
    noContributors: 'Noch keine Beitragenden',
    noContributorsDescription:
      'Sei die erste Person, die zu diesem Kreis beiträgt.',
    contributionHistory: 'Beitragsverlauf',
    contributionHistoryDescription:
      'Letzte Beiträge zu diesem Kreis.',
    loadingContributionHistory: 'Beitragsverlauf wird geladen...',
    noContributions: 'Noch keine Beiträge',
    noContributionsDescription:
      'Beiträge erscheinen hier, sobald sie bestätigt wurden.',
    contribution: 'Beitrag',
    confirmed: 'Bestätigt',
    creatorControls: 'Erstellersteuerung',
    manageCircle: 'Kreis verwalten',
    fixedCommitment: 'Fester Beitrag',
    cannotChange:
      'Dein Beitrag kann nach der Erstellung nicht geändert werden.',
    extendDeadline: 'Frist verlängern',
    extendDeadlineDescription:
      'Gib diesem Kreis mehr Zeit, sein Ziel zu erreichen.',
    cancelCircle: 'Kreis abbrechen',
    cancelCircleDescription:
      'Brich diesen Kreis ab, wenn du nicht mehr weitermachen möchtest.',
    cancelConfirm: 'Kreis abbrechen?',
    cancelWarning:
      'Diese Aktion kann nicht rückgängig gemacht werden. Beitragende können danach nicht mehr beitragen.',
    keepCircle: 'Kreis behalten',
    cancelling: 'Wird abgebrochen...',
    giveMoreTime: 'Mehr Zeit geben',
    newDeadline: 'Neue Frist',
    newDeadlineDescription:
      'Wähle eine neue Frist, die nach der aktuellen liegt.',
    closeDeadlineEditor: 'Frist-Editor schließen',
    updateDeadline: 'Frist aktualisieren',
    updatingDeadline: 'Frist wird aktualisiert...',
    chooseNewDeadline: 'Neue Frist wählen',
    validNewDeadline:
      'Wähle eine Frist nach der aktuellen Frist.',
    currentDeadlineInvalid:
      'Die aktuelle Frist ist nicht mehr gültig.',
    newDeadlineMustBeLater:
      'Die neue Frist muss nach der aktuellen liegen.',
    goalCompleted: 'Ziel erreicht',
    deadlineUnavailable: 'Frist nicht verfügbar',
    deadlinePassed: 'Frist abgelaufen',
    lessThanDay: 'Weniger als ein Tag übrig',
    daysLeft: 'Tage übrig',
    goalReachedDescription:
      'Dieser Kreis hat sein Sparziel erreicht.',
    circleExpired: 'Kreis abgelaufen',
    circleExpiredDescription:
      'Die Frist ist abgelaufen, bevor das Sparziel erreicht wurde.',
    circleCancelled: 'Kreis abgebrochen',
    circleCancelledDescription:
      'Dieser Kreis wurde von seinem Ersteller abgebrochen.',
    contributeNim: 'NIM beitragen',
    contributeAmount: 'Beitragsbetrag',
    creatorCommitmentUnavailable:
      'Beitrag des Erstellers nicht verfügbar',
    goalFullyFunded: 'Ziel vollständig finanziert',
    creatorContributionDescription:
      'Der Ersteller hat sich verpflichtet, zu diesem Kreis beizutragen.',
    goalOwnerDescription:
      'Diese Wallet erhält die NIM, wenn das Ziel erreicht wurde.',
    noCreatorCommitmentDescription:
      'Der Ersteller hat keinen Beitrag für diesen Kreis festgelegt.',
    contributorDescription:
      'Danke, dass du diesem Kreis hilfst, sein Ziel zu erreichen.',
  },

  profile: {
    account: 'Konto',
    yourProfile: 'Dein Profil',
    profileDescription:
      'Verwalte dein Profil und sieh dir deine Beitragsaktivität an.',
    created: 'Erstellt',
    joined: 'Beigetreten',
    nimGiven: 'NIM gegeben',
    supported: 'Unterstützt',
    recentContributions: 'Letzte Beiträge',
    recentContributionsDescription:
      'Deine letzten bestätigten Beiträge.',
    yourWallet: 'Deine Wallet',
    copyAddress: 'Adresse kopieren',
    addressCopied: 'Adresse kopiert',
    memberSince: 'Mitglied seit',
    unableToLoadActivity: 'Aktivität konnte nicht geladen werden',
    noContributions: 'Noch keine Beiträge',
    noContributionsDescription:
      'Deine bestätigten Beiträge erscheinen hier.',
    language: 'Sprache',
    languageDescription:
      'Wähle die Sprache, die du in NimCircle verwenden möchtest.',
  },

  connectWallet: {
    eyebrow: 'NimCircle',
    title: 'Gemeinsam sparen.',
    description:
      'Erstelle gemeinsame NIM-Ziele, lade andere ein und sieh zu, wie alle zum gleichen Ziel beitragen.',
    walletCardTitle: 'Nimiq-Wallet verbinden',
    walletCardDescription:
      'NimCircle verwendet deine Nimiq-Pay-Wallet, um dich zu identifizieren und NIM-Beiträge zu senden.',
    connect: 'Wallet verbinden',
    connecting: 'Wird verbunden...',
    connectionFailed: 'Wallet-Verbindung fehlgeschlagen',
    diagnostics: 'Verbindungsstatus',
    nimiqProvider: 'Nimiq-Provider',
    ready: 'Bereit',
    notInitialized: 'Nicht initialisiert',
    wallet: 'Wallet',
    notConnected: 'Nicht verbunden',
    securityNote:
      'Deine privaten Schlüssel verlassen Nimiq Pay niemals.',
  },

  walletRestoring: {
    eyebrow: 'NimCircle',
    title: 'NimCircle wird gestartet',
    description: 'Verbindung mit Nimiq Pay wird hergestellt...',
    initializing: 'Deine Wallet-Verbindung wird initialisiert',
  },

  welcomeBack: {
    eyebrow: 'NimCircle',
    title: 'Willkommen zurück, {name}',
    description:
      'Deine Wallet und dein Profil sind bereit. Kehren wir zu deinen Circles zurück.',
    continue: 'Weiter',
  },

  contributeModal: {
    sharedGoal: 'Gemeinsames Ziel',
    contributeNim: 'NIM beitragen',
    confirmCreatorCommitment: 'Erstellerbeitrag bestätigen',
    amount: 'Betrag',
    creatorCommitment: 'Erstellerbeitrag',
    fixedCommitment: 'Fester Beitrag',
    remaining: 'Verbleibend',
    recipient: 'Empfänger',
    circleMemo: 'Circle-Memo',
    close: 'Schließen',
    contribute: 'Beitragen',
    contributeAmount: '{amount} NIM beitragen',
    confirmContribution: 'Beitrag wird bestätigt...',
    transaction: 'Transaktion',
    contributionConfirmed: 'Beitrag bestätigt',
    contributionConfirmedDescription:
      'Dein Beitrag von {amount} NIM wurde auf der Nimiq-Blockchain bestätigt.',
    done: 'Fertig',
    walletApproval:
      'Nimiq Pay wird dich bitten, diese Transaktion zu bestätigen.',
    validAmount: 'Gib einen gültigen NIM-Betrag ein.',
    maximumAmount:
      'Du kannst maximal {amount} NIM beitragen.',
    minimumAmount:
      'Der Mindestbeitrag beträgt 0.00001 NIM.',
    creatorCommitmentCannotChange:
      'Dein Erstellerbeitrag kann nicht geändert werden.',
    invalidRecipient:
      'Dieser Circle hat eine ungültige Empfängeradresse.',
    transactionCancelled:
      'Du hast die Transaktion abgebrochen.',
    serverUnavailable:
      'Der NimCircle-Server konnte nicht erreicht werden. Überprüfe deine Verbindung und versuche es erneut.',
    processingError:
      'Beim Verarbeiten des Beitrags ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    transactionConfirmationFailed:
      'Die Transaktion konnte nicht bestätigt werden.',
    transactionSentWarning:
      'Deine Transaktion wurde gesendet, aber NimCircle konnte sie nicht vollständig verarbeiten. Deine Gelder wurden möglicherweise bereits übertragen.',
    unknownTransaction: 'unbekannt',
    transactionLabel: 'Transaktion: {hash}',
    paymentNoAccount:
      'Es ist kein Nimiq-Konto verbunden.',
    
    paymentInvalidRecipient:
      'Dieser Circle hat eine ungültige Empfängeradresse.',
    
    paymentInvalidRecipientFormat:
      'Der Empfänger des Circles ist keine gültige Nimiq-Adresse.',
    
    paymentMissingCircleId:
      'Die Circle-ID fehlt.',
    
    paymentConsensusNotEstablished:
      'Der Nimiq-Konsens ist noch nicht hergestellt. Warte, bis Nimiq Pay die Synchronisierung abgeschlossen hat, und versuche es erneut.',
    
    paymentAmountInvalid:
      'Der NIM-Betrag muss größer als null sein.',
    
    paymentAmountTooLarge:
      'Der NIM-Betrag ist zu groß.',
    
    paymentTransactionFailed:
      'Nimiq Pay konnte die Transaktion nicht senden.',
  },

  profileSetup: {
    eyebrow: 'NimCircle',
    title: 'Profil erstellen',
    description:
      'Wähle einen Benutzernamen und einen Namen, an dem dich die Mitglieder deiner Circles erkennen können.',
    username: 'Benutzername',
    usernamePlaceholder: 'kaos',
    usernameHint:
      '3–20 Zeichen mit Buchstaben, Zahlen oder Unterstrichen.',
    displayName: 'Anzeigename',
    displayNamePlaceholder: 'z. B. Kaos',
    connectedWallet: 'Verbundene Wallet',
    createProfile: 'Profil erstellen',
    pleaseChooseUsername:
      'Wähle einen Benutzernamen.',
    usernameTooShort:
      'Dein Benutzername muss mindestens 3 Zeichen lang sein.',
    usernameTooLong:
      'Dein Benutzername darf höchstens 20 Zeichen lang sein.',
    usernameInvalid:
      'Der Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten.',
    pleaseEnterDisplayName:
      'Gib einen Anzeigenamen ein.',
    displayNameTooShort:
      'Dein Anzeigename muss mindestens 2 Zeichen lang sein.',
    displayNameTooLong:
      'Dein Anzeigename darf höchstens 30 Zeichen lang sein.',
  },

  language: {
    title: 'Sprache',
    english: 'English',
    spanish: 'Español',
    german: 'Deutsch',
    french: 'Français',
    portuguese: 'Português',
  },
} satisfies LanguageTranslations