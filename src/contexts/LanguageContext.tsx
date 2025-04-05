import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es" | "fr" | "ru" | "zh";

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Basic translations for demonstration
const translations: Translations = {
  // Header and common translations
  "handyman": {
    en: "Handyman",
    es: "Manitas",
    fr: "Bricoleur",
    ru: "Мастер",
    zh: "修理工"
  },
  "professionalServices": {
    en: "Professional services for your home",
    es: "Servicios profesionales para tu hogar",
    fr: "Services professionnels pour votre maison",
    ru: "Профессиональные услуги для вашего дома",
    zh: "为您的家提供专业服务"
  },
  "register": {
    en: "Register",
    es: "Registrarse",
    fr: "S'inscrire",
    ru: "Регистрация",
    zh: "注册"
  },
  "login": {
    en: "Log In",
    es: "Iniciar Sesión",
    fr: "Connexion",
    ru: "Вход",
    zh: "登录"
  },
  "services": {
    en: "Services",
    es: "Servicios",
    fr: "Services",
    ru: "Услуги",
    zh: "服务"
  },
  "profile": {
    en: "Profile",
    es: "Perfil",
    fr: "Profil",
    ru: "Профиль",
    zh: "个人资料"
  },
  "signOut": {
    en: "Sign Out",
    es: "Cerrar Sesión",
    fr: "Déconnexion",
    ru: "Выход",
    zh: "登出"
  },
  
  // Auth pages
  "welcomeBack": {
    en: "Welcome Back",
    es: "Bienvenido de nuevo",
    fr: "Bon retour",
    ru: "С возвращением",
    zh: "欢迎回来"
  },
  "loginToAccess": {
    en: "Log in to access Handyman services",
    es: "Inicia sesión para acceder a los servicios de Manitas",
    fr: "Connectez-vous pour accéder aux services de Bricoleur",
    ru: "Войдите, чтобы получить доступ к услугам Мастера",
    zh: "登录以访问修理工服务"
  },
  "email": {
    en: "Email",
    es: "Correo electrónico",
    fr: "Email",
    ru: "Электронная почта",
    zh: "电子邮件"
  },
  "enterEmail": {
    en: "Enter your email",
    es: "Introduce tu correo electrónico",
    fr: "Entrez votre email",
    ru: "Введите вашу электронную почту",
    zh: "输入您的电子邮件"
  },
  "password": {
    en: "Password",
    es: "Contraseña",
    fr: "Mot de passe",
    ru: "Пароль",
    zh: "密码"
  },
  "enterPassword": {
    en: "Enter your password",
    es: "Introduce tu contraseña",
    fr: "Entrez votre mot de passe",
    ru: "Введите ваш пароль",
    zh: "输入您的密码"
  },
  "forgotPassword": {
    en: "Forgot password?",
    es: "¿Olvidaste tu contraseña?",
    fr: "Mot de passe oublié?",
    ru: "Забыли пароль?",
    zh: "忘记密码？"
  },
  "dontHaveAccount": {
    en: "Don't have an account?",
    es: "¿No tienes una cuenta?",
    fr: "Vous n'avez pas de compte?",
    ru: "Нет учетной записи?",
    zh: "没有账户？"
  },
  "createAccount": {
    en: "Create an Account",
    es: "Crear una cuenta",
    fr: "Créer un compte",
    ru: "Создать учетную запись",
    zh: "创建账户"
  },
  "registerToStart": {
    en: "Register to get started with Handyman services",
    es: "Regístrate para comenzar con los servicios de Manitas",
    fr: "Inscrivez-vous pour commencer avec les services de Bricoleur",
    ru: "Зарегистрируйтесь, чтобы начать пользоваться услугами Мастера",
    zh: "注册以开始使用修理工服务"
  },
  "fullName": {
    en: "Full Name",
    es: "Nombre completo",
    fr: "Nom complet",
    ru: "Полное имя",
    zh: "全名"
  },
  "enterFullName": {
    en: "Enter your full name",
    es: "Introduce tu nombre completo",
    fr: "Entrez votre nom complet",
    ru: "Введите ваше полное имя",
    zh: "输入您的全名"
  },
  "createPassword": {
    en: "Create a password",
    es: "Crea una contraseña",
    fr: "Créez un mot de passe",
    ru: "Создайте пароль",
    zh: "创建密码"
  },
  "confirmPassword": {
    en: "Confirm Password",
    es: "Confirmar contraseña",
    fr: "Confirmer le mot de passe",
    ru: "Подтвердите пароль",
    zh: "确认密码"
  },
  "confirmYourPassword": {
    en: "Confirm your password",
    es: "Confirma tu contraseña",
    fr: "Confirmez votre mot de passe",
    ru: "Подтвердите ваш пароль",
    zh: "确认您的密码"
  },
  "alreadyHaveAccount": {
    en: "Already have an account?",
    es: "¿Ya tienes una cuenta?",
    fr: "Vous avez déjà un compte?",
    ru: "Уже есть учетная запись?",
    zh: "已有账户？"
  },
  
  // Dashboard page
  "dashboard": {
    en: "Dashboard",
    es: "Panel de control",
    fr: "Tableau de bord",
    ru: "Панель управления",
    zh: "仪表板"
  },
  "whoWeAre": {
    en: "Who We Are",
    es: "Quiénes somos",
    fr: "Qui nous sommes",
    ru: "Кто мы",
    zh: "我们是谁"
  },
  "whoWeAreDesc1": {
    en: "Handyman is an innovative platform designed to empower residential communities by connecting them directly with trusted local service providers.",
    es: "Manitas es una plataforma innovadora diseñada para empoderar a las comunidades residenciales conectándolas directamente con proveedores de servicios locales de confianza.",
    fr: "Bricoleur est une plateforme innovante conçue pour autonomiser les communautés résidentielles en les connectant directement avec des prestataires de services locaux de confiance.",
    ru: "Мастер - это инновационная платформа, разработанная для расширения возможностей жилых сообществ, соединяя их напрямую с надежными местными поставщиками услуг.",
    zh: "修理工是一个创新平台，旨在通过将住宅社区直接与值得信赖的本地服务提供商连接起来，赋予住宅社区权力。"
  },
  "whoWeAreDesc2": {
    en: "Our model eliminates intermediaries, ensuring competitive pricing for shared expenses, maintenance, and home services—while fostering small businesses in your area. By streamlining transactions and promoting transparency, we help neighborhoods save costs and build stronger local economies.",
    es: "Nuestro modelo elimina intermediarios, asegurando precios competitivos para gastos compartidos, mantenimiento y servicios para el hogar, mientras fomenta pequeñas empresas en tu área. Al simplificar las transacciones y promover la transparencia, ayudamos a los vecindarios a ahorrar costos y construir economías locales más fuertes.",
    fr: "Notre modèle élimine les intermédiaires, garantissant des prix compétitifs pour les dépenses partagées, l'entretien et les services à domicile, tout en favorisant les petites entreprises de votre région. En simplifiant les transactions et en promouvant la transparence, nous aidons les quartiers à réduire les coûts et à construire des économies locales plus fortes.",
    ru: "Наша модель устраняет посредников, обеспечивая конкурентоспособные цены на общие расходы, техническое обслуживание и домашние услуги, одновременно поддерживая малый бизнес в вашем районе. Упрощая транзакции и способствуя прозрачности, мы помогаем районам экономить затраты и создавать более сильную местную экономику.",
    zh: "我们的模式消除了中间商，确保共享费用、维护和家庭服务的竞争性价格，同时培育您所在地区的小型企业。通过简化交易和促进透明度，我们帮助社区节省成本并建立更强大的本地经济。"
  },
  "howItWorks": {
    en: "How It Works",
    es: "Cómo funciona",
    fr: "Comment ça marche",
    ru: "Как это работает",
    zh: "工作原理"
  },
  "howItWorksDesc": {
    en: "Our platform connects community members with trusted service providers through a simple, transparent process:",
    es: "Nuestra plataforma conecta a los miembros de la comunidad con proveedores de servicios de confianza a través de un proceso simple y transparente:",
    fr: "Notre plateforme connecte les membres de la communauté avec des prestataires de services de confiance grâce à un processus simple et transparent:",
    ru: "Наша платформа соединяет членов сообщества с надежными поставщиками услуг через простой, прозрачный процесс:",
    zh: "我们的平台通过简单、透明的流程将社区成员与值得信赖的服务提供商连接起来："
  },
  "step1": {
    en: "Community members post their service needs",
    es: "Los miembros de la comunidad publican sus necesidades de servicio",
    fr: "Les membres de la communauté publient leurs besoins en services",
    ru: "Члены сообщества публикуют свои потребности в услугах",
    zh: "社区成员发布他们的服务需求"
  },
  "step2": {
    en: "Local providers submit competitive quotes",
    es: "Los proveedores locales envían cotizaciones competitivas",
    fr: "Les prestataires locaux soumettent des devis compétitifs",
    ru: "Местные поставщики предлагают конкурентоспособные цены",
    zh: "本地提供商提交有竞争力的报价"
  },
  "step3": {
    en: "Members select providers based on ratings and price",
    es: "Los miembros seleccionan proveedores según calificaciones y precio",
    fr: "Les membres sélectionnent les prestataires en fonction des évaluations et du prix",
    ru: "Члены выбирают поставщиков на основе рейтингов и цены",
    zh: "成员根据评级和价格选择提供商"
  },
  "step4": {
    en: "Services are delivered with quality assurance",
    es: "Los servicios se entregan con garantía de calidad",
    fr: "Les services sont fournis avec une assurance qualité",
    ru: "Услуги предоставляются с гарантией качества",
    zh: "服务提供有质量保证"
  },
  "step5": {
    en: "Both parties rate the experience",
    es: "Ambas partes califican la experiencia",
    fr: "Les deux parties évaluent l'expérience",
    ru: "Обе стороны оценивают опыт",
    zh: "双方对体验进行评价"
  },
  "achievements": {
    en: "Our Greatest Achievements",
    es: "Nuestros mayores logros",
    fr: "Nos plus grandes réalisations",
    ru: "Наши величайшие достижения",
    zh: "我们最大的成就"
  },
  "achievementsDesc": {
    en: "Since our launch, we've achieved remarkable milestones:",
    es: "Desde nuestro lanzamiento, hemos logrado hitos notables:",
    fr: "Depuis notre lancement, nous avons atteint des jalons remarquables:",
    ru: "С момента запуска мы достигли замечательных вех:",
    zh: "自推出以来，我们已经取得了显著的里程碑："
  },
  "achievement1": {
    en: "Connected over 10,000 communities with local service providers",
    es: "Conectamos más de 10,000 comunidades con proveedores de servicios locales",
    fr: "Connecté plus de 10 000 communautés avec des prestataires de services locaux",
    ru: "Соединили более 10 000 сообществ с местными поставщиками услуг",
    zh: "将超过10,000个社区与当地服务提供商连接起来"
  },
  "achievement2": {
    en: "Helped communities save 30% on average for maintenance services",
    es: "Ayudamos a las comunidades a ahorrar un 30% en promedio en servicios de mantenimiento",
    fr: "Aidé les communautés à économiser 30% en moyenne pour les services de maintenance",
    ru: "Помогли сообществам сэкономить в среднем 30% на услугах по техническому обслуживанию",
    zh: "帮助社区平均节省30%的维护服务费用"
  },
  "achievement3": {
    en: "Supported 5,000+ small businesses in growing their client base",
    es: "Apoyamos a más de 5,000 pequeñas empresas en el crecimiento de su base de clientes",
    fr: "Soutenu plus de 5 000 petites entreprises dans le développement de leur clientèle",
    ru: "Поддержали более 5 000 малых предприятий в расширении их клиентской базы",
    zh: "支持5,000多家小型企业发展其客户群"
  },
  "achievement4": {
    en: "Maintained a 4.8/5 satisfaction rating across all services",
    es: "Mantenemos una calificación de satisfacción de 4.8/5 en todos los servicios",
    fr: "Maintenu une note de satisfaction de 4,8/5 pour tous les services",
    ru: "Поддерживали рейтинг удовлетворенности 4,8/5 по всем услугам",
    zh: "在所有服务中保持4.8/5的满意度评级"
  },
  "achievement5": {
    en: "Expanded to 50+ cities nationwide",
    es: "Expandimos a más de 50 ciudades en todo el país",
    fr: "Étendu à plus de 50 villes à l'échelle nationale",
    ru: "Расширились до более чем 50 городов по всей стране",
    zh: "扩展到全国50多个城市"
  },
  "communityMember": {
    en: "Community Member",
    es: "Miembro de la comunidad",
    fr: "Membre de la communauté",
    ru: "Член сообщества",
    zh: "社区成员"
  },
  "serviceProvider": {
    en: "Service Provider",
    es: "Proveedor de servicios",
    fr: "Prestataire de services",
    ru: "Поставщик услуг",
    zh: "服务提供商"
  },
  "estateAdministrator": {
    en: "Estate Administrator",
    es: "Administrador de fincas",
    fr: "Administrateur immobilier",
    ru: "Администратор недвижимости",
    zh: "物业管理员"
  },
  "whatDoYouNeed": {
    en: "What Do You Need?",
    es: "¿Qué necesitas?",
    fr: "De quoi avez-vous besoin?",
    ru: "Что вам нужно?",
    zh: "您需要什么？"
  },
  
  // Service Provider pages
  "serviceProviderPortal": {
    en: "Service Provider Portal",
    es: "Portal del proveedor de servicios",
    fr: "Portail du prestataire de services",
    ru: "Портал поставщика услуг",
    zh: "服务提供商门户"
  },
  "serviceProviderDesc": {
    en: "Manage your service offerings, respond to client requests, and grow your business",
    es: "Gestiona tus ofertas de servicios, responde a las solicitudes de los clientes y haz crecer tu negocio",
    fr: "Gérez vos offres de services, répondez aux demandes des clients et développez votre entreprise",
    ru: "Управляйте своими предложениями услуг, отвечайте на запросы клиентов и развивайте свой бизнес",
    zh: "管理您的服务产品，回应客户请求，并发展您的业务"
  },
  "dashboardTitle": {
    en: "Dashboard",
    es: "Panel de control",
    fr: "Tableau de bord",
    ru: "Панель управления",
    zh: "仪表板"
  },
  "dashboardDesc": {
    en: "Access your service provider dashboard",
    es: "Accede a tu panel de control de proveedor de servicios",
    fr: "Accédez à votre tableau de bord de prestataire de services",
    ru: "Получите доступ к панели управления поставщика услуг",
    zh: "访问您的服务提供商仪表板"
  },
  "dashboardText": {
    en: "View active bids, manage service requests, and track your business performance",
    es: "Ver ofertas activas, gestionar solicitudes de servicio y seguir el rendimiento de tu negocio",
    fr: "Consultez les offres actives, gérez les demandes de service et suivez les performances de votre entreprise",
    ru: "Просматривайте активные предложения, управляйте запросами на обслуживание и отслеживайте эффективность вашего бизнеса",
    zh: "查看活跃的投标，管理服务请求，并跟踪您的业务表现"
  },
  "openDashboard": {
    en: "Open Dashboard",
    es: "Abrir panel de control",
    fr: "Ouvrir le tableau de bord",
    ru: "Открыть панель управления",
    zh: "打开仪表板"
  },
  "serviceProfile": {
    en: "Service Profile",
    es: "Perfil de servicio",
    fr: "Profil de service",
    ru: "Профиль услуг",
    zh: "服务档案"
  },
  "manageOfferings": {
    en: "Manage your service offerings",
    es: "Gestiona tus ofertas de servicios",
    fr: "Gérez vos offres de services",
    ru: "Управляйте своими предложениями услуг",
    zh: "管理您的服务产品"
  },
  "serviceProfileText": {
    en: "Update your service categories, pricing, availability, and business information",
    es: "Actualiza tus categorías de servicio, precios, disponibilidad e información comercial",
    fr: "Mettez à jour vos catégories de services, vos tarifs, votre disponibilité et vos informations commerciales",
    ru: "Обновите свои категории услуг, цены, доступность и деловую информацию",
    zh: "更新您的服务类别、定价、可用性和业务信息"
  },
  "editProfile": {
    en: "Edit Profile",
    es: "Editar perfil",
    fr: "Modifier le profil",
    ru: "Редактировать профиль",
    zh: "编辑档案"
  },
  "popularCategories": {
    en: "Popular Service Categories",
    es: "Categorías de servicio populares",
    fr: "Catégories de services populaires",
    ru: "Популярные категории услуг",
    zh: "热门服务类别"
  },
  "plumbing": {
    en: "Plumbing",
    es: "Fontanería",
    fr: "Plomberie",
    ru: "Сантехника",
    zh: "水暖"
  },
  "electrical": {
    en: "Electrical",
    es: "Electricidad",
    fr: "Électricité",
    ru: "Электрика",
    zh: "电气"
  },
  "painting": {
    en: "Painting",
    es: "Pintura",
    fr: "Peinture",
    ru: "Покраска",
    zh: "绘画"
  },
  "flooring": {
    en: "Flooring",
    es: "Suelos",
    fr: "Revêtement de sol",
    ru: "Напольные покрытия",
    zh: "地板"
  },
  "hvac": {
    en: "HVAC",
    es: "Climatización",
    fr: "CVC",
    ru: "ОВКВ",
    zh: "暖通空调"
  },
  "generalRepairs": {
    en: "General Repairs",
    es: "Reparaciones generales",
    fr: "Réparations générales",
    ru: "Общий ремонт",
    zh: "一般维修"
  },
  
  // Service Provider Dashboard
  "serviceProviderDashboard": {
    en: "Service Provider Dashboard",
    es: "Panel de control del proveedor de servicios",
    fr: "Tableau de bord du prestataire de services",
    ru: "Панель управления поставщика услуг",
    zh: "服务提供商仪表板"
  },
  "handymanPro": {
    en: "Handyman Pro",
    es: "Manitas Pro",
    fr: "Bricoleur Pro",
    ru: "Мастер Про",
    zh: "修理工专业版"
  },
  "repairCategories": {
    en: "Repair Categories",
    es: "Categorías de reparación",
    fr: "Catégories de réparation",
    ru: "Категории ремонта",
    zh: "维修类别"
  },
  "manageBids": {
    en: "Manage your bids and view community service requests",
    es: "Gestiona tus ofertas y ve las solicitudes de servicio de la comunidad",
    fr: "Gérez vos offres et consultez les demandes de service de la communauté",
    ru: "Управляйте своими предложениями и просматривайте запросы на обслуживание сообщества",
    zh: "管理您的投标并查看社区服务请求"
  },
  "activeBids": {
    en: "Active Bids",
    es: "Ofertas activas",
    fr: "Offres actives",
    ru: "Активные предложения",
    zh: "活跃投标"
  },
  "bids": {
    en: "bids",
    es: "ofertas",
    fr: "offres",
    ru: "предложения",
    zh: "投标"
  },
  "editBid": {
    en: "Edit Bid",
    es: "Editar oferta",
    fr: "Modifier l'offre",
    ru: "Редактировать предложение",
    zh: "编辑投标"
  },
  "contactClient": {
    en: "Contact Client",
    es: "Contactar cliente",
    fr: "Contacter le client",
    ru: "Связаться с клиентом",
    zh: "联系客户"
  },
  "communityRequests": {
    en: "Community Service Requests",
    es: "Solicitudes de servicio de la comunidad",
    fr: "Demandes de service communautaire",
    ru: "Запросы на обслуживание сообщества",
    zh: "社区服务请求"
  },
  "requests": {
    en: "requests",
    es: "solicitudes",
    fr: "demandes",
    ru: "запросы",
    zh: "请求"
  },
  "viewDetails": {
    en: "View Details",
    es: "Ver detalles",
    fr: "Voir les détails",
    ru: "Посмотреть детали",
    zh: "查看详情"
  },
  "submitBid": {
    en: "Submit Bid",
    es: "Enviar oferta",
    fr: "Soumettre une offre",
    ru: "Отправить предложение",
    zh: "提交投标"
  },
  "noRequests": {
    en: "No community requests for this category yet.",
    es: "Aún no hay solicitudes de la comunidad para esta categoría.",
    fr: "Pas encore de demandes communautaires pour cette catégorie.",
    ru: "Пока нет запросов сообщества для этой категории.",
    zh: "此类别暂无社区请求。"
  },
  "browseAllRequests": {
    en: "Browse All Requests",
    es: "Explorar todas las solicitudes",
    fr: "Parcourir toutes les demandes",
    ru: "Просмотреть все запросы",
    zh: "浏览所有请求"
  },
  "roofing": {
    en: "Roofing",
    es: "Techado",
    fr: "Toiture",
    ru: "Кровля",
    zh: "屋顶"
  },
  "carpentry": {
    en: "Carpentry",
    es: "Carpintería",
    fr: "Menuiserie",
    ru: "Плотницкие работы",
    zh: "木工"
  },
  "locksmith": {
    en: "Locksmith",
    es: "Cerrajería",
    fr: "Serrurerie",
    ru: "Слесарные работы",
    zh: "锁匠"
  },
  "applianceRepair": {
    en: "Appliance Repair",
    es: "Reparación de electrodomésticos",
    fr: "Réparation d'appareils",
    ru: "Ремонт бытовой техники",
    zh: "家电维修"
  },
  "landscaping": {
    en: "Landscaping",
    es: "Paisajismo",
    fr: "Aménagement paysager",
    ru: "Ландшафтный дизайн",
    zh: "园林绿化"
  },
  "movingServices": {
    en: "Moving Services",
    es: "Servicios de mudanza",
    fr: "Services de déménagement",
    ru: "Услуги по переезду",
    zh: "搬家服务"
  },
  "homeNetworking": {
    en: "Home Networking",
    es: "Redes domésticas",
    fr: "Réseau domestique",
    ru: "Домашние сети",
    zh: "家庭网络"
  },
  
  // Frontpage translations
  "frontpage": {
    en: "Home Page",
    es: "Página de Inicio",
    fr: "Page d'Accueil",
    ru: "Главная Страница",
    zh: "主页"
  },
  "professionalServicesDescription": {
    en: "Find the best professionals for your home maintenance and repair needs",
    es: "Encuentra los mejores profesionales para el mantenimiento y reparación de tu hogar",
    fr: "Trouvez les meilleurs professionnels pour l'entretien et la réparation de votre maison",
    ru: "Найдите лучших профессионалов для обслуживания и ремонта вашего дома",
    zh: "为您的家庭维护和维修需求找到最好的专业人士"
  },
  "welcomeToHandyman": {
    en: "Welcome to Handyman",
    es: "Bienvenido a Manitas",
    fr: "Bienvenue chez Bricoleur",
    ru: "Добро пожаловать в Мастер",
    zh: "欢迎来到修理工"
  },
  "findTheBestProfessionals": {
    en: "Find the best professionals for your home",
    es: "Encuentra los mejores profesionales para tu hogar",
    fr: "Trouvez les meilleurs professionnels pour votre maison",
    ru: "Найдите лучших профессионалов для вашего дома",
    zh: "为您的家找到最好的专业人士"
  },
  "findServices": {
    en: "Find Services",
    es: "Buscar Servicios",
    fr: "Trouver des Services",
    ru: "Найти Услуги",
    zh: "查找服务"
  },
  "qualifiedProfessionals": {
    en: "Qualified Professionals",
    es: "Profesionales Cualificados",
    fr: "Professionnels Qualifiés",
    ru: "Квалифицированные Специалисты",
    zh: "合格的专业人士"
  },
  "qualifiedProfessionalsDescription": {
    en: "All our service providers are vetted and qualified to ensure high-quality work",
    es: "Todos nuestros proveedores de servicios son verificados y cualificados para garantizar un trabajo de alta calidad",
    fr: "Tous nos prestataires de services sont vérifiés et qualifiés pour garantir un travail de haute qualité",
    ru: "Все наши поставщики услуг проверены и квалифицированы, чтобы обеспечить высокое качество работы",
    zh: "我们所有的服务提供商都经过审核和认证，以确保高质量的工作"
  },
  "guaranteedService": {
    en: "Guaranteed Service",
    es: "Servicio Garantizado",
    fr: "Service Garanti",
    ru: "Гарантированное Обслуживание",
    zh: "服务保证"
  },
  "guaranteedServiceDescription": {
    en: "We stand behind every service with our satisfaction guarantee",
    es: "Respaldamos cada servicio con nuestra garantía de satisfacción",
    fr: "Nous soutenons chaque service avec notre garantie de satisfaction",
    ru: "Мы поддерживаем каждую услугу нашей гарантией удовлетворенности",
    zh: "我们用满意度保证支持每一项服务"
  },
  "easyBooking": {
    en: "Easy Booking",
    es: "Reserva Fácil",
    fr: "Réservation Facile",
    ru: "Простое Бронирование",
    zh: "轻松预订"
  },
  "easyBookingDescription": {
    en: "Book services with just a few clicks and get instant confirmations",
    es: "Reserva servicios con solo unos clics y obtén confirmaciones instantáneas",
    fr: "Réservez des services en quelques clics et obtenez des confirmations instantanées",
    ru: "Бронируйте услуги всего в несколько кликов и получайте мгновенные подтверждения",
    zh: "只需点击几下即可预订服务并获得即时确认"
  },
  // Bid and service request translations
  "bathroomPlumbingOverhaul": {
    en: "Bathroom Plumbing Overhaul",
    es: "Renovación de fontanería del baño",
    fr: "Révision complète de la plomberie de salle de bain",
    ru: "Капитальный ремонт сантехники в ванной",
    zh: "浴室水暖全面检修"
  },
  "kitchenSinkInstallation": {
    en: "Kitchen Sink Installation",
    es: "Instalación de fregadero de cocina",
    fr: "Installation d'évier de cuisine",
    ru: "Установка кухонной раковины",
    zh: "厨房水槽安装"
  },
  "toiletRepair": {
    en: "Toilet Repair",
    es: "Reparación de inodoro",
    fr: "Réparation de toilette",
    ru: "Ремонт унитаза",
    zh: "马桶修理"
  },
  "leakDetection": {
    en: "Leak Detection",
    es: "Detección de fugas",
    fr: "Détection de fuites",
    ru: "Обнаружение утечек",
    zh: "漏水检测"
  },
  "fullHousePlumbing": {
    en: "Full House Plumbing",
    es: "Fontanería completa de la casa",
    fr: "Plomberie complète de la maison",
    ru: "Полная сантехника дома",
    zh: "全屋水暖"
  },
  "elitePlumbingSolutions": {
    en: "Elite Plumbing Solutions",
    es: "Soluciones Elite de Fontanería",
    fr: "Solutions de Plomberie Elite",
    ru: "Элитные сантехнические решения",
    zh: "精英水暖解决方案"
  },
  "waterworksPro": {
    en: "Waterworks Pro",
    es: "Fontanería Profesional",
    fr: "Pro des Travaux Hydrauliques",
    ru: "Профессиональные водопроводные работы",
    zh: "专业水务工程"
  },
  "reliableHomeServices": {
    en: "Reliable Home Services",
    es: "Servicios Confiables para el Hogar",
    fr: "Services Domiciliaires Fiables",
    ru: "Надежные домашние услуги",
    zh: "可靠家居服务"
  },
  "precisionPlumbers": {
    en: "Precision Plumbers",
    es: "Fontaneros de Precisión",
    fr: "Plombiers de Précision",
    ru: "Точные сантехники",
    zh: "精准水暖工"
  },
  "masterPlumbingCo": {
    en: "Master Plumbing Co",
    es: "Compañía Maestra de Fontanería",
    fr: "Société Maître Plombier",
    ru: "Мастер-сантехника Ко",
    zh: "大师水暖公司"
  },
  "bathroomSinkInstallation": {
    en: "Bathroom Sink Installation",
    es: "Instalación de lavabo de baño",
    fr: "Installation de lavabo de salle de bain",
    ru: "Установка раковины в ванной",
    zh: "浴室水槽安装"
  },
  "electricalOutletInstallation": {
    en: "Electrical Outlet Installation",
    es: "Instalación de toma eléctrica",
    fr: "Installation de prise électrique",
    ru: "Установка электрической розетки",
    zh: "电源插座安装"
  },
  "livingRoomPainting": {
    en: "Living Room Painting",
    es: "Pintura de sala de estar",
    fr: "Peinture de salon",
    ru: "Покраска гостиной",
    zh: "客厅绘画"
  },
  "hardwoodFloorRepair": {
    en: "Hardwood Floor Repair",
    es: "Reparación de suelo de madera",
    fr: "Réparation de plancher en bois dur",
    ru: "Ремонт деревянного пола",
    zh: "硬木地板修复"
  },
  "roofLeakRepair": {
    en: "Roof Leak Repair",
    es: "Reparación de goteras en el techo",
    fr: "Réparation de fuite de toit",
    ru: "Ремонт протечки крыши",
    zh: "屋顶漏水修复"
  },
  "acMaintenance": {
    en: "AC Maintenance",
    es: "Mantenimiento de aire acondicionado",
    fr: "Entretien de climatisation",
    ru: "Обслуживание кондиционера",
    zh: "空调维护"
  },
  "customShelvingInstallation": {
    en: "Custom Shelving Installation",
    es: "Instalación de estanterías personalizadas",
    fr: "Installation d'étagères sur mesure",
    ru: "Установка индивидуальных полок",
    zh: "定制搁架安装"
  },
  "lockReplacement": {
    en: "Lock Replacement",
    es: "Reemplazo de cerradura",
    fr: "Remplacement de serrure",
    ru: "Замена замка",
    zh: "锁具更换"
  },
  
  // Estate Administrator Dashboard - Specific translations for administrador-fincas
  "map": {
    en: "Map",
    es: "Mapa",
    fr: "Carte",
    ru: "Карта",
    zh: "地图"
  },
  "assets": {
    en: "Assets",
    es: "Activos",
    fr: "Actifs",
    ru: "Активы",
    zh: "资产"
  },
  "currentServices": {
    en: "Current Services",
    es: "Servicios Actuales",
    fr: "Services Actuels",
    ru: "Текущие Услуги",
    zh: "当前服务"
  },
  "meetings": {
    en: "Meetings",
    es: "Juntas",
    fr: "Réunions",
    ru: "Собрания",
    zh: "会议"
  },
  "pendingIssues": {
    en: "Pending Issues",
    es: "Temas Pendientes",
    fr: "Questions en Suspens",
    ru: "Нерешенные Вопросы",
    zh: "待处理问题"
  },
  "communitiesMap": {
    en: "Communities Map",
    es: "Mapa de Comunidades",
    fr: "Carte des Communautés",
    ru: "Карта Сообществ",
    zh: "社区地图"
  },
  "communitiesOnMap": {
    en: "Communities on Map",
    es: "Comunidades en el mapa",
    fr: "Communautés sur la Carte",
    ru: "Сообщества на Карте",
    zh: "地图上的社区"
  },
  "coordinates": {
    en: "Coordinates",
    es: "Coordenadas",
    fr: "Coordonnées",
    ru: "Координаты",
    zh: "坐标"
  },
  "viewOnMap": {
    en: "View on Map",
    es: "Ver en mapa",
    fr: "Voir sur la Carte",
    ru: "Посмотреть на Карте",
    zh: "在地图上查看"
  },
  "managedCommunities": {
    en: "Managed Communities",
    es: "Comunidades Gestionadas",
    fr: "Communautés Gérées",
    ru: "Управляемые Сообщества",
    zh: "管理的社区"
  },
  "redirectingToServicesDashboard": {
    en: "Redirecting to service providers dashboard...",
    es: "Redirigiendo al dashboard de proveedores de servicios...",
    fr: "Redirection vers le tableau de bord des prestataires de services...",
    ru: "Перенаправление на панель управления поставщиков услуг...",
    zh: "重定向到服务提供商仪表板..."
  },
  "goToServicesDashboard": {
    en: "Go to Services Dashboard",
    es: "Ir al Dashboard de Servicios",
    fr: "Aller au Tableau de Bord des Services",
    ru: "Перейти к Панели Управления Услугами",
    zh: "转到服务仪表板"
  },
  "communityMeetings": {
    en: "Community Meetings",
    es: "Juntas de Comunidades",
    fr: "Réunions Communautaires",
    ru: "Собрания Сообщества",
    zh: "社区会议"
  },
  "scheduledMeetings": {
    en: "Scheduled meetings",
    es: "Juntas programadas",
    fr: "Réunions programmées",
    ru: "Запланированные встречи",
    zh: "计划会议"
  },
  "noMeetingsScheduled": {
    en: "No meetings scheduled for this month.",
    es: "No hay juntas programadas para este mes.",
    fr: "Aucune réunion programmée pour ce mois.",
    ru: "На этот месяц не запланировано встреч.",
    zh: "本月没有安排会议。"
  },
  "community": {
    en: "Community",
    es: "Comunidad",
    fr: "Communauté",
    ru: "Сообщество",
    zh: "社区"
  },
  "type": {
    en: "Type",
    es: "Tipo",
    fr: "Type",
    ru: "Тип",
    zh: "类型"
  },
  "description": {
    en: "Description",
    es: "Descripción",
    fr: "Description",
    ru: "Описание",
    zh: "描述"
  },
  "amountStatus": {
    en: "Amount/Status",
    es: "Importe/Estado",
    fr: "Montant/Statut",
    ru: "Сумма/Статус",
    zh: "金额/状态"
  },
  "date": {
    en: "Date",
    es: "Fecha",
    fr: "Date",
    ru: "Дата",
    zh: "日期"
  },
  "action": {
    en: "Action",
    es: "Acción",
    fr: "Action",
    ru: "Действие",
    zh: "操作"
  },
  "manage": {
    en: "Manage",
    es: "Gestionar",
    fr: "Gérer",
    ru: "Управлять",
    zh: "管理"
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "es", "fr", "ru", "zh"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}