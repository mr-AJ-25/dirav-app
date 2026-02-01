import { API_CONFIG, AI_SYSTEM_PROMPT } from '@/config/api';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    message: string;
    code?: number;
  };
}

export async function sendMessageToGemini(userMessage: string): Promise<string> {
  // Check if API key is configured
  if (!API_CONFIG.isConfigured()) {
    console.log('Gemini API not configured, using fallback responses');
    // Simulate delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    return getFallbackResponse(userMessage);
  }

  try {
    console.log('Sending request to Gemini API...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${AI_SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.9,
          topK: 40,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API HTTP error:', response.status, errorText);
      
      if (response.status === 400) {
        return "I couldn't process that request. Please try rephrasing your question.";
      } else if (response.status === 403) {
        return "API access issue. Please check your API key permissions.";
      } else if (response.status === 429) {
        return "I'm getting too many requests right now. Please wait a moment and try again.";
      }
      
      return getFallbackResponse(userMessage);
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error.message);
      return getFallbackResponse(userMessage);
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.error('No response text in Gemini response');
      return getFallbackResponse(userMessage);
    }

    console.log('Gemini API response received successfully');
    return aiResponse.trim();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Gemini API request timed out');
        return "The request took too long. Please try again.";
      }
      console.error('Error calling Gemini API:', error.message);
    }
    return getFallbackResponse(userMessage);
  }
}

// Fallback responses when API is not configured or fails
function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim();

  // Greeting responses
  if (lowerMessage.match(/^(hello|hi|hey|good morning|good afternoon|good evening)/)) {
    return `Hello! 👋 I'm your AI financial advisor. I'm here to help you with:

• **Budgeting strategies** - Create a plan that works for you
• **Saving tips** - Reach your goals faster
• **Scholarships** - Find opportunities to fund your education
• **Expense tracking** - Understand where your money goes

What would you like help with today?`;
  }

  // Saving tips
  if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
    return `Here are my top money-saving strategies for students: 💰

**Quick Wins:**
1. **Automate your savings** - Set up auto-transfer when you get paid
2. **24-hour rule** - Wait a day before non-essential purchases
3. **Track everything** - Use our Budget tab to log spending

**Student-Specific:**
• Use student discounts everywhere (check Discover tab!)
• Buy used textbooks or rent them
• Cook meals at home - saves $200+/month
• Share streaming subscriptions

Would you like help setting up a savings goal?`;
  }

  // Budget tips
  if (lowerMessage.includes('budget') || lowerMessage.includes('spending') || lowerMessage.includes('money')) {
    return `Here's my proven budgeting framework for students: 📊

**The 50/30/20 Rule:**
• **50%** for needs (rent, food, utilities)
• **30%** for wants (entertainment, dining out)
• **20%** for savings & debt

**Your Current Status:**
Based on your $3,000 monthly allowance:
• Needs: $1,500
• Wants: $900  
• Savings: $600

**Pro Tips:**
• Review subscriptions monthly
• Use cash for discretionary spending
• Meal prep on Sundays

Check your Budget tab to see detailed breakdown!`;
  }

  // Scholarship info
  if (lowerMessage.includes('scholarship') || lowerMessage.includes('grant') || lowerMessage.includes('financial aid')) {
    return `Great question! Here are scholarship opportunities: 🎓

**Currently Available:**
• **STEM Future Scholarship** - $5,000
  Deadline: April 15, 2025
  
• **Arts Excellence Grant** - $2,500
  Deadline: May 1, 2025

**Tips for Applications:**
1. Start early - don't wait until deadline
2. Tailor each essay to the scholarship
3. Get recommendation letters now
4. Apply to many, even small ones add up!

Check the Discover tab for more opportunities! 🎯`;
  }

  // Expense tracking
  if (lowerMessage.includes('expense') || lowerMessage.includes('track') || lowerMessage.includes('spent')) {
    return `Let me analyze your spending patterns: 📉

**This Month's Breakdown:**
• 📚 Education: $150 (Textbooks)
• ☕ Food & Drinks: $120
• 🎮 Entertainment: $45
• 🏋️ Health: $35

**Total Spent:** $350

**Insights:**
✅ You're 12% under budget - great job!
💡 Education is your biggest expense
🎯 Consider: Student textbook rentals could save $50+

Want me to help you set a spending limit?`;
  }

  // Goals
  if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
    return `Here's your savings goals overview: 🎯

**Active Goals:**
• 💻 **New Laptop:** $850 / $2,000 (43%)
  → On track for December 2025
  
• ✈️ **Summer Trip:** $350 / $1,500 (23%)
  → Need $115/month to reach goal
  
• ✅ **Emergency Fund:** Completed! 🎉

**Recommendation:**
If you save just $50 more per month, you'll reach your laptop goal 3 months earlier!

Would you like tips to accelerate your savings?`;
  }

  // Thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return `You're welcome! 😊 

Remember, building good financial habits is a journey, not a sprint. You're doing great by taking control of your finances!

I'm here whenever you need:
• Budget advice
• Savings strategies  
• Scholarship recommendations
• Spending analysis

Keep up the excellent work! 💪`;
  }

  // Help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
    return `I'm Dirav AI, your personal financial assistant! 🤖

**I can help you with:**

📊 **Budgeting**
"How should I budget my money?"

💰 **Saving**
"How can I save more each month?"

🎓 **Scholarships**
"What scholarships are available?"

📈 **Analysis**
"Analyze my spending habits"

🎯 **Goals**
"How are my savings goals?"

Just ask me anything about your finances!`;
  }

  // Default response
  return `That's a great question! Let me help you with that. 📊

Based on your financial profile:
• **Monthly Income:** $3,000
• **Current Savings:** $2,200
• **Savings Rate:** ~22% (above average!)

**My Recommendations:**
1. Keep your emergency fund at $1,000+ ✅
2. Consider the scholarships in Discover tab
3. Review your Budget tab weekly
4. Try the 24-hour rule for big purchases

Would you like specific advice on budgeting, saving, or finding opportunities?`;
}

export function isAPIConfigured(): boolean {
  return API_CONFIG.isConfigured();
}
