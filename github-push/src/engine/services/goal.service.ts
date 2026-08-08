import { GoalDetails } from '../../types';

export interface NormalizedGoal extends GoalDetails {
  requiredSkills: string[];
  dependencies: string[];
  successCriteria: string[];
}

export class GoalService {
  public parseGoal(goal: GoalDetails): NormalizedGoal {
    const defaultRequiredSkills = goal.requiredSkills && goal.requiredSkills.length > 0
      ? goal.requiredSkills
      : [
          'Strategic Planning',
          'Market & Domain Knowledge',
          'Execution Discipline',
          'Stakeholder Communication'
        ];

    const defaultDependencies = goal.dependencies && goal.dependencies.length > 0
      ? goal.dependencies
      : [
          'Dedicated weekly focus time allocation',
          'Initial learning & upskilling commitment',
          'Market validation & user feedback loop'
        ];

    const defaultSuccessCriteria = goal.successCriteria && goal.successCriteria.length > 0
      ? goal.successCriteria
      : [
          'Achieve target outcome within estimated timeframe',
          'Maintain positive financial runway and career stability',
          'Demonstrate measurable milestone progress'
        ];

    return {
      ...goal,
      category: goal.category,
      title: goal.title.trim(),
      description: goal.description.trim(),
      targetTimeframe: goal.targetTimeframe || '6-12 Months',
      targetBudget: goal.targetBudget || 'Moderate',
      keyPriority: goal.keyPriority || 'Balanced Growth',
      requiredSkills: defaultRequiredSkills,
      dependencies: defaultDependencies,
      successCriteria: defaultSuccessCriteria
    };
  }
}

export const goalService = new GoalService();
