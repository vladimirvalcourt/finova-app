import OpenAI from 'openai'

// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

// Types
export interface CategorySuggestion {
    category: string
    subcategory?: string
    confidence: number
    reasoning?: string
}

export interface SpendingInsight {
    type: 'positive' | 'warning' | 'neutral' | 'tip'
    title: string
    message: string
    category?: string
    amount?: number
    comparison?: string
}

export interface ReceiptData {
    merchant: string
    total: number
    date: string
    items: Array<{
        name: string
        price: number
        quantity?: number
    }>
    confidence: number
}

// Smart Transaction Categorization
export async function categorizeTransaction(
    description: string,
    amount: number,
    userLocale: string = 'en-US'
): Promise<CategorySuggestion> {
    // Return fallback if OpenAI is not configured
    if (!openai) {
        return {
            category: 'Other',
            confidence: 0,
            reasoning: 'OpenAI not configured',
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are a financial categorization expert. Categorize transactions accurately based on merchant name and description. Consider the user's locale: ${userLocale}. For example, "colmado" in Dominican Spanish means groceries.`,
                },
                {
                    role: 'user',
                    content: `Categorize this transaction: "${description}" for $${amount}`,
                },
            ],
            functions: [
                {
                    name: 'categorize_transaction',
                    description: 'Categorize a financial transaction',
                    parameters: {
                        type: 'object',
                        properties: {
                            category: {
                                type: 'string',
                                enum: [
                                    'Groceries',
                                    'Dining',
                                    'Transportation',
                                    'Utilities',
                                    'Entertainment',
                                    'Shopping',
                                    'Health',
                                    'Income',
                                    'Transfer',
                                    'Other',
                                ],
                            },
                            subcategory: {
                                type: 'string',
                                description: 'More specific category',
                            },
                            confidence: {
                                type: 'number',
                                description: 'Confidence score from 0 to 1',
                            },
                            reasoning: {
                                type: 'string',
                                description: 'Brief explanation of categorization',
                            },
                        },
                        required: ['category', 'confidence'],
                    },
                },
            ],
            function_call: { name: 'categorize_transaction' },
        })

        const functionCall = response.choices[0].message.function_call
        if (functionCall && functionCall.arguments) {
            return JSON.parse(functionCall.arguments)
        }

        throw new Error('No categorization returned')
    } catch (error) {
        console.error('Categorization error:', error)
        return {
            category: 'Other',
            confidence: 0,
            reasoning: 'Failed to categorize',
        }
    }
}

// Generate Weekly Spending Insights
export async function generateSpendingInsights(
    transactions: Array<{
        amount: number
        category: string
        date: string
        description: string
    }>,
    previousPeriodTransactions: Array<{
        amount: number
        category: string
    }>,
    userLocale: string = 'en-US'
): Promise<SpendingInsight[]> {
    // Return empty array if OpenAI is not configured
    if (!openai) {
        return [];
    }

    try {
        const currentTotal = transactions.reduce((sum, t) => sum + t.amount, 0)
        const previousTotal = previousPeriodTransactions.reduce(
            (sum, t) => sum + t.amount,
            0
        )

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful personal finance advisor. Provide 3-5 actionable insights about spending patterns. Be encouraging and specific. Use the user's locale: ${userLocale}.`,
                },
                {
                    role: 'user',
                    content: `Analyze these transactions and provide insights:
          
Current week: ${JSON.stringify(transactions)}
Previous week: ${JSON.stringify(previousPeriodTransactions)}

Current total: $${currentTotal}
Previous total: $${previousTotal}

Provide insights in JSON format as an array of objects with: type, title, message, category (optional), amount (optional), comparison (optional)`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0].message.content
        if (content) {
            const parsed = JSON.parse(content)
            return parsed.insights || []
        }

        return []
    } catch (error) {
        console.error('Insights generation error:', error)
        return []
    }
}

// Budget Recommendations
export async function generateBudgetRecommendations(
    spendingHistory: Record<string, number[]>, // category -> amounts array
    monthlyIncome: number
): Promise<Record<string, { amount: number; reasoning: string }>> {
    // Return empty object if OpenAI is not configured
    if (!openai) {
        return {};
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a financial advisor. Recommend realistic monthly budgets based on spending history and income.',
                },
                {
                    role: 'user',
                    content: `Based on this spending history, recommend monthly budgets:
          
Spending history by category: ${JSON.stringify(spendingHistory)}
Monthly income: $${monthlyIncome}

Provide recommendations in JSON format: { category: { amount: number, reasoning: string } }`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0].message.content
        if (content) {
            return JSON.parse(content)
        }

        return {}
    } catch (error) {
        console.error('Budget recommendation error:', error)
        return {}
    }
}

// Receipt OCR
export async function processReceipt(imageUrl: string): Promise<ReceiptData> {
    // Throw error if OpenAI is not configured (receipt processing requires it)
    if (!openai) {
        throw new Error('OpenAI API key not configured. Receipt processing unavailable.');
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Extract the following information from this receipt: merchant name, total amount, date, and line items with prices. Return as JSON.',
                        },
                        {
                            type: 'image_url',
                            image_url: { url: imageUrl },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        })

        const content = response.choices[0].message.content
        if (content) {
            const parsed = JSON.parse(content)
            return {
                merchant: parsed.merchant || 'Unknown',
                total: parsed.total || 0,
                date: parsed.date || new Date().toISOString().split('T')[0],
                items: parsed.items || [],
                confidence: parsed.confidence || 0.8,
            }
        }

        throw new Error('No receipt data extracted')
    } catch (error) {
        console.error('Receipt processing error:', error)
        throw error
    }
}

// Natural Language Transaction Entry
export async function parseNaturalLanguageTransaction(
    input: string,
    userLocale: string = 'en-US'
): Promise<{
    amount: number
    description: string
    category?: string
    date?: string
    type: 'income' | 'expense' | 'transfer'
}> {
    // Throw error if OpenAI is not configured
    if (!openai) {
        throw new Error('OpenAI API key not configured. Natural language parsing unavailable.');
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are a transaction parser. Extract transaction details from natural language. Consider locale: ${userLocale}. Examples:
          - "Spent $45 at Whole Foods yesterday" -> expense, $45, groceries, yesterday
          - "Got paid $3000" -> income, $3000, salary, today
          - "Paid rent $1500" -> expense, $1500, rent, today`,
                },
                {
                    role: 'user',
                    content: `Parse this transaction: "${input}"`,
                },
            ],
            functions: [
                {
                    name: 'parse_transaction',
                    parameters: {
                        type: 'object',
                        properties: {
                            amount: { type: 'number' },
                            description: { type: 'string' },
                            category: { type: 'string' },
                            date: { type: 'string', description: 'ISO date format' },
                            type: {
                                type: 'string',
                                enum: ['income', 'expense', 'transfer'],
                            },
                        },
                        required: ['amount', 'description', 'type'],
                    },
                },
            ],
            function_call: { name: 'parse_transaction' },
        })

        const functionCall = response.choices[0].message.function_call
        if (functionCall && functionCall.arguments) {
            return JSON.parse(functionCall.arguments)
        }

        throw new Error('Failed to parse transaction')
    } catch (error) {
        console.error('NL parsing error:', error)
        throw error
    }
}

// Anomaly Detection
export async function detectAnomalies(
    currentTransaction: {
        amount: number
        category: string
        description: string
    },
    averageAmount: number,
    stdDeviation: number
): Promise<{
    isAnomaly: boolean
    severity: 'low' | 'medium' | 'high'
    message: string
}> {
    const zScore = Math.abs((currentTransaction.amount - averageAmount) / stdDeviation)

    if (zScore < 2) {
        return {
            isAnomaly: false,
            severity: 'low',
            message: 'Normal spending',
        }
    }

    // Return basic anomaly detection if OpenAI is not configured
    if (!openai) {
        return {
            isAnomaly: true,
            severity: zScore > 3 ? 'high' : 'medium',
            message: 'This transaction is higher than your usual spending in this category.',
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a fraud detection and spending pattern analyst. Explain unusual transactions in a helpful, non-alarming way.',
                },
                {
                    role: 'user',
                    content: `This transaction seems unusual:
          
Transaction: ${currentTransaction.description} - $${currentTransaction.amount}
Category: ${currentTransaction.category}
Your average for this category: $${averageAmount}
Standard deviation: $${stdDeviation}

Explain why this might be unusual and ask if it's expected.`,
                },
            ],
        })

        const message = response.choices[0].message.content || 'Unusual spending detected'

        return {
            isAnomaly: true,
            severity: zScore > 3 ? 'high' : 'medium',
            message,
        }
    } catch (error) {
        console.error('Anomaly detection error:', error)
        return {
            isAnomaly: true,
            severity: 'medium',
            message: 'This transaction is higher than your usual spending in this category.',
        }
    }
}

// Financial Goal Coaching
export async function generateGoalCoaching(
    goal: {
        name: string
        targetAmount: number
        currentAmount: number
        deadline?: string
    },
    recentTransactions: Array<{
        amount: number
        category: string
    }>
): Promise<{
    progress: string
    recommendations: string[]
    encouragement: string
}> {
    // Return basic coaching if OpenAI is not configured
    if (!openai) {
        return {
            progress: 'Keep saving!',
            recommendations: ['Review your spending', 'Set a monthly savings target'],
            encouragement: "You're on the right track!",
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an encouraging financial coach. Help users achieve their savings goals with specific, actionable advice.',
                },
                {
                    role: 'user',
                    content: `Help with this savings goal:
          
Goal: ${goal.name}
Target: $${goal.targetAmount}
Current: $${goal.currentAmount}
Deadline: ${goal.deadline || 'Not set'}

Recent spending: ${JSON.stringify(recentTransactions)}

Provide: progress assessment, 3 specific recommendations, and encouragement.
Return as JSON: { progress, recommendations: [], encouragement }`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0].message.content
        if (content) {
            return JSON.parse(content)
        }

        return {
            progress: 'Making progress!',
            recommendations: [],
            encouragement: 'Keep going!',
        }
    } catch (error) {
        console.error('Goal coaching error:', error)
        return {
            progress: 'Keep saving!',
            recommendations: ['Review your spending', 'Set a monthly savings target'],
            encouragement: "You're on the right track!",
        }
    }
}
