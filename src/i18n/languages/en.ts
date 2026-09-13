export const en = {
  navigation: {
    home: 'Home',
    circles: 'Circles',
    create: 'Create',
    profile: 'Profile',
  },

  app: {
    unableToLoadProfile: 'Unable to load your profile',
    tryAgain: 'Try again',
    loadingCircles: 'Loading your circles...',
  
    errors: {
      network: 'We could not reach the NimCircle server. Please check your connection and try again.',
      invalidResponse: 'The server returned an invalid response. Please try again.',
  
      walletUsernameRequired:
        'Wallet address and username are required.',
      usernameLength:
        'Your username must be between 3 and 20 characters.',
      usernameFormat:
        'Username can only contain letters, numbers, and underscores.',
      displayNameLength:
        'Your display name must be 30 characters or fewer.',
  
      profileExists:
        'A profile already exists for this wallet.',
      usernameTaken:
        'That username is already taken.',
      userAlreadyExists:
        'A profile with this wallet address or username already exists.',
      userNotFound:
        'User not found.',
      noValidUpdateFields:
        'No valid profile fields were provided.',
  
      circleFieldsRequired:
        'Some required Circle information is missing.',
      creatorNotFound:
        'The Circle creator could not be found.',
      creatorWalletMismatch:
        'The creator wallet does not match the creator profile.',
      goalOwnerNotFound:
        'The goal owner could not be found.',
      goalOwnerWalletMismatch:
        'The goal owner wallet does not match the goal owner profile.',
      targetAmountInvalid:
        'The target amount is invalid.',
      creatorCommitmentInvalid:
        'The creator commitment is invalid.',
      creatorCommitmentTooLarge:
        'The creator commitment cannot exceed the Circle target.',
      invalidDeadline:
        'The deadline is invalid.',
      deadlineNotFuture:
        'The deadline must be in the future.',
      circleAlreadyExists:
        'A Circle with this ID already exists.',
      circleNotFound:
        'Circle not found.',
      walletRequired:
        'A wallet address is required.',
      invalidStatusChange:
        'The only manual status change allowed is cancellation.',
      onlyCreatorCanCancel:
        'Only the Circle creator can cancel it.',
      circleStatusLocked:
        'This Circle can no longer change status.',
      onlyCreatorCanExtend:
        'Only the Circle creator can extend the deadline.',
      circleDeadlineLocked:
        'This Circle can no longer extend its deadline.',
      deadlineRequired:
        'A deadline is required.',
      deadlineMustBeLater:
        'The new deadline must be later than the current deadline.',
  
      transactionHashRequired:
        'A transaction hash is required.',
      transactionNotFound:
        'The transaction was not found in the Nimiq blockchain history.',
      transactionNotConfirmed:
        'The transaction has not been confirmed on the Nimiq blockchain.',
      transactionFailed:
        'The Nimiq transaction failed.',
      recipientMismatch:
        'The transaction recipient does not match the Circle goal owner.',
      amountMismatch:
        'The transaction amount does not match the contribution amount.',
      memoMismatch:
        'The transaction memo does not match the Circle.',
      senderMismatch:
        'The transaction sender does not match the contributor wallet.',
      contributionNotFound:
        'Contribution not found.',
    },
  },

  home: {
    welcomeBack: 'Welcome back',
    description: 'Save together. Reach goals together.',
    startAGoal: 'Start a goal',
    createCircle: 'Create a Circle',
    createCircleDescription:
      'Set a savings goal and invite others to contribute.',
    yourGoals: 'Your Goals',
    created: 'Created',
    joined: 'Joined',
    totalRaised: 'Total Raised',
    nimAcrossActiveGoals: 'NIM across active goals',
    activeGoals: 'Active Goals',
    activeGoalsDescription:
      'Keep an eye on the goals you are helping to reach.',
    viewAll: 'View all',
    noActiveGoals: 'No active goals',
    noActiveGoalsDescription:
      'You do not have any active savings goals yet.',
    yourFirstCircle: 'Your first Circle',
    yourFirstCircleDescription:
      'Create a shared savings goal and start contributing together.',
    activeGoal: 'Active Goal',
    sharedNimSavingsGoal: 'Shared NIM savings goal',
    nimRaised: 'NIM raised',
    nimToGo: 'NIM to go',
    contributor: 'Contributor',
    contributors: 'Contributors',
    viewAllGoals: 'View all goals',
  },

  circles: {
    title: 'Circles',
    heading: 'Your Circles',
    description: 'Goals you have created or joined.',
    create: 'Create Circle',
    created: 'Created',
    joined: 'Joined',
    createdGoalTarget: 'Created goals target',
    joinedGoalTarget: 'Joined goals target',
    across: 'across',
    circle: 'Circle',
    circles: 'Circles',
    loading: 'Loading circles...',
    noJoinedCircles: 'No joined Circles',
    joinedDescription:
      'Circles you contribute to will appear here.',
    createFirstCircle: 'Create your first Circle',
    createFirstDescription:
      'Start a shared NIM savings goal with friends, family, or your community.',
    createCircle: 'Create Circle',
    noDescription: 'No description',
    raised: 'Raised',
    target: 'Target',
    funded: 'funded',
    contributor: 'Contributor',
    contributors: 'Contributors',
    creatorCommitment: 'Creator commitment',
    deadline: 'Deadline',
    goalOwner: 'Goal owner',
    openCircle: 'Open Circle',
    findCircle: 'Find a Circle',
    findCircleDescription:
      'Enter a Circle ID shared with you to open the Circle.',
    circleIdPlaceholder: 'Enter Circle ID',
    search: 'Search',
    searching: 'Searching...',
    circleIdRequired: 'Enter a Circle ID.',
    circleNotFound: 'Circle not found'
  },

  createCircle: {
    back: 'Back',
    newCircle: 'New Circle',
    heading: 'Create a savings goal',
    description:
      'Set a target, choose the goal owner, and decide how much you will commit.',
    circleName: 'Circle name',
    circleNamePlaceholder: 'e.g. New laptop',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What are you saving for?',
    targetAmount: 'Target amount',
    targetPlaceholder: 'e.g. 100',
    goalOwnerWallet: 'Goal owner wallet',
    goalOwnerPlaceholder: 'nq... wallet address',
    goalOwnerDescription:
      'NIM will be sent to this wallet when the goal is completed.',
    personalCircle: 'Personal Circle',
    creatorCommitment: 'Your commitment',
    commitmentPlaceholder: 'e.g. 20',
    commitmentDescription:
      'The amount you promise to contribute to this Circle.',
    personalCommitmentDescription:
      'Your commitment is part of the target and cannot be changed after creation.',
    deadline: 'Deadline',
    nameRequired: 'Please enter a Circle name.',
    targetInvalid: 'Please enter a valid target amount greater than 0.',
    commitmentInvalid: 'Please enter a valid commitment amount.',
    commitmentTooHigh:
      'Your commitment cannot be greater than the target amount.',
    deadlineRequired: 'Please choose a deadline.',
    deadlineInvalid: 'Please choose a future deadline.',
    walletInvalid: 'Please enter a valid Nimiq wallet address.',
    creating: 'Creating...',
    createCircle: 'Create Circle',
  },

  circle: {
    back: 'Back',
    loading: 'Loading Circle...',
    loadingDescription: 'Fetching the latest Circle information.',
    unableToLoad: 'Unable to load Circle',
    tryAgain: 'Please try again.',
    refreshError: 'Something went wrong while refreshing this Circle.',
    retrying: 'Retrying...',
    retry: 'Retry',
    sharedGoal: 'Shared Goal',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired',
    active: 'Active',
    raised: 'Raised',
    target: 'Target',
    complete: 'complete',
    goalReached: 'Goal reached',
    remaining: 'remaining',
    deadline: 'Deadline',
    contributors: 'Contributors',
    contributor: 'Contributor',
    peopleContributing: 'people contributing',
    personContributing: 'person contributing',
    shareCircle: 'Share Circle',
    linkCopied: 'Link copied',
    unableToCopy: 'Unable to copy link',
    aboutCircle: 'About this Circle',
    creator: 'Creator',
    goalOwner: 'Goal owner',
    creatorCommitment: 'Creator commitment',
    created: 'Created',
    contributorsDescription:
      'People who have contributed to this goal.',
    loadingContributors: 'Loading contributors...',
    noContributors: 'No contributors yet',
    noContributorsDescription:
      'Be the first person to contribute to this Circle.',
    contributionHistory: 'Contribution history',
    contributionHistoryDescription:
      'Recent contributions made to this Circle.',
    loadingContributionHistory: 'Loading contribution history...',
    noContributions: 'No contributions yet',
    noContributionsDescription:
      'Contributions will appear here once they are confirmed.',
    contribution: 'Contribution',
    confirmed: 'Confirmed',
    creatorControls: 'Creator controls',
    manageCircle: 'Manage Circle',
    fixedCommitment: 'Fixed commitment',
    cannotChange: 'Your commitment cannot be changed after creation.',
    extendDeadline: 'Extend deadline',
    extendDeadlineDescription:
      'Give this Circle more time to reach its goal.',
    cancelCircle: 'Cancel Circle',
    cancelCircleDescription:
      'Cancel this Circle if you no longer want to continue.',
    cancelConfirm: 'Cancel Circle?',
    cancelWarning:
      'This action cannot be undone. Contributors will no longer be able to contribute.',
    keepCircle: 'Keep Circle',
    cancelling: 'Cancelling...',
    giveMoreTime: 'Give more time',
    newDeadline: 'New deadline',
    newDeadlineDescription:
      'Choose a new deadline later than the current one.',
    closeDeadlineEditor: 'Close deadline editor',
    updateDeadline: 'Update deadline',
    updatingDeadline: 'Updating deadline...',
    chooseNewDeadline: 'Choose a new deadline',
    validNewDeadline: 'Choose a deadline after the current deadline.',
    currentDeadlineInvalid:
      'The current deadline is no longer valid.',
    newDeadlineMustBeLater:
      'The new deadline must be later than the current deadline.',
    goalCompleted: 'Goal completed',
    deadlineUnavailable: 'Deadline unavailable',
    deadlinePassed: 'Deadline passed',
    lessThanDay: 'Less than a day left',
    daysLeft: '{count} days left',
    goalReachedDescription:
      'This Circle has reached its savings goal.',
    circleExpired: 'Circle expired',
    circleExpiredDescription:
      'The deadline passed before the savings goal was reached.',
    circleCancelled: 'Circle cancelled',
    circleCancelledDescription:
      'This Circle was cancelled by its creator.',
    contributeNim: 'Contribute NIM',
    contributeAmount: 'Contribution amount',
    creatorCommitmentUnavailable:
      'Creator commitment unavailable',
    goalFullyFunded: 'Goal fully funded',
    creatorContributionDescription:
      'The creator has committed to contributing to this Circle.',
    goalOwnerDescription:
      'This wallet will receive the NIM when the goal is completed.',
    noCreatorCommitmentDescription:
      'The creator has not set a commitment for this Circle.',
    contributorDescription:
      'Thank you for helping this Circle reach its goal.',
    circleId: 'Circle ID',
    copyCircleId: 'Copy',
    circleIdCopied: 'Copied',
  },

  profile: {
    account: 'Account',
    yourProfile: 'Your Profile',
    profileDescription:
      'Manage your profile and see your contribution activity.',
    created: 'Created',
    joined: 'Joined',
    nimGiven: 'NIM given',
    supported: 'Supported',
    recentContributions: 'Recent contributions',
    recentContributionsDescription:
      'Your latest confirmed contributions.',
    yourWallet: 'Your wallet',
    copyAddress: 'Copy address',
    addressCopied: 'Address copied',
    memberSince: 'Member since',
    unableToLoadActivity: 'Unable to load activity',
    noContributions: 'No contributions yet',
    noContributionsDescription:
      'Your confirmed contributions will appear here.',
    language: 'Language',
    languageDescription:
      'Choose the language you want to use in NimCircle.',
  },

  connectWallet: {
    eyebrow: 'NimCircle',
    title: 'Save together.',
    description:
      'Create shared NIM goals, invite people, and watch everyone contribute toward the same target.',
    walletCardTitle: 'Connect your Nimiq wallet',
    walletCardDescription:
      'NimCircle uses your Nimiq Pay wallet to identify you and send NIM contributions.',
    connect: 'Connect Wallet',
    connecting: 'Connecting...',
    connectionFailed: 'Wallet connection failed',
    diagnostics: 'Connection status',
    nimiqProvider: 'Nimiq provider',
    ready: 'Ready',
    notInitialized: 'Not initialized',
    wallet: 'Wallet',
    notConnected: 'Not connected',
    securityNote: 'Your private keys never leave Nimiq Pay.',
  },

  walletRestoring: {
    eyebrow: 'NimCircle',
    title: 'Starting NimCircle',
    description: 'Connecting to Nimiq Pay...',
    initializing: 'Initializing your wallet connection',
    networkMainnet: 'Nimiq Mainnet',
    networkTestnet: 'Nimiq Testnet',
    networkDetecting: 'Detecting network...',
  },

  welcomeBack: {
    eyebrow: 'NimCircle',
    title: 'Welcome back, {name}',
    description:
      "Your wallet and profile are ready. Let's get back to your circles.",
    continue: 'Continue',
  },

  contributeModal: {
    sharedGoal: 'Shared goal',
    contributeNim: 'Contribute NIM',
    confirmCreatorCommitment: 'Confirm creator commitment',
    amount: 'Amount',
    creatorCommitment: 'Creator commitment',
    fixedCommitment: 'Fixed commitment',
    remaining: 'Remaining',
    recipient: 'Recipient',
    circleMemo: 'Circle memo',
    close: 'Close',
    contribute: 'Contribute',
    contributeAmount: 'Contribute {amount} NIM',
    confirmContribution: 'Confirming contribution...',
    transaction: 'Transaction',
    contributionConfirmed: 'Contribution confirmed',
    contributionConfirmedDescription:
      'Your {amount} NIM contribution has been confirmed on the Nimiq blockchain.',
    done: 'Done',
    walletApproval:
      'Nimiq Pay will ask you to approve this transaction.',
    validAmount: 'Enter a valid NIM amount.',
    maximumAmount:
      'You can contribute a maximum of {amount} NIM.',
    minimumAmount:
      'The minimum contribution is 0.00001 NIM.',
    creatorCommitmentCannotChange:
      'Your creator commitment cannot be changed.',
    invalidRecipient:
      'This Circle has an invalid recipient address.',
    transactionCancelled:
      'You cancelled the transaction.',
    serverUnavailable:
      'We could not reach the NimCircle server. Please check your connection and try again.',
    processingError:
      'Something went wrong while processing the contribution. Please try again.',
    transactionConfirmationFailed:
      'The transaction could not be confirmed.',
    transactionSentWarning:
      'Your transaction was sent, but NimCircle could not finish processing it. Your funds may already have been transferred.',
    unknownTransaction: 'unknown',
    transactionLabel: 'Transaction: {hash}',
    paymentNoAccount:
      'No Nimiq account is connected.',
    
    paymentInvalidRecipient:
      'The Circle has an invalid recipient address.',
    
    paymentInvalidRecipientFormat:
      'The Circle recipient is not a valid Nimiq address.',
    
    paymentMissingCircleId:
      'The Circle ID is missing.',
    
    paymentConsensusNotEstablished:
      'Nimiq consensus is not established yet. Please wait for Nimiq Pay to finish syncing and try again.',
    
    paymentAmountInvalid:
      'NIM amount must be greater than zero.',
    
    paymentAmountTooLarge:
      'NIM amount is too large.',
    
    paymentTransactionFailed:
      'Nimiq Pay could not send the transaction.',

    testnetRequired:
      'Nimiq Testnet required',
    
    testnetRequiredDescription:
      'NimCircle is currently using Nimiq Testnet. Please switch Nimiq Pay to Testnet before contributing.',
  },

  profileSetup: {
    eyebrow: 'NimCircle',
    title: 'Create your profile',
    description:
      'Choose a username and name that your circle members can recognize.',
    username: 'Username',
    usernamePlaceholder: 'kaos',
    usernameHint:
      '3-20 characters using letters, numbers, or underscores.',
    displayName: 'Display name',
    displayNamePlaceholder: 'e.g. Kaos',
    connectedWallet: 'Connected wallet',
    createProfile: 'Create profile',
  
    pleaseChooseUsername:
      'Please choose a username.',
    usernameTooShort:
      'Your username must be at least 3 characters.',
    usernameTooLong:
      'Your username must be 20 characters or fewer.',
    usernameInvalid:
      'Username can only contain letters, numbers, and underscores.',
    pleaseEnterDisplayName:
      'Please enter a display name.',
    displayNameTooShort:
      'Your display name must be at least 2 characters.',
    displayNameTooLong:
      'Your display name must be 30 characters or fewer.',
  
    usernameTaken:
      'That username is already taken.',
    profileExists:
      'A profile already exists for this wallet.',
    userAlreadyExists:
      'A profile with this wallet address or username already exists.',
    unableToCreate:
      'Unable to create your profile. Please try again.',
  },

  networkNotice: {
    testnetTitle: 'NimCircle is in user testing',
    testnetDescription:
      'NimCircle is currently running on Nimiq Testnet for the user testing phase. Please switch Nimiq Pay from Default to Testnet before connecting or making a contribution.',
    mainnetTitle: 'NimCircle is now live',
    mainnetDescription:
      'The user testing phase is over. NimCircle is now running on Nimiq Mainnet. Please switch Nimiq Pay from Default to Mainnet before connecting or making a contribution.',
    testnet: 'Testnet',
    mainnet: 'Mainnet',
    howToSwitchTestnet: 'How to switch to Testnet',
    howToSwitchMainnet: 'How to switch to Mainnet',
    testnetGuide:
      'In Nimiq Pay, long-press Settings in the menu for about 10 seconds to open Provider Settings. On that screen, change the network from Default to Testnet. You do not need to change anything else. Nimiq Pay will reload the Mini App automatically. You can get free test NIM from the Nimiq Testnet page and use it to test NimCircle.',
    mainnetGuide:
      'In Nimiq Pay, long-press Settings in the menu for about 10 seconds to open Provider Settings. On that screen, change the network from Default to Mainnet. You do not need to change anything else. Nimiq Pay will reload the Mini App automatically.',
    hideGuide: 'Hide instructions',
    ignoreIfCorrect:
      'Already using the correct network? You can ignore this message and continue.',
  },

  language: {
    title: 'Language',
    english: 'English',
    spanish: 'Español',
    german: 'Deutsch',
    french: 'Français',
    portuguese: 'Português',
  },
} as const

export type EnglishTranslations = typeof en