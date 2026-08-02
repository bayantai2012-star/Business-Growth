import React, { useState, useEffect } from "react";

// --- TYPES & INTERFACES ---
type BusinessType =
  | "Кофейня"
  | "Магазин"
  | "Салон красоты"
  | "Сервисная точка"
  | "Другое";

interface User {
  id: string;
  ownerName: string;
  companyName: string;
  businessType: BusinessType;
  email: string;
  phone: string;
  password: string;
  isAdmin?: boolean;
  createdAt: string;
}

interface Client {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  lastVisit: string;
  purchasesCount: number;
  totalSpent: number;
  status: "Новый" | "Постоянный" | "VIP";
}

interface Transaction {
  id: string;
  companyId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  active: boolean;
  lastUsedDate?: string;
  lastUsedTime?: string;
  lastUsedAction?: string;
}

interface Campaign {
  id: string;
  companyId: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  expectedRevenue: number;
  status: "Активна" | "Завершена";
  expectedGrowth: string;
  expectedProfit: string;
}

interface NotificationItem {
  id: string;
  companyId: string;
  text: string;
  date: string;
  read: boolean;
}

// --- MOCK INITIAL DATA ---
const INITIAL_USERS: User[] = [
  {
    id: "admin-1",
    ownerName: "Администратор Системы",
    companyName: "Business Growth HQ",
    businessType: "Другое",
    email: "admin@growth.kz",
    phone: "+7 (777) 000-00-00",
    password: "AdminPassword1!",
    isAdmin: true,
    createdAt: "2026-01-01",
  },
  {
    id: "user-1",
    ownerName: "Айбек Садыков",
    companyName: "Кофейня «Тартар»",
    businessType: "Кофейня",
    email: "aibek@coffee.kz",
    phone: "+7 (701) 123-45-67",
    password: "Password123!",
    isAdmin: false,
    createdAt: "2026-05-10",
  },
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: "c-1",
    companyId: "user-1",
    name: "Динара Омарова",
    phone: "+77015554433",
    lastVisit: "2026-07-28",
    purchasesCount: 12,
    totalSpent: 35400,
    status: "VIP",
  },
  {
    id: "c-2",
    companyId: "user-1",
    name: "Тимур Касымов",
    phone: "+77029998877",
    lastVisit: "2026-08-01",
    purchasesCount: 3,
    totalSpent: 6500,
    status: "Постоянный",
  },
  {
    id: "c-3",
    companyId: "user-1",
    name: "Асель Жандосова",
    phone: "+77051112233",
    lastVisit: "2026-08-02",
    purchasesCount: 1,
    totalSpent: 1800,
    status: "Новый",
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "t-1",
    companyId: "user-1",
    type: "income",
    amount: 45000,
    category: "Продажи кофе",
    date: "2026-08-01",
    description: "Дневная выручка точки №1",
  },
  {
    id: "t-2",
    companyId: "user-1",
    type: "expense",
    amount: 15000,
    category: "Закупка зерен",
    date: "2026-07-30",
    description: "Поставка арабики",
  },
  {
    id: "t-3",
    companyId: "user-1",
    type: "income",
    amount: 38000,
    category: "Продажи выпечки",
    date: "2026-07-31",
    description: "Выручка за субботу",
  },
];

const INITIAL_TOOLS: Tool[] = [
  {
    id: "crm",
    name: "CRM База",
    category: "Клиенты",
    description: "Хранение базы клиентов и история покупок",
    active: true,
    lastUsedDate: "02.08.2026",
    lastUsedTime: "14:35",
    lastUsedAction: "Добавлен новый клиент",
  },
  {
    id: "loyalty",
    name: "Лояльность",
    category: "Маркетинг",
    description: "Бонусные карты и персональные скидки",
    active: true,
    lastUsedDate: "01.08.2026",
    lastUsedTime: "11:20",
    lastUsedAction: "Изменена акция",
  },
  {
    id: "finance",
    name: "Финансы",
    category: "Учет",
    description: "Контроль доходов, расходов и чистой прибыли",
    active: true,
    lastUsedDate: "01.08.2026",
    lastUsedTime: "18:00",
    lastUsedAction: "Добавлена финансовая запись",
  },
  {
    id: "ai",
    name: "AI-Аналитика",
    category: "Аналитика",
    description: "Умные подсказки и анализ бизнес-метрик",
    active: true,
    lastUsedDate: "02.08.2026",
    lastUsedTime: "10:15",
    lastUsedAction: "Запрошен анализ продаж",
  },
  {
    id: "whatsapp",
    name: "WhatsApp рассылки",
    category: "Маркетинг",
    description: "Автоматические рассылки и напоминания",
    active: false,
  },
  {
    id: "campaigns",
    name: "Маркетинговые кампании",
    category: "Маркетинг",
    description: "Управление рекламными активностями и бюджетом",
    active: true,
    lastUsedDate: "02.08.2026",
    lastUsedTime: "12:00",
    lastUsedAction: "Создана новая кампания",
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    companyId: "user-1",
    name: "Летнее предложение кофе",
    startDate: "2026-08-01",
    endDate: "2026-08-15",
    budget: 25000,
    expectedRevenue: 150000,
    status: "Активна",
    expectedGrowth: "+22%",
    expectedProfit: "+125 000 ₸",
  },
  {
    id: "camp-2",
    companyId: "user-1",
    name: "Счастливые часы по утрам",
    startDate: "2026-07-01",
    endDate: "2026-07-20",
    budget: 15000,
    expectedRevenue: 80000,
    status: "Завершена",
    expectedGrowth: "+15%",
    expectedProfit: "+65 000 ₸",
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    companyId: "user-1",
    text: "Добро пожаловать в Business Growth! Настройте свой профиль.",
    date: "2026-08-01",
    read: false,
  },
  {
    id: "n-2",
    companyId: "user-1",
    text: "Добавьте нового клиента для роста базы.",
    date: "2026-08-02",
    read: false,
  },
];

export default function App() {
  // Global App States
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<
    "landing" | "dashboard" | "admin"
  >("landing");

  // Sub-navigation inside Dashboard
  const [dashboardTab, setDashboardTab] = useState<
    | "home"
    | "tools"
    | "clients"
    | "finances"
    | "campaigns"
    | "ai"
    | "notifications"
    | "profile"
  >("home");

  // Auth Modal/Form State inside Landing
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Registration Form State
  const [regOwnerName, setRegOwnerName] = useState("");
  const [regCompanyName, setRegCompanyName] = useState("");
  const [regBusinessType, setRegBusinessType] =
    useState<BusinessType>("Кофейня");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regError, setRegError] = useState("");

  // Password validation checks
  const hasMinLength = regPassword.length >= 8;
  const hasUpper = /[A-ZА-ЯЁ]/.test(regPassword);
  const hasLower = /[a-zа-яё]/.test(regPassword);
  const hasNumber = /[0-9]/.test(regPassword);
  const hasSpecial = /[^A-Za-z0-9А-Яа-яЁё]/.test(regPassword);

  const addNotification = (companyId: string, text: string) => {
    const newNotif: NotificationItem = {
      id: "n-" + Date.now() + Math.random(),
      companyId,
      text,
      date: new Date().toISOString().split("T")[0],
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateToolUsage = (toolId: string, actionText: string) => {
    const now = new Date();
    // Format date in Russian e.g. "2 августа" or keep standard dd.mm.yyyy / readable
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]}`;
    const timeStr =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    setTools((prev) =>
      prev.map((t) => {
        if (t.id === toolId) {
          return {
            ...t,
            active: true,
            lastUsedDate: dateStr,
            lastUsedTime: timeStr,
            lastUsedAction: actionText,
          };
        }
        return t;
      })
    );
  };

  // Handlers for Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === loginEmail.toLowerCase() &&
        u.password === loginPassword
    );
    if (!found) {
      setLoginError("Неверный email или пароль");
      return;
    }
    setCurrentUser(found);
    if (found.isAdmin) {
      setCurrentView("admin");
    } else {
      setCurrentView("dashboard");
      setDashboardTab("home");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      setRegError("Пароль не соответствует требованиям безопасности");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("Пароли не совпадают!");
      return;
    }
    if (
      !regOwnerName ||
      !regCompanyName ||
      !regEmail ||
      !regPhone ||
      !regPassword
    ) {
      setRegError("Заполните все обязательные поля");
      return;
    }
    const exists = users.some(
      (u) => u.email.toLowerCase() === regEmail.toLowerCase()
    );
    if (exists) {
      setRegError("Пользователь с таким email уже существует");
      return;
    }

    const newUser: User = {
      id: "user-" + Date.now(),
      ownerName: regOwnerName,
      companyName: regCompanyName,
      businessType: regBusinessType,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      isAdmin: false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    addNotification(
      newUser.id,
      "Добро пожаловать в Business Growth! Регистрация прошла успешно."
    );
    setCurrentView("dashboard");
    setDashboardTab("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("landing");
    setLoginEmail("");
    setLoginPassword("");
  };

  // --- RENDER LANDING PAGE ---
  if (currentView === "landing") {
    return (
      <div style={styles.landingContainer}>
        {/* Header / Nav */}
        <header style={styles.landingHeader}>
          <div style={styles.brandLogo}>
            <span style={styles.logoBadge}>BG</span> Business Growth
          </div>
          <div>
            <button
              style={styles.outlineButton}
              onClick={() => {
                const el = document.getElementById("auth-section");
                el?.scrollIntoView({ behavior: "smooth" });
                setAuthMode("login");
              }}
            >
              Войти
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Business Growth</h1>
          <p style={styles.heroSubtitle}>
            Полезные инструменты для малого бизнеса. Превращаем сложные
            бизнес-задачи в понятный пошаговый план.
          </p>
          <div
            style={{ display: "flex", gap: "16px", justifyContent: "center" }}
          >
            <button
              style={styles.primaryButton}
              onClick={() => {
                const el = document.getElementById("auth-section");
                el?.scrollIntoView({ behavior: "smooth" });
                setAuthMode("register");
              }}
            >
              Начать работу
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                const el = document.getElementById("auth-section");
                el?.scrollIntoView({ behavior: "smooth" });
                setAuthMode("login");
              }}
            >
              Войти в кабинет
            </button>
          </div>
        </section>

        {/* Features Cards */}
        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Преимущества платформы</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.cardIcon}>❤️</div>
              <h3 style={styles.cardTitle}>Повышение лояльности клиентов</h3>
              <p style={styles.cardText}>
                Создавайте персональные предложения и возвращайте клиентов.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.cardIcon}>📈</div>
              <h3 style={styles.cardTitle}>Рост продаж</h3>
              <p style={styles.cardText}>
                Анализируйте конверсию и увеличивайте средний чек.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.cardIcon}>🤖</div>
              <h3 style={styles.cardTitle}>AI-рекомендации</h3>
              <p style={styles.cardText}>
                Получайте точные подсказки для развития бизнеса на основе ваших
                данных.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>Управление клиентами</h3>
              <p style={styles.cardText}>
                Храните всю информацию о клиентах и историю покупок в одном
                месте.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.cardIcon}>💰</div>
              <h3 style={styles.cardTitle}>Контроль финансов</h3>
              <p style={styles.cardText}>
                Контролируйте доходы, расходы и чистую прибыль компании.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.cardIcon}>⚡</div>
              <h3 style={styles.cardTitle}>Простая автоматизация</h3>
              <p style={styles.cardText}>
                Интеграции с WhatsApp и автоматические маркетинговые кампании.
              </p>
            </div>
          </div>
        </section>

        {/* Auth Section on Landing */}
        <section id="auth-section" style={styles.authSection}>
          <div style={styles.authCard}>
            <div style={styles.authTabs}>
              <button
                style={{
                  ...styles.authTabBtn,
                  ...(authMode === "login" ? styles.authTabActive : {}),
                }}
                onClick={() => setAuthMode("login")}
              >
                Войти
              </button>
              <button
                style={{
                  ...styles.authTabBtn,
                  ...(authMode === "register" ? styles.authTabActive : {}),
                }}
                onClick={() => setAuthMode("register")}
              >
                Регистрация
              </button>
            </div>

            {authMode === "login" ? (
              <form onSubmit={handleLogin} style={styles.formContainer}>
                <h3 style={styles.formTitle}>Вход в систему</h3>
                {loginError && (
                  <div style={styles.errorAlert}>{loginError}</div>
                )}

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    required
                    style={styles.input}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@mail.kz"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Пароль</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      style={{ ...styles.input, paddingRight: "70px" }}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      style={styles.showPassBtn}
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? "Скрыть" : "Показать"}
                    </button>
                  </div>
                </div>

                <button type="submit" style={styles.primaryButtonFull}>
                  Войти
                </button>
                <div style={styles.hintBox}>
                  Тестовый аккаунт: <b>aibek@coffee.kz</b> / <b>Password123!</b>
                  <br />
                  Админ: <b>admin@growth.kz</b> / <b>AdminPassword1!</b>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={styles.formContainer}>
                <h3 style={styles.formTitle}>Создать аккаунт компании</h3>
                {regError && <div style={styles.errorAlert}>{regError}</div>}

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Имя владельца</label>
                  <input
                    type="text"
                    required
                    style={styles.input}
                    value={regOwnerName}
                    onChange={(e) => setRegOwnerName(e.target.value)}
                    placeholder="Иван Иванов"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Название компании</label>
                  <input
                    type="text"
                    required
                    style={styles.input}
                    value={regCompanyName}
                    onChange={(e) => setRegCompanyName(e.target.value)}
                    placeholder="Кофейня «Уют»"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Тип бизнеса</label>
                  <select
                    style={styles.input}
                    value={regBusinessType}
                    onChange={(e) =>
                      setRegBusinessType(e.target.value as BusinessType)
                    }
                  >
                    <option value="Кофейня">Кофейня</option>
                    <option value="Магазин">Магазин</option>
                    <option value="Салон красоты">Салон красоты</option>
                    <option value="Сервисная точка">Сервисная точка</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    required
                    style={styles.input}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="mail@business.kz"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Телефон</label>
                  <input
                    type="text"
                    required
                    style={styles.input}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+7 (700) 000-00-00"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Пароль</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      style={{ ...styles.input, paddingRight: "70px" }}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      style={styles.showPassBtn}
                      onClick={() => setShowRegPassword(!showRegPassword)}
                    >
                      {showRegPassword ? "Скрыть" : "Показать"}
                    </button>
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <span
                      style={{ color: hasMinLength ? "#10B981" : "#6B7280" }}
                    >
                      {hasMinLength ? "✓" : "✗"} Минимум 8 символов
                    </span>
                    <span style={{ color: hasUpper ? "#10B981" : "#6B7280" }}>
                      {hasUpper ? "✓" : "✗"} Минимум одна заглавная буква
                    </span>
                    <span style={{ color: hasLower ? "#10B981" : "#6B7280" }}>
                      {hasLower ? "✓" : "✗"} Минимум одна строчная буква
                    </span>
                    <span style={{ color: hasNumber ? "#10B981" : "#6B7280" }}>
                      {hasNumber ? "✓" : "✗"} Минимум одна цифра
                    </span>
                    <span style={{ color: hasSpecial ? "#10B981" : "#6B7280" }}>
                      {hasSpecial ? "✓" : "○"} Желательно спецсимвол
                    </span>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Повторите пароль</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      required
                      style={{ ...styles.input, paddingRight: "70px" }}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      style={styles.showPassBtn}
                      onClick={() =>
                        setShowRegConfirmPassword(!showRegConfirmPassword)
                      }
                    >
                      {showRegConfirmPassword ? "Скрыть" : "Показать"}
                    </button>
                  </div>
                  {regConfirmPassword && (
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        color:
                          regPassword === regConfirmPassword
                            ? "#10B981"
                            : "#EF4444",
                      }}
                    >
                      {regPassword === regConfirmPassword
                        ? "✓ Пароли совпадают"
                        : "✗ Пароли не совпадают"}
                    </div>
                  )}
                </div>

                <button type="submit" style={styles.primaryButtonFull}>
                  Зарегистрироваться
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.landingFooter}>
          <p>
            © 2026 Business Growth. Цифровая платформа для бизнеса Казахстана.
          </p>
        </footer>
      </div>
    );
  }

  // --- RENDER ADMIN PANEL (SECTION 3 IMPROVEMENT) ---
  if (currentView === "admin" && currentUser?.isAdmin) {
    const totalCompanies = users.filter((u) => !u.isAdmin).length;
    const totalClientsCount = clients.length;
    const activeCompaniesCount = users.filter(
      (u) => !u.isAdmin && clients.some((c) => c.companyId === u.id)
    ).length;
    const averageClientsPerCompany =
      totalCompanies > 0
        ? (totalClientsCount / totalCompanies).toFixed(1)
        : "0";
    const totalActivatedToolsCount = tools.filter((t) => t.active).length;

    // Determine most and least popular tools based on active state or mock metrics
    const mostPopularTool =
      tools.find((t) => t.id === "crm")?.name || "CRM База";
    const leastPopularTool =
      tools.find((t) => !t.active)?.name || "WhatsApp рассылки";

    return (
      <div style={styles.dashboardLayout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarBrand}>
            <span style={styles.logoBadge}>BG</span> Admin Panel
          </div>
          <div style={styles.sidebarMenu}>
            <button
              style={{ ...styles.sidebarItem, ...styles.sidebarItemActive }}
            >
              📊 Обзор платформы
            </button>
          </div>
          <div style={{ marginTop: "auto", padding: "16px" }}>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </aside>

        <main style={styles.mainContent}>
          <header style={styles.topHeader}>
            <h2 style={{ margin: 0, fontSize: "20px" }}>
              Панель администратора системы
            </h2>
            <div style={styles.userInfoBadge}>
              <span>{currentUser.ownerName}</span>
            </div>
          </header>

          <div style={styles.contentBody}>
            {/* ENRICHED ADMIN ANALYTICS GRID */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Зарегистрированных компаний</div>
                <div style={styles.statValue}>{totalCompanies}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Общее количество клиентов</div>
                <div style={styles.statValue}>{totalClientsCount}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Активных компаний</div>
                <div style={styles.statValue}>{activeCompaniesCount}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>
                  Среднее число клиентов / компан.
                </div>
                <div style={styles.statValue}>{averageClientsPerCompany}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Самый популярный инструмент</div>
                <div
                  style={{
                    ...styles.statValue,
                    fontSize: "18px",
                    color: "#2563EB",
                  }}
                >
                  {mostPopularTool}
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Редкий инструмент</div>
                <div
                  style={{
                    ...styles.statValue,
                    fontSize: "18px",
                    color: "#6B7280",
                  }}
                >
                  {leastPopularTool}
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Активировано инструментов</div>
                <div style={styles.statValue}>
                  {totalActivatedToolsCount} / {tools.length}
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Системный статус</div>
                <div
                  style={{
                    ...styles.statValue,
                    color: "#10B981",
                    fontSize: "18px",
                  }}
                >
                  🟢 Работает стабильно
                </div>
              </div>
            </div>

            <div style={styles.cardBlock}>
              <h3 style={styles.blockTitle}>
                Зарегистрированные компании (локальная база)
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Компания</th>
                      <th style={styles.th}>Владелец</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Тип бизнеса</th>
                      <th style={styles.th}>Дата регистрации</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => !u.isAdmin)
                      .map((u) => (
                        <tr key={u.id}>
                          <td style={styles.td}>
                            <b>{u.companyName}</b>
                          </td>
                          <td style={styles.td}>{u.ownerName}</td>
                          <td style={styles.td}>{u.email}</td>
                          <td style={styles.td}>
                            <span style={styles.badge}>{u.businessType}</span>
                          </td>
                          <td style={styles.td}>{u.createdAt}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  const companyClients = clients.filter((c) => c.companyId === currentUser?.id);
  const companyTransactions = transactions.filter(
    (t) => t.companyId === currentUser?.id
  );
  const companyCampaigns = campaigns.filter(
    (c) => c.companyId === currentUser?.id
  );
  const companyNotifications = notifications.filter(
    (n) => n.companyId === currentUser?.id
  );

  const totalIncome = companyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = companyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalIncome - totalExpense;

  return (
    <div style={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarBrand}>
          <span style={styles.logoBadge}>BG</span> {currentUser?.companyName}
        </div>
        <div style={styles.sidebarMenu}>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "home" ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setDashboardTab("home")}
          >
            🏠 Главная
          </button>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "tools" ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setDashboardTab("tools")}
          >
            🛠️ Инструменты
          </button>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "clients" ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setDashboardTab("clients")}
          >
            👥 Клиенты
          </button>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "finances" ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setDashboardTab("finances")}
          >
            💰 Финансы
          </button>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "campaigns" ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setDashboardTab("campaigns")}
          >
            🚀 Кампании
          </button>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "ai" ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setDashboardTab("ai")}
          >
            🤖 AI-Аналитика
          </button>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "notifications"
                ? styles.sidebarItemActive
                : {}),
            }}
            onClick={() => setDashboardTab("notifications")}
          >
            🔔 Уведомления{" "}
            {companyNotifications.filter((n) => !n.read).length > 0 && (
              <span style={styles.notifBadgeCount}>
                {companyNotifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>
          <button
            style={{
              ...styles.sidebarItem,
              ...(dashboardTab === "profile" ? styles.sidebarItemActive : {}),
            }}
            onClick={() => setDashboardTab("profile")}
          >
            ⚙️ Профиль
          </button>
        </div>
        <div style={{ marginTop: "auto", padding: "16px" }}>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            {dashboardTab === "home" && "Главная панель"}
            {dashboardTab === "tools" && "Каталог инструментов"}
            {dashboardTab === "clients" && "Клиентская база"}
            {dashboardTab === "finances" && "Финансовый учет"}
            {dashboardTab === "campaigns" && "Маркетинговые кампании"}
            {dashboardTab === "ai" && "AI-Аналитика и рекомендации"}
            {dashboardTab === "notifications" && "Системные уведомления"}
            {dashboardTab === "profile" && "Настройки профиля"}
          </h2>
          <div style={styles.userInfoBadge}>
            <span>{currentUser?.ownerName}</span>
          </div>
        </header>

        <div style={styles.contentBody}>
          {/* TAB: HOME - DASHBOARD IMPROVEMENT (SECTION 1) */}
          {dashboardTab === "home" &&
            (() => {
              // Calculations strictly based on user data
              const hasData =
                companyTransactions.length > 0 || companyClients.length > 0;

              // Average ticket
              const totalPurchasesSum = companyClients.reduce(
                (acc, c) => acc + c.totalSpent,
                0
              );
              const totalPurchasesCount = companyClients.reduce(
                (acc, c) => acc + c.purchasesCount,
                0
              );
              const averageTicket =
                totalPurchasesCount > 0
                  ? Math.round(totalPurchasesSum / totalPurchasesCount)
                  : 0;

              // Repeat customers percentage (purchasesCount > 1)
              const repeatClientsCount = companyClients.filter(
                (c) => c.purchasesCount > 1
              ).length;
              const repeatClientsPercent =
                companyClients.length > 0
                  ? Math.round(
                      (repeatClientsCount / companyClients.length) * 100
                    )
                  : 0;

              // Conversion (VIP or Permanent vs Total)
              const loyalClients = companyClients.filter(
                (c) => c.status === "VIP" || c.status === "Постоянный"
              ).length;
              const conversionRate =
                companyClients.length > 0
                  ? Math.round((loyalClients / companyClients.length) * 100)
                  : 0;

              // Active campaigns count
              const activeCampaignsCount = companyCampaigns.filter(
                (c) => c.status === "Активна"
              ).length;

              // Margin calculation if income & expense exist
              const margin =
                totalIncome > 0
                  ? Math.round((netProfit / totalIncome) * 100)
                  : 0;

              // Daily profit grouping from real transactions
              const profitByDate: { [key: string]: number } = {};
              companyTransactions.forEach((t) => {
                if (!profitByDate[t.date]) profitByDate[t.date] = 0;
                profitByDate[t.date] +=
                  t.type === "income" ? t.amount : -t.amount;
              });
              const profitDatesSorted = Object.keys(profitByDate).sort();

              // New clients grouping by date (or mock distribution based on client list)
              const clientsByDate: { [key: string]: number } = {};
              companyClients.forEach((c) => {
                const d = c.lastVisit || "2026-08-01";
                if (!clientsByDate[d]) clientsByDate[d] = 0;
                clientsByDate[d] += 1;
              });
              const clientDatesSorted = Object.keys(clientsByDate).sort();

              return (
                <div>
                  {!hasData ? (
                    <div
                      style={{
                        ...styles.cardBlock,
                        textAlign: "center",
                        padding: "40px",
                      }}
                    >
                      <h3 style={{ color: "#4B5563" }}>
                        Недостаточно данных для анализа
                      </h3>
                      <p style={{ color: "#6B7280", fontSize: "14px" }}>
                        Добавьте первых клиентов и финансовые операции, чтобы
                        увидеть полную аналитику и графики.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Top Analytics Summary Grid */}
                      <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                          <div style={styles.statLabel}>Чистая прибыль</div>
                          <div
                            style={{
                              ...styles.statValue,
                              color: netProfit >= 0 ? "#10B981" : "#EF4444",
                            }}
                          >
                            {netProfit.toLocaleString()} ₸
                          </div>
                        </div>
                        <div style={styles.statCard}>
                          <div style={styles.statLabel}>Средний чек</div>
                          <div style={styles.statValue}>
                            {averageTicket
                              ? `${averageTicket.toLocaleString()} ₸`
                              : "Нет данных"}
                          </div>
                        </div>
                        <div style={styles.statCard}>
                          <div style={styles.statLabel}>Повторные клиенты</div>
                          <div style={styles.statValue}>
                            {companyClients.length > 0
                              ? `${repeatClientsPercent}%`
                              : "Нет данных"}
                          </div>
                        </div>
                        <div style={styles.statCard}>
                          <div style={styles.statLabel}>Конверсия клиентов</div>
                          <div style={styles.statValue}>
                            {companyClients.length > 0
                              ? `${conversionRate}%`
                              : "Нет данных"}
                          </div>
                        </div>
                        <div style={styles.statCard}>
                          <div style={styles.statLabel}>Активные кампании</div>
                          <div style={styles.statValue}>
                            {activeCampaignsCount}
                          </div>
                        </div>
                        <div style={styles.statCard}>
                          <div style={styles.statLabel}>Маржинальность</div>
                          <div
                            style={{ ...styles.statValue, color: "#2563EB" }}
                          >
                            {totalIncome > 0 ? `${margin}%` : "Нет данных"}
                          </div>
                        </div>
                      </div>

                      {/* Charts & Detailed Analytics Blocks */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "24px",
                          marginBottom: "24px",
                        }}
                      >
                        {/* Profit by Day Chart */}
                        <div style={styles.cardBlock}>
                          <h3 style={styles.blockTitle}>
                            График прибыли по дням
                          </h3>
                          {profitDatesSorted.length === 0 ? (
                            <p style={{ color: "#6B7280", fontSize: "14px" }}>
                              Недостаточно данных для анализа
                            </p>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                marginTop: "16px",
                              }}
                            >
                              {profitDatesSorted.map((date) => {
                                const val = profitByDate[date];
                                const maxVal = Math.max(
                                  ...Object.values(profitByDate),
                                  1
                                );
                                const widthPct = Math.max(
                                  Math.min((Math.abs(val) / maxVal) * 100, 100),
                                  10
                                );
                                return (
                                  <div
                                    key={date}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#6B7280",
                                        width: "80px",
                                      }}
                                    >
                                      {date}
                                    </span>
                                    <div
                                      style={{
                                        flex: 1,
                                        background: "#F3F4F6",
                                        borderRadius: "4px",
                                        height: "16px",
                                        overflow: "hidden",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: `${widthPct}%`,
                                          background:
                                            val >= 0 ? "#10B981" : "#EF4444",
                                          height: "100%",
                                          borderRadius: "4px",
                                        }}
                                      ></div>
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        color: val >= 0 ? "#10B981" : "#EF4444",
                                        width: "90px",
                                        textAlign: "right",
                                      }}
                                    >
                                      {val > 0 ? "+" : ""}
                                      {val.toLocaleString()} ₸
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* New Clients Chart */}
                        <div style={styles.cardBlock}>
                          <h3 style={styles.blockTitle}>
                            График новых клиентов
                          </h3>
                          {clientDatesSorted.length === 0 ? (
                            <p style={{ color: "#6B7280", fontSize: "14px" }}>
                              Недостаточно данных для анализа
                            </p>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                marginTop: "16px",
                              }}
                            >
                              {clientDatesSorted.map((date) => {
                                const count = clientsByDate[date];
                                return (
                                  <div
                                    key={date}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      padding: "10px 14px",
                                      background: "#F9FAFB",
                                      borderRadius: "8px",
                                      border: "1px solid #E5E7EB",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        color: "#374151",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {date}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#2563EB",
                                      }}
                                    >
                                      +{count} клиентов
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Summary & Last Campaign Effectiveness */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "24px",
                        }}
                      >
                        <div style={styles.cardBlock}>
                          <h3 style={styles.blockTitle}>
                            Эффективность последней кампании
                          </h3>
                          {companyCampaigns.length > 0 ? (
                            <div
                              style={{
                                background: "#F0FDF4",
                                padding: "16px",
                                borderRadius: "12px",
                                border: "1px solid #BBF7D0",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "bold",
                                  color: "#166534",
                                  marginBottom: "8px",
                                }}
                              >
                                {companyCampaigns[0].name}
                              </div>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: "8px",
                                  fontSize: "13px",
                                  color: "#374151",
                                }}
                              >
                                <div>
                                  Ожидаемый рост:{" "}
                                  <b>{companyCampaigns[0].expectedGrowth}</b>
                                </div>
                                <div>
                                  Ожид. прибыль:{" "}
                                  <b>{companyCampaigns[0].expectedProfit}</b>
                                </div>
                                <div>
                                  Бюджет:{" "}
                                  <b>
                                    {companyCampaigns[0].budget.toLocaleString()}{" "}
                                    ₸
                                  </b>
                                </div>
                                <div>
                                  Статус:{" "}
                                  <span
                                    style={{
                                      color: "#10B981",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {companyCampaigns[0].status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p style={{ color: "#6B7280", fontSize: "14px" }}>
                              Недостаточно данных для анализа
                            </p>
                          )}
                        </div>

                        <div style={styles.cardBlock}>
                          <h3 style={styles.blockTitle}>
                            Активность бизнеса за последние 7 дней
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                              }}
                            >
                              <span style={{ color: "#6B7280" }}>
                                Всего операций учета:
                              </span>
                              <span style={{ fontWeight: "bold" }}>
                                {companyTransactions.length}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                              }}
                            >
                              <span style={{ color: "#6B7280" }}>
                                Добавленных клиентов:
                              </span>
                              <span style={{ fontWeight: "bold" }}>
                                {companyClients.length}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                              }}
                            >
                              <span style={{ color: "#6B7280" }}>
                                Активных кампаний:
                              </span>
                              <span style={{ fontWeight: "bold" }}>
                                {activeCampaignsCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

          {/* TAB: TOOLS - TOOLS CATALOG IMPROVEMENT (SECTION 2) */}
          {dashboardTab === "tools" && (
            <div>
              <p style={{ color: "#6B7280", marginBottom: "24px" }}>
                Подключайте и отслеживайте модули автоматизации вашего бизнеса.
              </p>
              <div style={styles.toolsGrid}>
                {tools.map((tool) => {
                  const hasUsed = Boolean(
                    tool.lastUsedDate &&
                      tool.lastUsedDate !== "Еще не использовался"
                  );
                  return (
                    <div key={tool.id} style={styles.toolCard}>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <h3 style={styles.cardTitle}>{tool.name}</h3>
                          <span
                            style={{
                              fontSize: "11px",
                              background: "#F3F4F6",
                              color: "#4B5563",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {tool.category}
                          </span>
                        </div>
                        <p style={styles.cardText}>{tool.description}</p>
                      </div>

                      <div
                        style={{
                          marginTop: "16px",
                          padding: "12px",
                          background: "#F9FAFB",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#4B5563",
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "600",
                            marginBottom: "4px",
                            color: "#111827",
                          }}
                        >
                          Последнее использование:
                        </div>
                        {hasUsed ? (
                          <div>
                            <div style={{ fontWeight: "500" }}>
                              {tool.lastUsedDate}{" "}
                              {tool.lastUsedTime ? tool.lastUsedTime : ""}
                            </div>
                            <div style={{ color: "#2563EB", marginTop: "2px" }}>
                              {tool.lastUsedAction}
                            </div>
                          </div>
                        ) : (
                          <div style={{ color: "#9CA3AF" }}>
                            Еще не использовался
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "16px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            background: tool.active ? "#DEF7EC" : "#F3F4F6",
                            color: tool.active ? "#03543F" : "#374151",
                            fontWeight: "bold",
                          }}
                        >
                          {tool.active ? "Активирован" : "Не активирован"}
                        </span>
                        <button
                          style={
                            tool.active
                              ? styles.dangerButtonSmall
                              : styles.primaryButtonSmall
                          }
                          onClick={() => {
                            const newActiveState = !tool.active;
                            setTools(
                              tools.map((t) => {
                                if (t.id === tool.id) {
                                  return {
                                    ...t,
                                    active: newActiveState,
                                    lastUsedDate: newActiveState
                                      ? "2 августа"
                                      : t.lastUsedDate,
                                    lastUsedTime: newActiveState
                                      ? "14:40"
                                      : t.lastUsedTime,
                                    lastUsedAction: newActiveState
                                      ? "Инструмент активирован"
                                      : t.lastUsedAction,
                                  };
                                }
                                return t;
                              })
                            );
                            addNotification(
                              currentUser!.id,
                              `Статус инструмента «${tool.name}» изменен.`
                            );
                          }}
                        >
                          {tool.active ? "Отключить" : "Активировать"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: CLIENTS */}
          {dashboardTab === "clients" && (
            <ClientsView
              clients={companyClients}
              onAddClient={(newC) => {
                setClients([
                  ...clients,
                  {
                    ...newC,
                    id: "c-" + Date.now(),
                    companyId: currentUser!.id,
                  },
                ]);
                addNotification(
                  currentUser!.id,
                  `Добавлен новый клиент: ${newC.name}`
                );
                updateToolUsage("crm", "Добавлен новый клиент");
              }}
              onUpdateClient={(upd) => {
                setClients(clients.map((c) => (c.id === upd.id ? upd : c)));
                addNotification(
                  currentUser!.id,
                  `Обновлены данные клиента: ${upd.name}`
                );
                updateToolUsage("crm", "Изменен клиент");
              }}
              onDeleteClient={(id) => {
                const target = clients.find((c) => c.id === id);
                setClients(clients.filter((c) => c.id !== id));
                addNotification(
                  currentUser!.id,
                  `Удален клиент: ${target?.name || ""}`
                );
                updateToolUsage("crm", "Удален клиент");
              }}
              companyName={currentUser!.companyName}
            />
          )}

          {/* TAB: FINANCES */}
          {dashboardTab === "finances" && (
            <FinancesView
              transactions={companyTransactions}
              onAddTransaction={(tx) => {
                setTransactions([
                  ...transactions,
                  { ...tx, id: "t-" + Date.now(), companyId: currentUser!.id },
                ]);
                addNotification(
                  currentUser!.id,
                  `Добавлена финансовая запись: ${tx.category} (${tx.amount} ₸)`
                );
                updateToolUsage("finance", "Добавлена финансовая запись");
              }}
              onUpdateTransaction={(upd) => {
                setTransactions(
                  transactions.map((t) => (t.id === upd.id ? upd : t))
                );
                addNotification(
                  currentUser!.id,
                  `Обновлена финансовая операция`
                );
                updateToolUsage("finance", "Изменена финансовая операция");
              }}
              onDeleteTransaction={(id) => {
                setTransactions(transactions.filter((t) => t.id !== id));
                addNotification(currentUser!.id, `Удалена финансовая операция`);
                updateToolUsage("finance", "Удалена финансовая запись");
              }}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netProfit={netProfit}
            />
          )}

          {/* TAB: CAMPAIGNS */}
          {dashboardTab === "campaigns" && (
            <CampaignsView
              campaigns={companyCampaigns}
              onAddCampaign={(camp) => {
                setCampaigns([
                  ...campaigns,
                  {
                    ...camp,
                    id: "camp-" + Date.now(),
                    companyId: currentUser!.id,
                  },
                ]);
                addNotification(
                  currentUser!.id,
                  `Создана новая кампания: ${camp.name}`
                );
                updateToolUsage("campaigns", "Создана кампания");
              }}
              onUpdateCampaign={(upd) => {
                setCampaigns(campaigns.map((c) => (c.id === upd.id ? upd : c)));
                addNotification(
                  currentUser!.id,
                  `Обновлена кампания: ${upd.name}`
                );
                updateToolUsage("campaigns", "Изменена кампания");
              }}
              onDeleteCampaign={(id) => {
                setCampaigns(campaigns.filter((c) => c.id !== id));
                addNotification(
                  currentUser!.id,
                  `Удалена маркетинговая кампания`
                );
                updateToolUsage("campaigns", "Удалена кампания");
              }}
            />
          )}

          {/* TAB: AI ANALYTICS */}
          {dashboardTab === "ai" && (
            <AIAnalyticsView
              clients={companyClients}
              transactions={companyTransactions}
              campaigns={companyCampaigns}
              tools={tools}
              onAskAI={() => updateToolUsage("ai", "Запрошен анализ данных")}
            />
          )}

          {/* TAB: NOTIFICATIONS */}
          {dashboardTab === "notifications" && (
            <div style={styles.cardBlock}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h3 style={{ margin: 0 }}>Ваши уведомления</h3>
                <button
                  style={styles.outlineButton}
                  onClick={() => {
                    setNotifications(
                      notifications.map((n) =>
                        n.companyId === currentUser?.id
                          ? { ...n, read: true }
                          : n
                      )
                    );
                  }}
                >
                  Прочитать все
                </button>
              </div>
              {companyNotifications.length === 0 ? (
                <p style={{ color: "#6B7280" }}>Нет новых уведомлений.</p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {companyNotifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: n.read ? "#F9FAFB" : "#EFF6FF",
                        border: "1px solid " + (n.read ? "#E5E7EB" : "#BFDBFE"),
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: n.read ? "normal" : "bold",
                          }}
                        >
                          {n.text}
                        </p>
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>
                          {n.date}
                        </span>
                      </div>
                      {!n.read && (
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#3B82F6",
                          }}
                        ></span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE */}
          {dashboardTab === "profile" && (
            <ProfileView
              user={currentUser!}
              onUpdateUser={(updUser) => {
                setUsers(users.map((u) => (u.id === updUser.id ? updUser : u)));
                setCurrentUser(updUser);
                addNotification(updUser.id, "Данные профиля были обновлены.");
              }}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS FOR DASHBOARD ---

function ClientsView({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  companyName,
}: {
  clients: Client[];
  onAddClient: (c: Omit<Client, "id" | "companyId">) => void;
  onUpdateClient: (c: Client) => void;
  onDeleteClient: (id: string) => void;
  companyName: string;
}) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lastVisit, setLastVisit] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [purchasesCount, setPurchasesCount] = useState(1);
  const [totalSpent, setTotalSpent] = useState(0);
  const [status, setStatus] = useState<"Новый" | "Постоянный" | "VIP">("Новый");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const openAdd = () => {
    setEditingClient(null);
    setName("");
    setPhone("");
    setLastVisit(new Date().toISOString().split("T")[0]);
    setPurchasesCount(1);
    setTotalSpent(0);
    setStatus("Новый");
    setModalOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setPhone(c.phone);
    setLastVisit(c.lastVisit);
    setPurchasesCount(c.purchasesCount);
    setTotalSpent(c.totalSpent);
    setStatus(c.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      onUpdateClient({
        ...editingClient,
        name,
        phone,
        lastVisit,
        purchasesCount,
        totalSpent,
        status,
      });
    } else {
      onAddClient({
        name,
        phone,
        lastVisit,
        purchasesCount,
        totalSpent,
        status,
      });
    }
    setModalOpen(false);
  };

  const handleWhatsApp = (clientName: string, clientPhone: string) => {
    const text = encodeURIComponent(
      `Здравствуйте, ${clientName}!\nВас приветствует компания ${companyName}.\nСпасибо, что выбираете нас!\nМы подготовили для вас специальное предложение.`
    );
    window.open(
      `https://wa.me/${clientPhone.replace(/\D/g, "")}?text=${text}`,
      "_blank"
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Поиск по имени или телефону..."
          style={{ ...styles.input, maxWidth: "300px", margin: 0 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button style={styles.primaryButton} onClick={openAdd}>
          + Добавить клиента
        </button>
      </div>

      <div style={styles.cardBlock}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Имя</th>
                <th style={styles.th}>Телефон</th>
                <th style={styles.th}>Последний визит</th>
                <th style={styles.th}>Покупки</th>
                <th style={styles.th}>Потрачено</th>
                <th style={styles.th}>Статус</th>
                <th style={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "#6B7280",
                    }}
                  >
                    Клиенты не найдены
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}>
                      <b>{c.name}</b>
                    </td>
                    <td style={styles.td}>{c.phone}</td>
                    <td style={styles.td}>{c.lastVisit}</td>
                    <td style={styles.td}>{c.purchasesCount}</td>
                    <td style={styles.td}>{c.totalSpent.toLocaleString()} ₸</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            c.status === "VIP"
                              ? "#FEE2E2"
                              : c.status === "Постоянный"
                              ? "#DEF7EC"
                              : "#E0F2FE",
                          color:
                            c.status === "VIP"
                              ? "#991B1B"
                              : c.status === "Постоянный"
                              ? "#03543F"
                              : "#0369A1",
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={styles.waButtonSmall}
                          onClick={() => handleWhatsApp(c.name, c.phone)}
                        >
                          WhatsApp
                        </button>
                        <button
                          style={styles.outlineButtonSmall}
                          onClick={() => openEdit(c)}
                        >
                          Изм.
                        </button>
                        <button
                          style={styles.dangerButtonSmall}
                          onClick={() => onDeleteClient(c.id)}
                        >
                          Удал.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.blockTitle}>
              {editingClient ? "Редактировать клиента" : "Новый клиент"}
            </h3>
            <form onSubmit={handleSave}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Имя</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Телефон</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Дата визита</label>
                <input
                  type="date"
                  required
                  style={styles.input}
                  value={lastVisit}
                  onChange={(e) => setLastVisit(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Количество покупок</label>
                <input
                  type="number"
                  min="0"
                  required
                  style={styles.input}
                  value={purchasesCount}
                  onChange={(e) => setPurchasesCount(Number(e.target.value))}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Сумма покупок (₸)</label>
                <input
                  type="number"
                  min="0"
                  required
                  style={styles.input}
                  value={totalSpent}
                  onChange={(e) => setTotalSpent(Number(e.target.value))}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Статус</label>
                <select
                  style={styles.input}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="Новый">Новый</option>
                  <option value="Постоянный">Постоянный</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" style={styles.primaryButtonFull}>
                  Сохранить
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setModalOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FinancesView({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  totalIncome,
  totalExpense,
  netProfit,
}: {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, "id" | "companyId">) => void;
  onUpdateTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");

  const openAdd = () => {
    setEditingTx(null);
    setType("income");
    setAmount(0);
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setModalOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditingTx(t);
    setType(t.type);
    setAmount(t.amount);
    setCategory(t.category);
    setDate(t.date);
    setDescription(t.description);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTx) {
      onUpdateTransaction({
        ...editingTx,
        type,
        amount,
        category,
        date,
        description,
      });
    } else {
      onAddTransaction({ type, amount, category, date, description });
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Общий доход</div>
          <div style={{ ...styles.statValue, color: "#10B981" }}>
            {totalIncome.toLocaleString()} ₸
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Общие расходы</div>
          <div style={{ ...styles.statValue, color: "#EF4444" }}>
            {totalExpense.toLocaleString()} ₸
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Чистая прибыль</div>
          <div
            style={{
              ...styles.statValue,
              color: netProfit >= 0 ? "#10B981" : "#EF4444",
            }}
          >
            {netProfit.toLocaleString()} ₸
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <button style={styles.primaryButton} onClick={openAdd}>
          + Добавить операцию
        </button>
      </div>

      <div style={styles.cardBlock}>
        <h3 style={styles.blockTitle}>История операций за месяц</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Дата</th>
                <th style={styles.th}>Тип</th>
                <th style={styles.th}>Категория</th>
                <th style={styles.th}>Описание</th>
                <th style={styles.th}>Сумма</th>
                <th style={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "#6B7280",
                    }}
                  >
                    Операций пока нет
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={styles.td}>{t.date}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            t.type === "income" ? "#DEF7EC" : "#FEE2E2",
                          color: t.type === "income" ? "#03543F" : "#991B1B",
                        }}
                      >
                        {t.type === "income" ? "Доход" : "Расход"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <b>{t.category}</b>
                    </td>
                    <td style={styles.td}>{t.description}</td>
                    <td
                      style={{
                        ...styles.td,
                        color: t.type === "income" ? "#10B981" : "#EF4444",
                        fontWeight: "bold",
                      }}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {t.amount.toLocaleString()} ₸
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={styles.outlineButtonSmall}
                          onClick={() => openEdit(t)}
                        >
                          Изм.
                        </button>
                        <button
                          style={styles.dangerButtonSmall}
                          onClick={() => onDeleteTransaction(t.id)}
                        >
                          Удал.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.blockTitle}>
              {editingTx ? "Редактировать операцию" : "Новая операция"}
            </h3>
            <form onSubmit={handleSave}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Тип операции</label>
                <select
                  style={styles.input}
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="income">Доход</option>
                  <option value="expense">Расход</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Сумма (₸)</label>
                <input
                  type="number"
                  min="0"
                  required
                  style={styles.input}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Категория</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Например: Продажи, Закупка"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Дата</label>
                <input
                  type="date"
                  required
                  style={styles.input}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Описание</label>
                <input
                  type="text"
                  style={styles.input}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Детали транзакции"
                />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" style={styles.primaryButtonFull}>
                  Сохранить
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setModalOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignsView({
  campaigns,
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
}: {
  campaigns: Campaign[];
  onAddCampaign: (c: Omit<Campaign, "id" | "companyId">) => void;
  onUpdateCampaign: (c: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Campaign | null>(null);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [budget, setBudget] = useState(10000);
  const [expectedRevenue, setExpectedRevenue] = useState(50000);
  const [status, setStatus] = useState<"Активна" | "Завершена">("Активна");
  const [expectedGrowth, setExpectedGrowth] = useState("+18%");
  const [expectedProfit, setExpectedProfit] = useState("+40 000 ₸");

  const openAdd = () => {
    setEditingCamp(null);
    setName("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
    setBudget(10000);
    setExpectedRevenue(50000);
    setStatus("Активна");
    setExpectedGrowth("+18%");
    setExpectedProfit("+40 000 ₸");
    setModalOpen(true);
  };

  const openEdit = (c: Campaign) => {
    setEditingCamp(c);
    setName(c.name);
    setStartDate(c.startDate);
    setEndDate(c.endDate);
    setBudget(c.budget);
    setExpectedRevenue(c.expectedRevenue);
    setStatus(c.status);
    setExpectedGrowth(c.expectedGrowth);
    setExpectedProfit(c.expectedProfit);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCamp) {
      onUpdateCampaign({
        ...editingCamp,
        name,
        startDate,
        endDate,
        budget,
        expectedRevenue,
        status,
        expectedGrowth,
        expectedProfit,
      });
    } else {
      onAddCampaign({
        name,
        startDate,
        endDate,
        budget,
        expectedRevenue,
        status,
        expectedGrowth,
        expectedProfit,
      });
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <button style={styles.primaryButton} onClick={openAdd}>
          + Создать кампанию
        </button>
      </div>

      <div style={styles.cardBlock}>
        <h3 style={styles.blockTitle}>Маркетинговые кампании</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Название</th>
                <th style={styles.th}>Период</th>
                <th style={styles.th}>Бюджет</th>
                <th style={styles.th}>Ожидаемая выручка</th>
                <th style={styles.th}>Эффективность</th>
                <th style={styles.th}>Статус</th>
                <th style={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "#6B7280",
                    }}
                  >
                    Кампаний пока нет
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}>
                      <b>{c.name}</b>
                    </td>
                    <td style={styles.td}>
                      {c.startDate} — {c.endDate}
                    </td>
                    <td style={styles.td}>{c.budget.toLocaleString()} ₸</td>
                    <td style={styles.td}>
                      {c.expectedRevenue.toLocaleString()} ₸
                    </td>
                    <td style={styles.td}>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#10B981",
                          fontWeight: "bold",
                        }}
                      >
                        Рост: {c.expectedGrowth}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        Прибыль: {c.expectedProfit}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            c.status === "Активна" ? "#DEF7EC" : "#F3F4F6",
                          color: c.status === "Активна" ? "#03543F" : "#374151",
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={styles.outlineButtonSmall}
                          onClick={() => openEdit(c)}
                        >
                          Изм.
                        </button>
                        <button
                          style={styles.dangerButtonSmall}
                          onClick={() => onDeleteCampaign(c.id)}
                        >
                          Удал.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.blockTitle}>
              {editingCamp ? "Редактировать кампанию" : "Новая кампания"}
            </h3>
            <form onSubmit={handleSave}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Название кампании</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Дата начала</label>
                <input
                  type="date"
                  required
                  style={styles.input}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Дата окончания</label>
                <input
                  type="date"
                  required
                  style={styles.input}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Бюджет (₸)</label>
                <input
                  type="number"
                  min="0"
                  required
                  style={styles.input}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Предполагаемая выручка (₸)</label>
                <input
                  type="number"
                  min="0"
                  required
                  style={styles.input}
                  value={expectedRevenue}
                  onChange={(e) => setExpectedRevenue(Number(e.target.value))}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Статус</label>
                <select
                  style={styles.input}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="Активна">Активна</option>
                  <option value="Завершена">Завершена</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" style={styles.primaryButtonFull}>
                  Сохранить
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setModalOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AIAnalyticsView({
  clients,
  transactions,
  campaigns,
  tools,
  onAskAI,
}: {
  clients: Client[];
  transactions: Transaction[];
  campaigns: Campaign[];
  tools: Tool[];
  onAskAI: () => void;
}) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const questionsList = [
    "Почему продажи упали?",
    "Как вернуть клиентов?",
    "Что лучше запустить сейчас?",
    "Какие инструменты используются реже всего?",
    "Какие акции самые эффективные?",
    "Какие клиенты самые активные?",
    "Что стоит улучшить?",
    "Что приносит больше прибыли?",
    "Какие расходы слишком большие?",
    "Какие клиенты давно не возвращались?",
    "Что сделать для увеличения повторных покупок?",
  ];

  const handleSelectQuestion = (q: string) => {
    setSelectedQuestion(q);
    onAskAI();

    if (clients.length === 0 && transactions.length === 0) {
      setAiAnswer(
        "Недостаточно данных в системе. Добавьте клиентов и финансовые операции для формирования точного ответа."
      );
      return;
    }

    if (q === "Почему продажи упали?") {
      setAiAnswer(
        `Анализ доходов: текущий общий доход составляет ${totalIncome.toLocaleString()} ₸ при расходах ${totalExpense.toLocaleString()} ₸. Продажи стабильны, но за последние дни зафиксировано уменьшение активности новых клиентов. Рекомендуется активировать инструмент рассылок.`
      );
    } else if (
      q === "Как вернуть клиентов?" ||
      q === "Какие клиенты давно не возвращались?"
    ) {
      const inactive = clients.filter(
        (c) => c.status === "Новый" || c.purchasesCount <= 2
      );
      setAiAnswer(
        `В вашей базе ${clients.length} клиентов. Из них ${inactive.length} имеют статус новых или совершили мало покупок. Предложите им персонализированную скидку через WhatsApp.`
      );
    } else if (
      q === "Что лучше запустить сейчас?" ||
      q === "Какие акции самые эффективные?"
    ) {
      setAiAnswer(
        `У вас активно кампаний: ${
          campaigns.filter((c) => c.status === "Активна").length
        }. На основе текущих данных по клиентам (${
          clients.length
        } чел.), запуск акции на повторные визиты принесет наибольшую отдачу.`
      );
    } else if (q === "Какие инструменты используются реже всего?") {
      const inactiveTools = tools.filter((t) => !t.active);
      setAiAnswer(
        `Неактивных инструментов: ${inactiveTools.length}. ${
          inactiveTools.map((t) => t.name).join(", ") ||
          "Все основные инструменты подключены и используются"
        }.`
      );
    } else if (q === "Какие клиенты самые активные?") {
      const vipList = clients.filter(
        (c) => c.status === "VIP" || c.purchasesCount > 5
      );
      setAiAnswer(
        `VIP и наиболее активные клиенты: ${
          vipList
            .map(
              (v) =>
                `${v.name} (${v.purchasesCount} покупок, ${v.totalSpent} ₸)`
            )
            .join("; ") || "Пока нет данных о VIP клиентах"
        }.`
      );
    } else if (
      q === "Что приносит больше прибыли?" ||
      q === "Что стоит улучшить?"
    ) {
      setAiAnswer(
        `Чистая прибыль составляет ${netProfit.toLocaleString()} ₸. Основную долю доходов приносят основные категории продаж. Рекомендуется увеличить средний чек за счет кросс-продаж.`
      );
    } else if (q === "Какие расходы слишком большие?") {
      setAiAnswer(
        `Общие расходы составляют ${totalExpense.toLocaleString()} ₸. Структура затрат находится в пределах нормы для вашего типа бизнеса, но требует точечного контроля закупок.`
      );
    } else if (q === "Что сделать для увеличения повторных покупок?") {
      setAiAnswer(
        `Для роста повторных покупок (сейчас их доля высока у VIP клиентов) рекомендуется внедрить бонусную программу лояльности и автоматические напоминания через WhatsApp.`
      );
    } else {
      setAiAnswer(
        `На основе анализа ваших данных (Клиенты: ${
          clients.length
        }, Доходы: ${totalIncome.toLocaleString()} ₸, Расходы: ${totalExpense.toLocaleString()} ₸): бизнес функционирует стабильно. Рекомендуем продолжать текущую стратегию.`
      );
    }
  };

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
    >
      <div style={styles.cardBlock}>
        <h3 style={styles.blockTitle}>Готовые вопросы к AI-Аналитику</h3>
        <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>
          Выберите вопрос для автоматического анализа вашей бизнес-статистики:
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "420px",
            overflowY: "auto",
            paddingRight: "6px",
          }}
        >
          {questionsList.map((q, idx) => (
            <button
              key={idx}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                background: selectedQuestion === q ? "#EFF6FF" : "#F9FAFB",
                border:
                  "1px solid " +
                  (selectedQuestion === q ? "#3B82F6" : "#E5E7EB"),
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                color: "#1F2937",
              }}
              onClick={() => handleSelectQuestion(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          ...styles.cardBlock,
          display: "flex",
          flexDirection: "column",
          height: "520px",
        }}
      >
        <h3 style={styles.blockTitle}>Ответ AI-Аналитика</h3>
        {selectedQuestion ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                background: "#F3F4F6",
                padding: "12px 16px",
                borderRadius: "12px",
                alignSelf: "flex-end",
                maxWidth: "85%",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {selectedQuestion}
            </div>
            <div
              style={{
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                padding: "16px",
                borderRadius: "12px",
                alignSelf: "flex-start",
                width: "100%",
                boxSizing: "border-box",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#1E3A8A",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                🤖 Аналитический отчет по вашим данным:
              </div>
              {aiAnswer}
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#6B7280",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Выберите один из вопросов слева, чтобы сформировать точный
            аналитический ответ на основе вашей базы данных.
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileView({
  user,
  onUpdateUser,
  onLogout,
}: {
  user: User;
  onUpdateUser: (u: User) => void;
  onLogout: () => void;
}) {
  const [ownerName, setOwnerName] = useState(user.ownerName);
  const [companyName, setCompanyName] = useState(user.companyName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [businessType, setBusinessType] = useState<BusinessType>(
    user.businessType
  );
  const [password, setPassword] = useState(user.password);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      ownerName,
      companyName,
      email,
      phone,
      businessType,
      password,
    });
    setSuccessMsg("Профиль успешно обновлен!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={styles.cardBlock}>
        <h3 style={styles.blockTitle}>Настройки профиля компании</h3>
        {successMsg && (
          <div
            style={{
              background: "#DEF7EC",
              color: "#03543F",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {successMsg}
          </div>
        )}
        <form onSubmit={handleSave}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Название компании</label>
            <input
              type="text"
              required
              style={styles.input}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Имя владельца</label>
            <input
              type="text"
              required
              style={styles.input}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Тип бизнеса</label>
            <select
              style={styles.input}
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
            >
              <option value="Кофейня">Кофейня</option>
              <option value="Магазин">Магазин</option>
              <option value="Салон красоты">Салон красоты</option>
              <option value="Сервисная точка">Сервисная точка</option>
              <option value="Другое">Другое</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Телефон</label>
            <input
              type="text"
              required
              style={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="text"
              required
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <button type="submit" style={styles.primaryButton}>
              Сохранить изменения
            </button>
            <button
              type="button"
              style={styles.dangerButtonSmall}
              onClick={onLogout}
            >
              Выйти из системы
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- PROFESSIONAL STYLES (Inline CSS) ---
const styles: { [key: string]: React.CSSProperties } = {
  landingContainer: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: "#F9FAFB",
    color: "#1F2937",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  landingHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 48px",
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E7EB",
  },
  brandLogo: {
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#111827",
  },
  logoBadge: {
    background: "#2563EB",
    color: "#FFFFFF",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  heroSection: {
    textAlign: "center",
    padding: "80px 20px",
    background: "linear-gradient(135deg, #EFF6FF 0%, #F3F4F6 100%)",
    borderBottom: "1px solid #E5E7EB",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    margin: "0 0 16px 0",
    color: "#1E3A8A",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#4B5563",
    maxWidth: "600px",
    margin: "0 auto 32px auto",
    lineHeight: "1.5",
  },
  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
    transition: "background 0.2s",
  },
  secondaryButton: {
    background: "#FFFFFF",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  outlineButton: {
    background: "transparent",
    color: "#2563EB",
    border: "1px solid #2563EB",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  featuresSection: {
    padding: "64px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "40px",
    color: "#1F2937",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    background: "#FFFFFF",
    padding: "28px",
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
  },
  cardIcon: {
    fontSize: "32px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    color: "#111827",
  },
  cardText: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
    lineHeight: "1.5",
  },
  authSection: {
    padding: "60px 20px",
    background: "#F3F4F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  authCard: {
    background: "#FFFFFF",
    width: "100%",
    maxWidth: "480px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E5E7EB",
    overflow: "hidden",
  },
  authTabs: {
    display: "flex",
    borderBottom: "1px solid #E5E7EB",
  },
  authTabBtn: {
    flex: 1,
    padding: "16px",
    background: "#F9FAFB",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#6B7280",
  },
  authTabActive: {
    background: "#FFFFFF",
    color: "#2563EB",
    borderBottom: "2px solid #2563EB",
  },
  formContainer: {
    padding: "24px",
  },
  formTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 20px 0",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  showPassBtn: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#2563EB",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
  },
  primaryButtonFull: {
    width: "100%",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  errorAlert: {
    background: "#FEE2E2",
    color: "#991B1B",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  hintBox: {
    marginTop: "16px",
    fontSize: "12px",
    color: "#6B7280",
    background: "#F9FAFB",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
  },
  landingFooter: {
    textAlign: "center",
    padding: "24px",
    background: "#FFFFFF",
    borderTop: "1px solid #E5E7EB",
    fontSize: "14px",
    color: "#6B7280",
    marginTop: "auto",
  },
  // Dashboard Styles
  dashboardLayout: {
    display: "flex",
    height: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: "#F9FAFB",
    color: "#1F2937",
    overflow: "hidden",
  },
  sidebar: {
    width: "260px",
    background: "#FFFFFF",
    borderRight: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
  },
  sidebarBrand: {
    padding: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#111827",
  },
  sidebarMenu: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    overflowY: "auto",
  },
  sidebarItem: {
    textAlign: "left",
    background: "transparent",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#4B5563",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarItemActive: {
    background: "#EFF6FF",
    color: "#2563EB",
    fontWeight: "600",
  },
  notifBadgeCount: {
    background: "#EF4444",
    color: "#FFFFFF",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  logoutButton: {
    width: "100%",
    background: "#FEE2E2",
    color: "#991B1B",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topHeader: {
    padding: "20px 32px",
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfoBadge: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    background: "#F3F4F6",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  contentBody: {
    padding: "32px",
    overflowY: "auto",
    flex: 1,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#FFFFFF",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6B7280",
    marginBottom: "8px",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  cardBlock: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    marginBottom: "24px",
  },
  blockTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 16px 0",
    color: "#111827",
  },
  toolsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  toolCard: {
    background: "#FFFFFF",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  th: {
    padding: "12px",
    borderBottom: "1px solid #E5E7EB",
    color: "#6B7280",
    fontWeight: "600",
    background: "#F9FAFB",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #E5E7EB",
    color: "#1F2937",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  primaryButtonSmall: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  outlineButtonSmall: {
    background: "transparent",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  dangerButtonSmall: {
    background: "#FEE2E2",
    color: "#991B1B",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  waButtonSmall: {
    background: "#25D366",
    color: "#FFFFFF",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
};
