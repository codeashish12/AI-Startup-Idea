import { z } from 'zod';

export const UserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(16, 'Age must be at least 16').max(100, 'Age must be 100 or less'),
  education: z.string().min(1, 'Education is required'),
  skills: z.array(z.string()),
  experience: z.string(),
  income: z.string(),
  city: z.string(),
  availableTime: z.string().min(1, 'Available time is required'),
  riskTolerance: z.enum(['Low', 'Moderate', 'High']),
  goalsSummary: z.string().optional().default(''),
  savings: z.string().optional(),
  interests: z.array(z.string()).optional()
});

export const GoalDetailsSchema = z.object({
  category: z.enum(['Career', 'Business', 'Education', 'Finance', 'Skill Learning', 'Custom Goal']),
  title: z.string().min(2, 'Goal title must be at least 2 characters'),
  description: z.string().min(5, 'Goal description must be at least 5 characters'),
  targetTimeframe: z.string().min(1, 'Target timeframe is required'),
  targetBudget: z.string().min(1, 'Target budget is required'),
  keyPriority: z.string().min(1, 'Key priority is required'),
  requiredSkills: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  successCriteria: z.array(z.string()).optional()
});

export const SimulationRequestSchema = z.object({
  userProfile: UserProfileSchema,
  goalCategory: z.enum(['Career', 'Business', 'Education', 'Finance', 'Skill Learning', 'Custom Goal']),
  goalDetails: GoalDetailsSchema,
  followUpAnswers: z.record(z.string(), z.string()).optional()
});

export const GenerateQuestionsSchema = z.object({
  userProfile: UserProfileSchema.optional(),
  goalCategory: z.string().min(1, 'Goal category is required'),
  goalTitle: z.string().min(1, 'Goal title is required'),
  goalDescription: z.string().optional().default('')
});

export function validateSimulationRequest(body: unknown) {
  const result = SimulationRequestSchema.safeParse(body);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return {
      isValid: false as const,
      errors: errorMessages,
      data: null
    };
  }
  return {
    isValid: true as const,
    errors: [],
    data: result.data
  };
}

export function validateGenerateQuestionsRequest(body: unknown) {
  const result = GenerateQuestionsSchema.safeParse(body);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return {
      isValid: false as const,
      errors: errorMessages,
      data: null
    };
  }
  return {
    isValid: true as const,
    errors: [],
    data: result.data
  };
}
