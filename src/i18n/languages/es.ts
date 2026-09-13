import type { LanguageTranslations } from '../translationTypes'

export const es = {
  navigation: {
    home: 'Inicio',
    circles: 'Círculos',
    create: 'Crear',
    profile: 'Perfil',
  },

  app: {
    unableToLoadProfile:
      'No se pudo cargar tu perfil',
    tryAgain: 'Inténtalo de nuevo',
    loadingCircles:
      'Cargando tus círculos...',
  
    errors: {
      network:
        'No pudimos conectar con el servidor de NimCircle. Comprueba tu conexión e inténtalo de nuevo.',
      invalidResponse:
        'El servidor devolvió una respuesta no válida. Inténtalo de nuevo.',
      walletUsernameRequired:
        'Se requieren la dirección de la billetera y el nombre de usuario.',
      usernameLength:
        'Tu nombre de usuario debe tener entre 3 y 20 caracteres.',
      usernameFormat:
        'El nombre de usuario solo puede contener letras, números y guiones bajos.',
      displayNameLength:
        'Tu nombre para mostrar debe tener 30 caracteres o menos.',
      profileExists:
        'Ya existe un perfil para esta billetera.',
      usernameTaken:
        'Ese nombre de usuario ya está ocupado.',
      userAlreadyExists:
        'Ya existe un perfil con esta dirección de billetera o nombre de usuario.',
      userNotFound:
        'Usuario no encontrado.',
      noValidUpdateFields:
        'No se proporcionaron campos de perfil válidos.',
      circleFieldsRequired:
        'Falta información obligatoria del Circle.',
      creatorNotFound:
        'No se pudo encontrar al creador del Circle.',
      creatorWalletMismatch:
        'La billetera del creador no coincide con su perfil.',
      goalOwnerNotFound:
        'No se pudo encontrar al propietario del objetivo.',
      goalOwnerWalletMismatch:
        'La billetera del propietario del objetivo no coincide con su perfil.',
      targetAmountInvalid:
        'El importe objetivo no es válido.',
      creatorCommitmentInvalid:
        'El compromiso del creador no es válido.',
      creatorCommitmentTooLarge:
        'El compromiso del creador no puede superar el objetivo del Circle.',
      invalidDeadline:
        'La fecha límite no es válida.',
      deadlineNotFuture:
        'La fecha límite debe ser futura.',
      circleAlreadyExists:
        'Ya existe un Circle con este ID.',
      circleNotFound:
        'Circle no encontrado.',
      walletRequired:
        'Se requiere una dirección de billetera.',
      invalidStatusChange:
        'El único cambio de estado manual permitido es la cancelación.',
      onlyCreatorCanCancel:
        'Solo el creador del Circle puede cancelarlo.',
      circleStatusLocked:
        'Este Circle ya no puede cambiar de estado.',
      onlyCreatorCanExtend:
        'Solo el creador del Circle puede ampliar la fecha límite.',
      circleDeadlineLocked:
        'Este Circle ya no puede ampliar su fecha límite.',
      deadlineRequired:
        'Se requiere una fecha límite.',
      deadlineMustBeLater:
        'La nueva fecha límite debe ser posterior a la actual.',
      transactionHashRequired:
        'Se requiere un hash de transacción.',
      transactionNotFound:
        'No se encontró la transacción en el historial de la blockchain de Nimiq.',
      transactionNotConfirmed:
        'La transacción no ha sido confirmada en la blockchain de Nimiq.',
      transactionFailed:
        'La transacción de Nimiq falló.',
      recipientMismatch:
        'El destinatario de la transacción no coincide con el propietario del objetivo del Circle.',
      amountMismatch:
        'El importe de la transacción no coincide con el importe de la contribución.',
      memoMismatch:
        'El memo de la transacción no coincide con el Circle.',
      senderMismatch:
        'El remitente de la transacción no coincide con la billetera del contribuyente.',
      contributionNotFound:
        'Contribución no encontrada.',
    },
  },

  home: {
    welcomeBack: 'Bienvenido de nuevo',
    description: 'Ahorren juntos. Alcancen sus metas juntos.',
    startAGoal: 'Comenzar una meta',
    createCircle: 'Crear un Círculo',
    createCircleDescription:
      'Establece una meta de ahorro e invita a otros a contribuir.',
    yourGoals: 'Tus metas',
    created: 'Creadas',
    joined: 'Unidas',
    totalRaised: 'Total recaudado',
    nimAcrossActiveGoals: 'NIM en metas activas',
    activeGoals: 'Metas activas',
    activeGoalsDescription:
      'Mantén un seguimiento de las metas que estás ayudando a alcanzar.',
    viewAll: 'Ver todo',
    noActiveGoals: 'No hay metas activas',
    noActiveGoalsDescription:
      'Todavía no tienes metas de ahorro activas.',
    yourFirstCircle: 'Tu primer Círculo',
    yourFirstCircleDescription:
      'Crea una meta de ahorro compartida y comiencen a contribuir juntos.',
    activeGoal: 'Meta activa',
    sharedNimSavingsGoal: 'Meta de ahorro NIM compartida',
    nimRaised: 'NIM recaudados',
    nimToGo: 'NIM restantes',
    contributor: 'Contribuyente',
    contributors: 'Contribuyentes',
    viewAllGoals: 'Ver todas las metas',
  },

  circles: {
    title: 'Círculos',
    heading: 'Tus Círculos',
    description: 'Metas que has creado o a las que te has unido.',
    create: 'Crear Círculo',
    created: 'Creados',
    joined: 'Unidos',
    createdGoalTarget: 'Meta de círculos creados',
    joinedGoalTarget: 'Meta de círculos unidos',
    across: 'en',
    circle: 'Círculo',
    circles: 'Círculos',
    loading: 'Cargando círculos...',
    noJoinedCircles: 'No hay Círculos unidos',
    joinedDescription:
      'Los Círculos a los que contribuyas aparecerán aquí.',
    createFirstCircle: 'Crea tu primer Círculo',
    createFirstDescription:
      'Comienza una meta de ahorro NIM compartida con amigos, familia o tu comunidad.',
    createCircle: 'Crear Círculo',
    noDescription: 'Sin descripción',
    raised: 'Recaudado',
    target: 'Meta',
    funded: 'financiado',
    contributor: 'Contribuyente',
    contributors: 'Contribuyentes',
    creatorCommitment: 'Compromiso del creador',
    deadline: 'Fecha límite',
    goalOwner: 'Propietario de la meta',
    openCircle: 'Abrir Círculo',
    findCircle: 'Buscar un círculo',
    findCircleDescription:
      'Introduce un ID de círculo compartido contigo para abrir el círculo.',
    circleIdPlaceholder: 'Introduce el ID del círculo',
    search: 'Buscar',
    searching: 'Buscando...',
    circleIdRequired: 'Introduce un ID de círculo.',
    circleNotFound:
        'Circle no encontrado.',
  },

  createCircle: {
    back: 'Atrás',
    newCircle: 'Nuevo Círculo',
    heading: 'Crea una meta de ahorro',
    description:
      'Establece una meta, elige al propietario y decide cuánto aportarás.',
    circleName: 'Nombre del Círculo',
    circleNamePlaceholder: 'ej. Nuevo portátil',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: '¿Para qué estás ahorrando?',
    targetAmount: 'Cantidad objetivo',
    targetPlaceholder: 'ej. 100',
    goalOwnerWallet: 'Billetera del propietario',
    goalOwnerPlaceholder: 'dirección de billetera nq...',
    goalOwnerDescription:
      'Los NIM se enviarán a esta billetera cuando se complete la meta.',
    personalCircle: 'Círculo personal',
    creatorCommitment: 'Tu compromiso',
    commitmentPlaceholder: 'ej. 20',
    commitmentDescription:
      'La cantidad que te comprometes a aportar a este Círculo.',
    personalCommitmentDescription:
      'Tu compromiso forma parte de la meta y no se puede cambiar después de crearla.',
    deadline: 'Fecha límite',
    nameRequired: 'Introduce un nombre para el Círculo.',
    targetInvalid: 'Introduce una cantidad objetivo válida mayor que 0.',
    commitmentInvalid: 'Introduce una cantidad de compromiso válida.',
    commitmentTooHigh:
      'Tu compromiso no puede ser mayor que la cantidad objetivo.',
    deadlineRequired: 'Elige una fecha límite.',
    deadlineInvalid: 'Elige una fecha límite futura.',
    walletInvalid: 'Introduce una dirección de billetera Nimiq válida.',
    creating: 'Creando...',
    createCircle: 'Crear Círculo',
  },

  circle: {
    back: 'Atrás',
    loading: 'Cargando Círculo...',
    loadingDescription: 'Obteniendo la información más reciente.',
    unableToLoad: 'No se pudo cargar el Círculo',
    tryAgain: 'Inténtalo de nuevo.',
    refreshError: 'Algo salió mal al actualizar este Círculo.',
    retrying: 'Reintentando...',
    retry: 'Reintentar',
    sharedGoal: 'Meta compartida',
    completed: 'Completado',
    cancelled: 'Cancelado',
    expired: 'Expirado',
    active: 'Activo',
    raised: 'Recaudado',
    target: 'Meta',
    complete: 'completado',
    goalReached: 'Meta alcanzada',
    remaining: 'restante',
    deadline: 'Fecha límite',
    contributors: 'Contribuyentes',
    contributor: 'Contribuyente',
    peopleContributing: 'personas contribuyendo',
    personContributing: 'persona contribuyendo',
    shareCircle: 'Compartir Círculo',
    linkCopied: 'Enlace copiado',
    unableToCopy: 'No se pudo copiar el enlace',
    aboutCircle: 'Sobre este Círculo',
    creator: 'Creador',
    goalOwner: 'Propietario de la meta',
    creatorCommitment: 'Compromiso del creador',
    created: 'Creado',
    contributorsDescription:
      'Personas que han contribuido a esta meta.',
    loadingContributors: 'Cargando contribuyentes...',
    noContributors: 'Aún no hay contribuyentes',
    noContributorsDescription:
      'Sé la primera persona en contribuir a este Círculo.',
    contributionHistory: 'Historial de contribuciones',
    contributionHistoryDescription:
      'Contribuciones recientes realizadas a este Círculo.',
    loadingContributionHistory:
      'Cargando historial de contribuciones...',
    noContributions: 'Aún no hay contribuciones',
    noContributionsDescription:
      'Las contribuciones aparecerán aquí cuando sean confirmadas.',
    contribution: 'Contribución',
    confirmed: 'Confirmada',
    creatorControls: 'Controles del creador',
    manageCircle: 'Administrar Círculo',
    fixedCommitment: 'Compromiso fijo',
    cannotChange:
      'Tu compromiso no se puede cambiar después de crear el Círculo.',
    extendDeadline: 'Extender fecha límite',
    extendDeadlineDescription:
      'Dale más tiempo a este Círculo para alcanzar su meta.',
    cancelCircle: 'Cancelar Círculo',
    cancelCircleDescription:
      'Cancela este Círculo si ya no quieres continuar.',
    cancelConfirm: '¿Cancelar Círculo?',
    cancelWarning:
      'Esta acción no se puede deshacer. Los contribuyentes ya no podrán contribuir.',
    keepCircle: 'Mantener Círculo',
    cancelling: 'Cancelando...',
    giveMoreTime: 'Dar más tiempo',
    newDeadline: 'Nueva fecha límite',
    newDeadlineDescription:
      'Elige una nueva fecha posterior a la actual.',
    closeDeadlineEditor: 'Cerrar editor de fecha límite',
    updateDeadline: 'Actualizar fecha límite',
    updatingDeadline: 'Actualizando fecha límite...',
    chooseNewDeadline: 'Elige una nueva fecha límite',
    validNewDeadline:
      'Elige una fecha posterior a la fecha límite actual.',
    currentDeadlineInvalid:
      'La fecha límite actual ya no es válida.',
    newDeadlineMustBeLater:
      'La nueva fecha límite debe ser posterior a la actual.',
    goalCompleted: 'Meta completada',
    deadlineUnavailable: 'Fecha límite no disponible',
    deadlinePassed: 'Fecha límite pasada',
    lessThanDay: 'Menos de un día restante',
    daysLeft: '{count} días restantes',
    goalReachedDescription:
      'Este Círculo ha alcanzado su meta de ahorro.',
    circleExpired: 'Círculo expirado',
    circleExpiredDescription:
      'La fecha límite pasó antes de alcanzar la meta de ahorro.',
    circleCancelled: 'Círculo cancelado',
    circleCancelledDescription:
      'Este Círculo fue cancelado por su creador.',
    contributeNim: 'Contribuir NIM',
    contributeAmount: 'Cantidad a contribuir',
    creatorCommitmentUnavailable:
      'Compromiso del creador no disponible',
    goalFullyFunded: 'Meta totalmente financiada',
    creatorContributionDescription:
      'El creador se ha comprometido a contribuir a este Círculo.',
    goalOwnerDescription:
      'Esta billetera recibirá los NIM cuando se complete la meta.',
    noCreatorCommitmentDescription:
      'El creador no ha establecido un compromiso para este Círculo.',
    contributorDescription:
      'Gracias por ayudar a este Círculo a alcanzar su meta.',
    circleId: 'ID del círculo',
    copyCircleId: 'Copiar',
    circleIdCopied: 'Copiado',
  },

  profile: {
    account: 'Cuenta',
    yourProfile: 'Tu perfil',
    profileDescription:
      'Administra tu perfil y consulta tu actividad de contribuciones.',
    created: 'Creados',
    joined: 'Unidos',
    nimGiven: 'NIM aportados',
    supported: 'Apoyados',
    recentContributions: 'Contribuciones recientes',
    recentContributionsDescription:
      'Tus últimas contribuciones confirmadas.',
    yourWallet: 'Tu billetera',
    copyAddress: 'Copiar dirección',
    addressCopied: 'Dirección copiada',
    memberSince: 'Miembro desde',
    unableToLoadActivity: 'No se pudo cargar la actividad',
    noContributions: 'Aún no hay contribuciones',
    noContributionsDescription:
      'Tus contribuciones confirmadas aparecerán aquí.',
    language: 'Idioma',
    languageDescription:
      'Elige el idioma que quieres usar en NimCircle.',
  },

  connectWallet: {
    eyebrow: 'NimCircle',
    title: 'Ahorren juntos.',
    description:
      'Crea objetivos compartidos de NIM, invita a otras personas y observa cómo todos contribuyen al mismo objetivo.',
    walletCardTitle: 'Conecta tu billetera Nimiq',
    walletCardDescription:
      'NimCircle utiliza tu billetera de Nimiq Pay para identificarte y enviar contribuciones de NIM.',
    connect: 'Conectar billetera',
    connecting: 'Conectando...',
    connectionFailed: 'La conexión de la billetera falló',
    diagnostics: 'Estado de conexión',
    nimiqProvider: 'Proveedor de Nimiq',
    ready: 'Listo',
    notInitialized: 'No inicializado',
    wallet: 'Billetera',
    notConnected: 'No conectada',
    securityNote:
      'Tus claves privadas nunca salen de Nimiq Pay.',
  },

  walletRestoring: {
    eyebrow: 'NimCircle',
    title: 'Iniciando NimCircle',
    description: 'Conectando con Nimiq Pay...',
    initializing: 'Inicializando la conexión con tu billetera',
  },

  welcomeBack: {
    eyebrow: 'NimCircle',
    title: 'Bienvenido de nuevo, {name}',
    description:
      'Tu billetera y tu perfil están listos. Volvamos a tus círculos.',
    continue: 'Continuar',
  },

  contributeModal: {
    sharedGoal: 'Objetivo compartido',
    contributeNim: 'Contribuir NIM',
    confirmCreatorCommitment: 'Confirmar compromiso del creador',
    amount: 'Cantidad',
    creatorCommitment: 'Compromiso del creador',
    fixedCommitment: 'Compromiso fijo',
    remaining: 'Restante',
    recipient: 'Destinatario',
    circleMemo: 'Memo del círculo',
    close: 'Cerrar',
    contribute: 'Contribuir',
    contributeAmount: 'Contribuir {amount} NIM',
    confirmContribution: 'Confirmando contribución...',
    transaction: 'Transacción',
    contributionConfirmed: 'Contribución confirmada',
    contributionConfirmedDescription:
      'Tu contribución de {amount} NIM ha sido confirmada en la cadena de bloques de Nimiq.',
    done: 'Listo',
    walletApproval:
      'Nimiq Pay te pedirá que apruebes esta transacción.',
    validAmount: 'Introduce una cantidad válida de NIM.',
    maximumAmount:
      'Puedes contribuir un máximo de {amount} NIM.',
    minimumAmount:
      'La contribución mínima es de 0.00001 NIM.',
    creatorCommitmentCannotChange:
      'Tu compromiso como creador no puede modificarse.',
    invalidRecipient:
      'Este círculo tiene una dirección de destinatario no válida.',
    transactionCancelled:
      'Has cancelado la transacción.',
    serverUnavailable:
      'No pudimos conectarnos al servidor de NimCircle. Comprueba tu conexión e inténtalo de nuevo.',
    processingError:
      'Algo salió mal al procesar la contribución. Inténtalo de nuevo.',
    transactionConfirmationFailed:
      'No se pudo confirmar la transacción.',
    transactionSentWarning:
      'Tu transacción fue enviada, pero NimCircle no pudo terminar de procesarla. Es posible que tus fondos ya hayan sido transferidos.',
    unknownTransaction: 'desconocida',
    transactionLabel: 'Transacción: {hash}',
    paymentNoAccount:
      'No hay ninguna cuenta de Nimiq conectada.',
    
    paymentInvalidRecipient:
      'El círculo tiene una dirección de destinatario no válida.',
    
    paymentInvalidRecipientFormat:
      'El destinatario del círculo no es una dirección de Nimiq válida.',
    
    paymentMissingCircleId:
      'Falta el ID del círculo.',
    
    paymentConsensusNotEstablished:
      'El consenso de Nimiq aún no está establecido. Espera a que Nimiq Pay termine de sincronizarse e inténtalo de nuevo.',
    
    paymentAmountInvalid:
      'La cantidad de NIM debe ser mayor que cero.',
    
    paymentAmountTooLarge:
      'La cantidad de NIM es demasiado grande.',
    
    paymentTransactionFailed:
      'Nimiq Pay no pudo enviar la transacción.',
  },

  profileSetup: {
    eyebrow: 'NimCircle',
    title: 'Crea tu perfil',
    description:
      'Elige un nombre de usuario y un nombre que los miembros de tu círculo puedan reconocer.',
    username: 'Nombre de usuario',
    usernamePlaceholder: 'kaos',
    usernameHint:
      '3-20 caracteres usando letras, números o guiones bajos.',
    displayName: 'Nombre para mostrar',
    displayNamePlaceholder: 'ej. Kaos',
    connectedWallet: 'Billetera conectada',
    createProfile: 'Crear perfil',
  
    pleaseChooseUsername:
      'Elige un nombre de usuario.',
    usernameTooShort:
      'Tu nombre de usuario debe tener al menos 3 caracteres.',
    usernameTooLong:
      'Tu nombre de usuario debe tener 20 caracteres o menos.',
    usernameInvalid:
      'El nombre de usuario solo puede contener letras, números y guiones bajos.',
    pleaseEnterDisplayName:
      'Introduce un nombre para mostrar.',
    displayNameTooShort:
      'Tu nombre para mostrar debe tener al menos 2 caracteres.',
    displayNameTooLong:
      'Tu nombre para mostrar debe tener 30 caracteres o menos.',
  
    usernameTaken:
      'Ese nombre de usuario ya está en uso.',
    profileExists:
      'Ya existe un perfil para esta billetera.',
    userAlreadyExists:
      'Ya existe un perfil con esta dirección de billetera o nombre de usuario.',
    unableToCreate:
      'No se pudo crear tu perfil. Inténtalo de nuevo.',
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