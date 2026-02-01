// ═══════════════════════════════════════════════════════════════════════════
// API CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
// 
// TO USE GOOGLE GEMINI AI:
// 1. Go to: https://aistudio.google.com/app/apikey
// 2. Click "Create API Key"
// 3. Copy your API key
// 4. Replace 'YOUR_API_KEY_HERE' below with your actual key
//
// ═══════════════════════════════════════════════════════════════════════════

export const API_CONFIG = {
  // Replace this with your actual Google Gemini API key
  GEMINI_API_KEY: 'AIzaSyCa9stIuaVf01Bz1AOco-N5a8bT0A4T0vY',
  
  // Gemini API endpoint - Updated to use gemini-1.5-flash (most reliable)
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  
  // Google OAuth Client ID (for Google Sign-In)
  // Get from: https://console.cloud.google.com/apis/credentials
  GOOGLE_CLIENT_ID: 'AIzaSyCa9stIuaVf01Bz1AOco-N5a8bT0A4T0vY',
  
  // Check if API key is configured
  isConfigured: function() {
    return this.GEMINI_API_KEY !== 'AIzaSyCa9stIuaVf01Bz1AOco-N5a8bT0A4T0vY' && 
           this.GEMINI_API_KEY.length > 20 &&
           this.GEMINI_API_KEY.startsWith('AIza');
  },
  
  // Check if Google OAuth is configured
  isGoogleConfigured: function() {
    return this.GOOGLE_CLIENT_ID !== 'AIzaSyCa9stIuaVf01Bz1AOco-N5a8bT0A4T0vY' && 
           this.GOOGLE_CLIENT_ID.length > 20;
  }
};

// System prompt for the AI financial advisor
export const AI_SYSTEM_PROMPT = `You are Dirav AI, a friendly and knowledgeable personal financial advisor for students. Your role is to:

1. Help students manage their budget and expenses
2. Provide savings tips and strategies
3. Recommend scholarships and student discounts
4. Answer questions about personal finance in simple terms
5. Motivate students to achieve their financial goals

Keep responses concise (under 200 words), friendly, and actionable. Use emojis occasionally to keep the tone light. Format important points with bullet points or numbered lists when appropriate.

Current user context:
- Monthly allowance: $3,000
- Total savings: $2,200
- Active savings goals: New Laptop ($850/$2000), Summer Trip ($350/$1500)
- Recent expenses: Textbooks, Coffee, Gym membership

Always be encouraging and supportive. If you don't know something specific, suggest they check the relevant section of the app (Dashboard, Planning, Savings, Opportunities).`;
