// SINGLE SOURCE OF TRUTH - All data comes from here
// NO UI FILE is allowed to define its own data lists

export interface TransactionModel {
  id: string;
  title: string;
  date: Date;
  amount: number;
  isExpense: boolean;
  category: string;
}

export interface SavingsModel {
  id: string;
  title: string;
  current: number;
  target: number;
  isCompleted: boolean;
  icon: string;
}

export interface OpportunityModel {
  id: string;
  title: string;
  vendor: string;
  type: 'Discount' | 'Scholarship';
  value?: number;
  isOnline: boolean;
  category: string;
  description: string;
  expiryDate?: Date;
  link: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface BlogModel {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  isFeatured: boolean;
  author: string;
  publishedDate: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinedDate: Date;
  streak: number;
  level: string;
  totalSaved: number;
  goalsCompleted: number;
  transactionsLogged: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: Date;
}

export const MockDatabase = {
  user: {
    name: 'Alex Johnson',
    email: 'alex.johnson@student.edu',
    avatar: 'AJ',
    joinedDate: new Date('2024-06-15'),
    streak: 14,
    level: 'Smart Saver',
    totalSaved: 2200,
    goalsCompleted: 3,
    transactionsLogged: 47,
    badges: [
      { id: '1', name: 'First Steps', icon: '🎯', description: 'Created your first savings goal', earned: true, earnedDate: new Date('2024-06-20') },
      { id: '2', name: 'Streak Master', icon: '🔥', description: 'Logged transactions for 7 days straight', earned: true, earnedDate: new Date('2024-07-05') },
      { id: '3', name: 'Budget Pro', icon: '📊', description: 'Stayed under budget for a full month', earned: true, earnedDate: new Date('2024-08-01') },
      { id: '4', name: 'Goal Crusher', icon: '🏆', description: 'Completed 3 savings goals', earned: true, earnedDate: new Date('2024-09-15') },
      { id: '5', name: 'Wise Investor', icon: '💎', description: 'Save $5000 total', earned: false },
      { id: '6', name: 'Scholarship Hunter', icon: '🎓', description: 'Apply for 5 scholarships', earned: false },
    ],
  } as UserProfile,

  transactions: [
    {
      id: '1',
      title: 'Monthly Allowance',
      date: new Date('2025-01-01'),
      amount: 3000.0,
      isExpense: false,
      category: 'Income',
    },
    {
      id: '2',
      title: 'Textbooks',
      date: new Date('2025-01-03'),
      amount: 150.0,
      isExpense: true,
      category: 'Education',
    },
    {
      id: '3',
      title: 'Coffee Shop',
      date: new Date('2025-01-04'),
      amount: 12.5,
      isExpense: true,
      category: 'Food & Drinks',
    },
    {
      id: '4',
      title: 'Freelance Gig',
      date: new Date('2025-01-05'),
      amount: 200.0,
      isExpense: false,
      category: 'Income',
    },
    {
      id: '5',
      title: 'Gym Membership',
      date: new Date('2025-01-06'),
      amount: 45.0,
      isExpense: true,
      category: 'Health',
    },
    {
      id: '6',
      title: 'Netflix Subscription',
      date: new Date('2025-01-07'),
      amount: 15.99,
      isExpense: true,
      category: 'Entertainment',
    },
  ] as TransactionModel[],

  savings: [
    {
      id: '1',
      title: 'New Laptop',
      current: 850,
      target: 2000,
      isCompleted: false,
      icon: '💻',
    },
    {
      id: '2',
      title: 'Summer Trip',
      current: 350,
      target: 1500,
      isCompleted: false,
      icon: '✈️',
    },
    {
      id: '3',
      title: 'Emergency Fund',
      current: 1000,
      target: 1000,
      isCompleted: true,
      icon: '🛡️',
    },
  ] as SavingsModel[],

  opportunities: [
    {
      id: '1',
      title: '50% Off Textbooks',
      vendor: 'BookWorld',
      type: 'Discount',
      value: 50,
      isOnline: true,
      category: 'Education',
      description: 'Get 50% off on all textbooks and study materials. Valid for students with a .edu email.',
      expiryDate: new Date('2025-03-31'),
      link: 'https://bookworld.com/student-discount',
    },
    {
      id: '2',
      title: 'STEM Future Scholarship',
      vendor: 'TechFoundation',
      type: 'Scholarship',
      value: 5000,
      isOnline: false,
      category: 'Education',
      description: 'Annual scholarship for students pursuing STEM degrees. Application includes essay and recommendations.',
      expiryDate: new Date('2025-04-15'),
      link: 'https://techfoundation.org/stem-scholarship',
    },
    {
      id: '3',
      title: '30% Off Gym Membership',
      vendor: 'FitLife',
      type: 'Discount',
      value: 30,
      isOnline: true,
      category: 'Health',
      description: 'Special student rate on monthly gym memberships. Includes access to all classes.',
      expiryDate: new Date('2025-02-28'),
      link: 'https://fitlife.com/students',
    },
    {
      id: '4',
      title: 'Arts Excellence Grant',
      vendor: 'Creative Foundation',
      type: 'Scholarship',
      value: 2500,
      isOnline: false,
      category: 'Arts',
      description: 'For students demonstrating exceptional talent in visual or performing arts.',
      expiryDate: new Date('2025-05-01'),
      link: 'https://creativefoundation.org/grant',
    },
    {
      id: '5',
      title: '20% Off Tech Gadgets',
      vendor: 'TechZone',
      type: 'Discount',
      value: 20,
      isOnline: true,
      category: 'Tech',
      description: 'Student discount on laptops, tablets, and accessories. Verify with student ID.',
      link: 'https://techzone.com/education',
    },
    {
      id: '6',
      title: 'Student Food Discount',
      vendor: 'CampusBites',
      type: 'Discount',
      value: 15,
      isOnline: false,
      category: 'Food',
      description: '15% off all orders at participating campus restaurants. Show student ID.',
      link: 'https://campusbites.com',
    },
  ] as OpportunityModel[],

  chatHistory: [
    {
      id: '1',
      text: "Hello! I'm your personal financial advisor. I can help you with budgeting, saving strategies, and finding the best opportunities for students. What would you like to know today?",
      isUser: false,
      timestamp: new Date('2025-01-01T10:00:00'),
    },
  ] as ChatMessage[],

  blogs: [
    {
      id: '1',
      title: 'How to Build a Student Budget That Actually Works',
      category: 'Budgeting',
      excerpt: 'Learn the 50/30/20 rule and how to apply it to your student life for maximum savings.',
      content: `Building a budget as a student might seem daunting, but it's one of the most important skills you can develop. The 50/30/20 rule is a simple yet effective framework: allocate 50% of your income to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment.

Start by tracking your spending for a month. You might be surprised where your money goes! Use apps or a simple spreadsheet to categorize every expense. Once you know your patterns, you can make informed decisions.

Tips for sticking to your budget:
• Set up automatic transfers to your savings account
• Use cash for discretionary spending to make it more tangible
• Review and adjust your budget monthly
• Celebrate small wins to stay motivated

Remember, a budget isn't about restriction—it's about making conscious choices with your money so you can achieve your goals.`,
      readTime: '5 min read',
      isFeatured: true,
      author: 'Sarah Chen',
      publishedDate: new Date('2025-01-10'),
    },
    {
      id: '2',
      title: 'Top 10 Scholarships for 2025',
      category: 'Scholarships',
      excerpt: 'Discover the best scholarship opportunities available this year and how to apply.',
      content: `Scholarships are essentially free money for your education—you don't have to pay them back! Here are the top opportunities for 2025...`,
      readTime: '8 min read',
      isFeatured: false,
      author: 'Michael Torres',
      publishedDate: new Date('2025-01-08'),
    },
    {
      id: '3',
      title: 'Emergency Fund: Why Every Student Needs One',
      category: 'Saving',
      excerpt: 'Unexpected expenses can derail your finances. Learn how to build your safety net.',
      content: `Life is unpredictable. Your laptop could break, you might need emergency travel, or face unexpected medical bills. An emergency fund is your financial safety net...`,
      readTime: '4 min read',
      isFeatured: false,
      author: 'Emma Williams',
      publishedDate: new Date('2025-01-05'),
    },
    {
      id: '4',
      title: 'Smart Ways to Earn While Studying',
      category: 'Income',
      excerpt: 'Part-time jobs, freelancing, and passive income ideas for busy students.',
      content: `Balancing studies and work can be challenging, but there are flexible ways to earn money that fit your schedule...`,
      readTime: '6 min read',
      isFeatured: false,
      author: 'David Kim',
      publishedDate: new Date('2025-01-03'),
    },
  ] as BlogModel[],

  // Motivational quotes
  motivationalQuotes: [
    { quote: "The best time to start saving was yesterday. The second best time is now.", author: "Financial Wisdom" },
    { quote: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
    { quote: "Small amounts saved daily add up to huge investments in the end.", author: "Mia Hamm" },
    { quote: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
    { quote: "Don't save what is left after spending; spend what is left after saving.", author: "Warren Buffett" },
  ],

  // Helper functions
  getTotalBalance: () => {
    return MockDatabase.transactions.reduce((acc, t) => {
      return acc + (t.isExpense ? -t.amount : t.amount);
    }, 0);
  },

  getTotalSavings: () => {
    return MockDatabase.savings.reduce((acc, s) => acc + s.current, 0);
  },

  getMonthlyAllowance: () => {
    return MockDatabase.transactions
      .filter((t) => !t.isExpense && t.category === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
  },

  getTotalExpenses: () => {
    return MockDatabase.transactions
      .filter((t) => t.isExpense)
      .reduce((acc, t) => acc + t.amount, 0);
  },

  getRandomQuote: () => {
    const quotes = MockDatabase.motivationalQuotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  },

  getSavingsProgress: () => {
    const total = MockDatabase.savings.reduce((acc, s) => acc + s.target, 0);
    const current = MockDatabase.savings.reduce((acc, s) => acc + s.current, 0);
    return (current / total) * 100;
  },
};
