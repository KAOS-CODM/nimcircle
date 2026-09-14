import type { LanguageTranslations } from '../translationTypes'

export const pt = {
  navigation: {
    home: 'Início',
    circles: 'Círculos',
    create: 'Criar',
    profile: 'Perfil',
  },

  app: {
    unableToLoadProfile:
      'Não foi possível carregar o seu perfil',
    tryAgain: 'Tentar novamente',
    loadingCircles:
      'A carregar os seus círculos...',

    errors: {
      network:
        'Não foi possível contactar o servidor NimCircle. Verifique a sua ligação e tente novamente.',
      invalidResponse:
        'O servidor devolveu uma resposta inválida. Tente novamente.',
      walletUsernameRequired:
        'O endereço da carteira e o nome de utilizador são obrigatórios.',
      usernameLength:
        'O seu nome de utilizador deve ter entre 3 e 20 caracteres.',
      usernameFormat:
        'O nome de utilizador só pode conter letras, números e sublinhados.',
      displayNameLength:
        'O seu nome de apresentação deve ter no máximo 30 caracteres.',
      profileExists:
        'Já existe um perfil para esta carteira.',
      usernameTaken:
        'Esse nome de utilizador já está a ser utilizado.',
      userAlreadyExists:
        'Já existe um perfil com este endereço de carteira ou nome de utilizador.',
      userNotFound:
        'Utilizador não encontrado.',
      noValidUpdateFields:
        'Não foram fornecidos campos de perfil válidos.',
      circleFieldsRequired:
        'Faltam algumas informações obrigatórias do Circle.',
      creatorNotFound:
        'Não foi possível encontrar o criador do Circle.',
      creatorWalletMismatch:
        'A carteira do criador não corresponde ao seu perfil.',
      goalOwnerNotFound:
        'Não foi possível encontrar o proprietário do objetivo.',
      goalOwnerWalletMismatch:
        'A carteira do proprietário do objetivo não corresponde ao seu perfil.',
      targetAmountInvalid:
        'O valor do objetivo é inválido.',
      creatorCommitmentInvalid:
        'O compromisso do criador é inválido.',
      creatorCommitmentTooLarge:
        'O compromisso do criador não pode ultrapassar o objetivo do Circle.',
      invalidDeadline:
        'O prazo é inválido.',
      deadlineNotFuture:
        'O prazo deve estar no futuro.',
      circleAlreadyExists:
        'Já existe um Circle com este ID.',
      circleNotFound:
        'Circle não encontrado.',
      walletRequired:
        'É necessário um endereço de carteira.',
      invalidStatusChange:
        'A única alteração manual de estado permitida é o cancelamento.',
      onlyCreatorCanCancel:
        'Apenas o criador do Circle pode cancelá-lo.',
      circleStatusLocked:
        'O estado deste Circle já não pode ser alterado.',
      onlyCreatorCanExtend:
        'Apenas o criador do Circle pode prolongar o prazo.',
      circleDeadlineLocked:
        'O prazo deste Circle já não pode ser prolongado.',
      deadlineRequired:
        'É necessário um prazo.',
      deadlineMustBeLater:
        'O novo prazo deve ser posterior ao prazo atual.',
      transactionHashRequired:
        'É necessário um hash de transação.',
      transactionNotFound:
        'A transação não foi encontrada no histórico da blockchain Nimiq.',
      transactionNotConfirmed:
        'A transação ainda não foi confirmada na blockchain Nimiq.',
      transactionFailed:
        'A transação Nimiq falhou.',
      recipientMismatch:
        'O destinatário da transação não corresponde ao proprietário do objetivo do Circle.',
      amountMismatch:
        'O valor da transação não corresponde ao valor da contribuição.',
      memoMismatch:
        'O memo da transação não corresponde ao Circle.',
      senderMismatch:
        'O remetente da transação não corresponde à carteira do contribuidor.',
      contributionNotFound:
        'Contribuição não encontrada.',
      personalCircleCommitmentInvalid:
        'Círculos pessoais não podem ter um compromisso do criador.',
      fundraisingCommitmentRequired:
        'Círculos de arrecadação exigem um compromisso do criador maior que zero.',
      creatorCommitmentTooLow:
        'O compromisso do criador não pode ser menor que o valor que você já contribuiu.',
      onlyCreatorCanUpdateCommitment:
        'Somente o criador do círculo pode atualizar o compromisso do criador.',
      personalCircleNoCommitment:
        'Círculos pessoais não têm um compromisso do criador.',
      commitmentUpdateLocked:
        'Somente círculos ativos podem atualizar o compromisso do criador.',
      creatorCommitmentReached:
        'Você atingiu seu compromisso para este círculo.',
      creatorCommitmentExceeded:
        'Esta contribuição excede seu compromisso restante.',
      commitmentCannotExceedTarget:
        'O compromisso do criador não pode exceder a meta do Circle.',
      commitmentCannotBeBelowContributed:
        'O compromisso do criador não pode ser inferior ao valor já contribuído.',
    },
  },

  home: {
    welcomeBack: 'Bem-vindo de volta',
    description: 'Poupe juntos. Alcancem objetivos juntos.',
    startAGoal: 'Começar um objetivo',
    createCircle: 'Criar um Círculo',
    createCircleDescription:
      'Defina uma meta de poupança e convide outras pessoas a contribuir.',
    yourGoals: 'Os seus objetivos',
    created: 'Criados',
    joined: 'Participados',
    totalRaised: 'Total arrecadado',
    nimAcrossActiveGoals: 'NIM em objetivos ativos',
    activeGoals: 'Objetivos ativos',
    activeGoalsDescription:
      'Acompanhe os objetivos que está a ajudar a alcançar.',
    viewAll: 'Ver tudo',
    noActiveGoals: 'Nenhum objetivo ativo',
    noActiveGoalsDescription:
      'Ainda não tem objetivos de poupança ativos.',
    yourFirstCircle: 'O seu primeiro Círculo',
    yourFirstCircleDescription:
      'Crie um objetivo de poupança partilhado e comecem a contribuir juntos.',
    activeGoal: 'Objetivo ativo',
    sharedNimSavingsGoal: 'Objetivo de poupança NIM partilhado',
    nimRaised: 'NIM arrecadados',
    nimToGo: 'NIM restantes',
    contributor: 'Contribuidor',
    contributors: 'Contribuidores',
    viewAllGoals: 'Ver todos os objetivos',
  },

  circles: {
    title: 'Círculos',
    heading: 'Os seus Círculos',
    description: 'Objetivos que criou ou aos quais aderiu.',
    create: 'Criar Círculo',
    created: 'Criados',
    joined: 'Participados',
    createdGoalTarget: 'Meta dos Círculos criados',
    joinedGoalTarget: 'Meta dos Círculos participados',
    across: 'em',
    circle: 'Círculo',
    circles: 'Círculos',
    loading: 'A carregar Círculos...',
    noJoinedCircles: 'Nenhum Círculo participado',
    joinedDescription:
      'Os Círculos para os quais contribui aparecerão aqui.',
    createFirstCircle: 'Crie o seu primeiro Círculo',
    createFirstDescription:
      'Comece um objetivo de poupança NIM partilhado com amigos, família ou comunidade.',
    createCircle: 'Criar Círculo',
    noDescription: 'Sem descrição',
    raised: 'Arrecadado',
    target: 'Meta',
    funded: 'financiado',
    contributor: 'Contribuidor',
    contributors: 'Contribuidores',
    creatorCommitment: 'Compromisso do criador',
    deadline: 'Prazo',
    goalOwner: 'Proprietário do objetivo',
    openCircle: 'Abrir Círculo',
    findCircle: 'Encontrar um círculo',
    findCircleDescription:
      'Insira um ID de círculo partilhado consigo para abrir o círculo.',
    circleIdPlaceholder: 'Insira o ID do círculo',
    search: 'Pesquisar',
    searching: 'A pesquisar...',
    circleIdRequired: 'Insira um ID de círculo.',
    circleNotFound:
      'Circle não encontrado.',
  },

  createCircle: {
    back: 'Voltar',
    newCircle: 'Novo Círculo',
    heading: 'Criar um objetivo de poupança',
    description:
      'Defina uma meta, escolha o proprietário do objetivo e decida quanto irá contribuir.',
    circleName: 'Nome do Círculo',
    circleNamePlaceholder: 'ex. Novo portátil',
    descriptionLabel: 'Descrição',
    descriptionPlaceholder: 'Para que está a poupar?',
    targetAmount: 'Valor da meta',
    targetPlaceholder: 'ex. 100',
    goalOwnerWallet: 'Carteira do proprietário',
    goalOwnerPlaceholder: 'endereço de carteira nq...',
    goalOwnerDescription:
      'Os NIM serão enviados para esta carteira quando o objetivo for concluído.',
    personalCircle: 'Círculo pessoal',
    creatorCommitment: 'O seu compromisso',
    commitmentPlaceholder: 'ex. 20',
    commitmentDescription:
      'O valor que se compromete a contribuir para este Círculo.',
    personalCommitmentDescription:
      'O seu compromisso faz parte da meta e não pode ser alterado após a criação.',
    deadline: 'Prazo',
    nameRequired: 'Introduza um nome para o Círculo.',
    targetInvalid:
      'Introduza um valor de meta válido superior a 0.',
    commitmentInvalid:
      'Introduza um valor de compromisso válido.',
    commitmentTooHigh:
      'O seu compromisso não pode ser superior ao valor da meta.',
    deadlineRequired: 'Escolha um prazo.',
    deadlineInvalid: 'Escolha um prazo futuro.',
    walletInvalid:
      'Introduza um endereço de carteira Nimiq válido.',
    creating: 'A criar...',
    createCircle: 'Criar Círculo',
  },

  circle: {
    back: 'Voltar',
    loading: 'A carregar Círculo...',
    loadingDescription:
      'A obter as informações mais recentes do Círculo.',
    unableToLoad: 'Não foi possível carregar o Círculo',
    tryAgain: 'Tente novamente.',
    refreshError:
      'Ocorreu um erro ao atualizar este Círculo.',
    retrying: 'A tentar novamente...',
    retry: 'Tentar novamente',
    sharedGoal: 'Objetivo partilhado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    expired: 'Expirado',
    active: 'Ativo',
    raised: 'Arrecadado',
    target: 'Meta',
    complete: 'concluído',
    goalReached: 'Objetivo alcançado',
    remaining: 'restante',
    deadline: 'Prazo',
    contributors: 'Contribuidores',
    contributor: 'Contribuidor',
    peopleContributing: 'pessoas a contribuir',
    personContributing: 'pessoa a contribuir',
    shareCircle: 'Partilhar Círculo',
    linkCopied: 'Ligação copiada',
    unableToCopy: 'Não foi possível copiar a ligação',
    aboutCircle: 'Sobre este Círculo',
    creator: 'Criador',
    goalOwner: 'Proprietário do objetivo',
    creatorCommitment: 'Compromisso do criador',
    created: 'Criado',
    contributorsDescription:
      'Pessoas que contribuíram para este objetivo.',
    loadingContributors: 'A carregar contribuidores...',
    noContributors: 'Ainda não há contribuidores',
    noContributorsDescription:
      'Seja a primeira pessoa a contribuir para este Círculo.',
    contributionHistory: 'Histórico de contribuições',
    contributionHistoryDescription:
      'Contribuições recentes feitas para este Círculo.',
    loadingContributionHistory:
      'A carregar histórico de contribuições...',
    noContributions: 'Ainda não há contribuições',
    noContributionsDescription:
      'As contribuições aparecerão aqui quando forem confirmadas.',
    contribution: 'Contribuição',
    confirmed: 'Confirmada',
    creatorControls: 'Controlos do criador',
    manageCircle: 'Gerir Círculo',
    fixedCommitment: 'Compromisso fixo',
    cannotChange:
      'O seu compromisso não pode ser alterado após a criação.',
    extendDeadline: 'Prolongar prazo',
    extendDeadlineDescription:
      'Dê mais tempo a este Círculo para atingir o seu objetivo.',
    cancelCircle: 'Cancelar Círculo',
    cancelCircleDescription:
      'Cancele este Círculo se já não quiser continuar.',
    cancelConfirm: 'Cancelar Círculo?',
    cancelWarning:
      'Esta ação não pode ser desfeita. Os contribuidores deixarão de poder contribuir.',
    keepCircle: 'Manter Círculo',
    cancelling: 'A cancelar...',
    giveMoreTime: 'Dar mais tempo',
    newDeadline: 'Novo prazo',
    newDeadlineDescription:
      'Escolha um novo prazo posterior ao atual.',
    closeDeadlineEditor: 'Fechar editor de prazo',
    updateDeadline: 'Atualizar prazo',
    updatingDeadline: 'A atualizar prazo...',
    chooseNewDeadline: 'Escolha um novo prazo',
    validNewDeadline:
      'Escolha um prazo posterior ao prazo atual.',
    currentDeadlineInvalid:
      'O prazo atual já não é válido.',
    newDeadlineMustBeLater:
      'O novo prazo deve ser posterior ao atual.',
    goalCompleted: 'Objetivo concluído',
    deadlineUnavailable: 'Prazo indisponível',
    deadlinePassed: 'Prazo ultrapassado',
    lessThanDay: 'Menos de um dia restante',
    daysLeft: '{count} dias restantes',
    goalReachedDescription:
      'Este Círculo atingiu o seu objetivo de poupança.',
    circleExpired: 'Círculo expirado',
    circleExpiredDescription:
      'O prazo terminou antes de o objetivo de poupança ser alcançado.',
    circleCancelled: 'Círculo cancelado',
    circleCancelledDescription:
      'Este Círculo foi cancelado pelo seu criador.',
    contributeNim: 'Contribuir com NIM',
    contributeAmount: 'Valor da contribuição',
    creatorCommitmentUnavailable:
      'Compromisso do criador indisponível',
    goalFullyFunded: 'Objetivo totalmente financiado',
    creatorContributionDescription:
      'O criador comprometeu-se a contribuir para este Círculo.',
    goalOwnerDescription:
      'Esta carteira receberá os NIM quando o objetivo for concluído.',
    noCreatorCommitmentDescription:
      'O criador não definiu um compromisso para este Círculo.',
    contributorDescription:
      'Obrigado por ajudar este Círculo a alcançar o seu objetivo.',
    circleId: 'ID do círculo',
    copyCircleId: 'Copiar',
    circleIdCopyFailed: 'Não foi possível copiar o ID do Circle',
    circleIdCopied: 'Copiado',
    progress: 'Progresso',

    shareDescription:
      'Participe deste Circle e ajude a alcançar a meta partilhada com o NimCircle.',

    you: 'Você',

    personal: 'Pessoal',
    fundraising: 'Arrecadação',
    goalType: 'Tipo de meta',

    commitmentDescription:
      'O criador comprometeu-se a contribuir com um valor total durante este Circle. Pode contribuir em vários pagamentos.',

    editCommitment: 'Editar compromisso',
    committed: 'Comprometido',
    contributed: 'Contribuído',

    shared: 'Partilhado',

    refreshing: 'A atualizar...',
    refresh: 'Atualizar',

    pending: 'Pendente',
    failed: 'Falhou',

    newCommitment: 'Novo compromisso',
    updatingCommitment: 'A atualizar...',
    updateCommitment: 'Atualizar compromisso',

    extending: 'A prolongar...',

    commitmentReached:
      'Compromisso atingido',

    commitmentReachedDescription:
      'Atingiu o seu compromisso atual como criador. Pode atualizar o seu compromisso ou continuar este pagamento como uma contribuição normal.',

    contributionAmount:
      'Valor da contribuição',

    commitmentRemaining:
      'Compromisso restante',

    contributeNormally:
      'Contribuir normalmente',

    cancel:
      'Cancelar',
  },

  profile: {
    account: 'Conta',
    yourProfile: 'O seu perfil',
    profileDescription:
      'Gira o seu perfil e veja a sua atividade de contribuições.',
    created: 'Criados',
    joined: 'Participados',
    nimGiven: 'NIM dados',
    supported: 'Apoiados',
    recentContributions: 'Contribuições recentes',
    recentContributionsDescription:
      'As suas últimas contribuições confirmadas.',
    yourWallet: 'A sua carteira',
    copyAddress: 'Copiar endereço',
    addressCopied: 'Endereço copiado',
    memberSince: 'Membro desde',
    unableToLoadActivity:
      'Não foi possível carregar a atividade',
    noContributions: 'Ainda não há contribuições',
    noContributionsDescription:
      'As suas contribuições confirmadas aparecerão aqui.',
    language: 'Idioma',
    languageDescription:
      'Escolha o idioma que pretende utilizar no NimCircle.',
  },

  connectWallet: {
    eyebrow: 'NimCircle',
    title: 'Poupe em conjunto.',
    description:
      'Crie objetivos NIM partilhados, convide outras pessoas e acompanhe todos a contribuir para o mesmo objetivo.',
    walletCardTitle: 'Ligar a carteira Nimiq',
    walletCardDescription:
      'O NimCircle utiliza a sua carteira Nimiq Pay para o identificar e enviar contribuições em NIM.',
    connect: 'Ligar carteira',
    connecting: 'A ligar...',
    connectionFailed: 'Falha ao ligar a carteira',
    diagnostics: 'Estado da ligação',
    nimiqProvider: 'Provedor Nimiq',
    ready: 'Pronto',
    notInitialized: 'Não inicializado',
    wallet: 'Carteira',
    notConnected: 'Não ligada',
    securityNote:
      'As suas chaves privadas nunca saem do Nimiq Pay.',
  },

  walletRestoring: {
    eyebrow: 'NimCircle',
    title: 'A iniciar o NimCircle',
    description: 'A ligar ao Nimiq Pay...',
    initializing: 'A inicializar a ligação à sua carteira',
    networkMainnet: 'Nimiq Mainnet',
    networkTestnet: 'Nimiq Testnet',
    networkDetecting: 'A detetar a rede...',
  },

  welcomeBack: {
    eyebrow: 'NimCircle',
    title: 'Bem-vindo de volta, {name}',
    description:
      'A sua carteira e o seu perfil estão prontos. Vamos voltar aos seus círculos.',
    continue: 'Continuar',
  },

  contributeModal: {
    sharedGoal: 'Objetivo partilhado',
    contributeNim: 'Contribuir NIM',
    confirmCreatorCommitment: 'Confirmar compromisso do criador',
    amount: 'Montante',
    creatorCommitment: 'Compromisso do criador',
    fixedCommitment: 'Compromisso fixo',
    remaining: 'Restante',
    recipient: 'Destinatário',
    circleMemo: 'Memo do círculo',
    close: 'Fechar',
    contribute: 'Contribuir',
    contributeAmount: 'Contribuir {amount} NIM',
    confirmContribution: 'A confirmar contribuição...',
    transaction: 'Transação',
    contributionConfirmed: 'Contribuição confirmada',
    contributionConfirmedDescription:
      'A sua contribuição de {amount} NIM foi confirmada na blockchain Nimiq.',
    done: 'Concluído',
    walletApproval:
      'O Nimiq Pay irá pedir-lhe para aprovar esta transação.',
    validAmount: 'Introduza um montante NIM válido.',
    maximumAmount:
      'Pode contribuir no máximo {amount} NIM.',
    minimumAmount:
      'A contribuição mínima é de 0.00001 NIM.',
    creatorCommitmentCannotChange:
      'O seu compromisso como criador não pode ser alterado.',
    invalidRecipient:
      'Este círculo tem um endereço de destinatário inválido.',
    transactionCancelled:
      'Cancelou a transação.',
    serverUnavailable:
      'Não foi possível contactar o servidor do NimCircle. Verifique a sua ligação e tente novamente.',
    processingError:
      'Ocorreu um erro ao processar a contribuição. Tente novamente.',
    transactionConfirmationFailed:
      'Não foi possível confirmar a transação.',
    transactionSentWarning:
      'A sua transação foi enviada, mas o NimCircle não conseguiu concluir o processamento. Os seus fundos podem já ter sido transferidos.',
    unknownTransaction: 'desconhecida',
    transactionLabel: 'Transação: {hash}',
    paymentNoAccount:
      'Não está ligada nenhuma conta Nimiq.',

    paymentInvalidRecipient:
      'Este círculo tem um endereço de destinatário inválido.',

    paymentInvalidRecipientFormat:
      'O destinatário do círculo não é um endereço Nimiq válido.',

    paymentMissingCircleId:
      'Falta o ID do círculo.',

    paymentConsensusNotEstablished:
      'O consenso Nimiq ainda não está estabelecido. Aguarde que o Nimiq Pay termine a sincronização e tente novamente.',

    paymentAmountInvalid:
      'O montante em NIM deve ser superior a zero.',

    paymentAmountTooLarge:
      'O montante em NIM é demasiado elevado.',

    paymentTransactionFailed:
      'O Nimiq Pay não conseguiu enviar a transação.',

    testnetRequired:
      'Nimiq Testnet necessário',

    testnetRequiredDescription:
      'O NimCircle está a utilizar atualmente o Nimiq Testnet. Mude o Nimiq Pay para Testnet antes de contribuir.',
  },

  profileSetup: {
    eyebrow: 'NimCircle',
    title: 'Crie o seu perfil',
    description:
      'Escolha um nome de utilizador e um nome que os membros do seu círculo possam reconhecer.',
    username: 'Nome de utilizador',
    usernamePlaceholder: 'kaos',
    usernameHint:
      '3-20 caracteres usando letras, números ou underscores.',
    displayName: 'Nome de apresentação',
    displayNamePlaceholder: 'ex. Kaos',
    connectedWallet: 'Carteira conectada',
    createProfile: 'Criar perfil',

    pleaseChooseUsername:
      'Escolha um nome de utilizador.',
    usernameTooShort:
      'O seu nome de utilizador deve ter pelo menos 3 caracteres.',
    usernameTooLong:
      'O seu nome de utilizador deve ter no máximo 20 caracteres.',
    usernameInvalid:
      'O nome de utilizador só pode conter letras, números e underscores.',
    pleaseEnterDisplayName:
      'Introduza um nome de apresentação.',
    displayNameTooShort:
      'O seu nome de apresentação deve ter pelo menos 2 caracteres.',
    displayNameTooLong:
      'O seu nome de apresentação deve ter no máximo 30 caracteres.',

    usernameTaken:
      'Esse nome de utilizador já está em uso.',
    profileExists:
      'Já existe um perfil para esta carteira.',
    userAlreadyExists:
      'Já existe um perfil com este endereço de carteira ou nome de utilizador.',
    unableToCreate:
      'Não foi possível criar o seu perfil. Tente novamente.',
  },

  networkNotice: {
    testnetTitle: 'O NimCircle está em fase de testes',
    testnetDescription:
      'O NimCircle está atualmente no Nimiq Testnet durante a fase de testes. Mude a rede do Nimiq Pay de Default para Testnet antes de conectar a sua carteira ou fazer uma contribuição.',
    mainnetTitle: 'O NimCircle está disponível',
    mainnetDescription:
      'A fase de testes terminou. O NimCircle agora está no Nimiq Mainnet. Mude a rede do Nimiq Pay de Default para Mainnet antes de conectar a sua carteira ou fazer uma contribuição.',
    testnet: 'Testnet',
    mainnet: 'Mainnet',
    howToSwitchTestnet: 'Como mudar para Testnet',
    howToSwitchMainnet: 'Como mudar para Mainnet',
    testnetGuide:
      'No Nimiq Pay, abra o menu e mantenha Configurações pressionado por cerca de 10 segundos para abrir as configurações do provedor. Nessa tela, mude a rede de Default para Testnet. Não precisa de alterar mais nada. O Nimiq Pay recarregará a Mini App automaticamente. Pode obter NIM de teste gratuitamente na página do Nimiq Testnet e usá-los para testar o NimCircle.',
    mainnetGuide:
      'No Nimiq Pay, abra o menu e mantenha Configurações pressionado por cerca de 10 segundos para abrir as configurações do provedor. Nessa tela, mude a rede de Default para Mainnet. Não precisa de alterar mais nada. O Nimiq Pay recarregará a Mini App automaticamente.',
    hideGuide: 'Ocultar instruções',
    ignoreIfCorrect:
      'Já está a usar a rede correta? Pode ignorar esta mensagem e continuar.',
  },

  language: {
    title: 'Idioma',
    english: 'English',
    spanish: 'Español',
    german: 'Deutsch',
    french: 'Français',
    portuguese: 'Português',
  },
} satisfies LanguageTranslations