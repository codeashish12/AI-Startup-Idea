import { SkillGapAnalysis } from '../../types';

export class SkillGapService {
  public analyzeSkillGap(userSkills: string[], goalTitle: string): SkillGapAnalysis {
    const userSkillsSet = new Set((userSkills || []).map((s) => s.toLowerCase().trim()));

    let required: string[] = ['Domain Strategy', 'Execution & Analytics', 'Project Management'];
    const titleLower = (goalTitle || '').toLowerCase();

    if (titleLower.includes('product manager') || titleLower.includes('pm')) {
      required = ['Product Analytics (Mixpanel/Amplitude)', 'User Discovery Interviews', 'PRD Writing', 'A/B Testing', 'Stakeholder Management'];
    } else if (titleLower.includes('saas') || titleLower.includes('business') || titleLower.includes('startup')) {
      required = ['Go-To-Market Strategy', 'User Acquisition / Lead Gen', 'Payment Gateway Integration', 'Customer Discovery'];
    } else if (titleLower.includes('ai') || titleLower.includes('machine learning') || titleLower.includes('llm')) {
      required = ['LLM Prompt Engineering & Orchestration', 'Model Evaluation & Latency Tuning', 'API Integration', 'Product Management'];
    } else if (titleLower.includes('finance') || titleLower.includes('investing')) {
      required = ['Financial Modeling & Valuation', 'Risk Analysis', 'Portfolio Diversification', 'Market Research'];
    }

    const missing = required.filter((s) => !userSkillsSet.has(s.toLowerCase().trim()));
    const critical = missing.slice(0, 2);
    const optional = missing.slice(2);

    const missingList = missing.length > 0 ? missing : ['Advanced Domain Optimization'];
    const criticalList = critical.length > 0 ? critical : ['Target Domain Mastery'];
    const estimatedEffortHours = missing.length * 25 + 40;

    return {
      currentSkills: userSkills,
      missingSkills: missingList,
      criticalSkills: criticalList,
      optionalSkills: optional,
      learningPriority: [...criticalList, ...optional],
      estimatedEffortHours,
      explainability: {
        score: Math.max(0, 100 - missing.length * 20),
        formula: 'SkillMatchScore = 100 - (MissingRequiredSkillsCount * 20)',
        weightingBreakdown: {
          criticalGaps: critical.length * 30,
          optionalGaps: optional.length * 10
        },
        keyDrivers: missing.length === 0 
          ? ['Existing skills directly match target domain requirements']
          : [`Gap identified in ${criticalList.join(', ')}`],
        penaltiesOrBoosts: [
          `Estimated learning investment: ${estimatedEffortHours} dedicated hours`
        ],
        summary: missing.length === 0
          ? 'Strong skill overlap with target requirements.'
          : `Requires learning ${missing.length} key domain skills (~${estimatedEffortHours} hours total).`
      }
    };
  }
}

export const skillGapService = new SkillGapService();
