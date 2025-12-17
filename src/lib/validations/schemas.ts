import { z } from 'zod'

// ============== Transaction Schemas ==============
export const createTransactionSchema = z.object({
    account_id: z.string().uuid('Invalid account ID'),
    category_id: z.string().uuid('Invalid category ID').nullable().optional(),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required').max(255),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    date: z.string().datetime().optional(),
    recurring: z.boolean().optional().default(false),
    notes: z.string().max(1000).nullable().optional(),
})

export const updateTransactionSchema = createTransactionSchema.partial()

// ============== Account Schemas ==============
export const createAccountSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT', 'CASH']),
    currency: z.string().length(3).default('USD'),
    balance: z.number().default(0),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
    icon: z.string().max(10).optional(),
})

export const updateAccountSchema = createAccountSchema.partial()

// ============== Goal Schemas ==============
export const createGoalSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    target_amount: z.number().positive('Target amount must be positive'),
    current_amount: z.number().min(0).default(0),
    deadline: z.string().datetime().nullable().optional(),
    icon: z.string().max(10).optional().default('🎯'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#6366f1'),
})

export const updateGoalSchema = createGoalSchema.partial()

export const addContributionSchema = z.object({
    amount: z.number().positive('Contribution must be positive'),
})

// ============== Budget Schemas ==============
export const createBudgetSchema = z.object({
    category_id: z.string().uuid('Invalid category ID'),
    amount: z.number().positive('Amount must be positive'),
    period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().nullable().optional(),
})

export const updateBudgetSchema = createBudgetSchema.partial()

// ============== Category Schemas ==============
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(50),
    type: z.enum(['INCOME', 'EXPENSE']),
    icon: z.string().max(10).optional().default('📁'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#6366f1'),
    parent_id: z.string().uuid().nullable().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

// ============== Type Exports ==============
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
export type AddContributionInput = z.infer<typeof addContributionSchema>
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
