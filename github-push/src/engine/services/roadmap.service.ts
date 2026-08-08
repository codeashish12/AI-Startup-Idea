import { RoadmapPhase, StrategyType } from '../../types';

export class RoadmapService {
  public generateRoadmap(goalTitle: string, strategy: StrategyType): RoadmapPhase[] {
    const isAggressive = strategy === 'Aggressive';
    const isConservative = strategy === 'Conservative';

    return [
      {
        phase: `Phase 1: Foundation & Positioning (${isAggressive ? 'Month 1' : isConservative ? 'Months 1–3' : 'Months 1–2'})`,
        actions: [
          'Conduct skill gap audit and select primary upskilling program',
          'Establish weekly blocked focus calendar schedule',
          'Draft initial PRD / product prototype outline / case study brief'
        ],
        milestone: 'Baseline competencies mastered and execution setup ready',
        projects: ['Domain Research Brief', 'Portfolio Specification'],
        resources: ['Online Masterclasses', 'Domain Industry Reports'],
        weeklyPlan: [
          { week: 1, focus: 'Audit & Alignment', tasks: ['Complete identity alignment', 'Block focus hours in calendar'], checkpoint: 'Calendar locked' },
          { week: 2, focus: 'Core Skill Sprint', tasks: ['Start primary certification', 'Analyze 3 top domain teardowns'], checkpoint: '25% Course complete' },
          { week: 3, focus: 'Practical Lab', tasks: ['Build initial sample project exercise', 'Share learnings on LinkedIn'], checkpoint: 'First public proof' },
          { week: 4, focus: 'Phase 1 Review', tasks: ['Evaluate execution velocity', 'Adjust focus areas'], checkpoint: 'Phase 1 sign-off' }
        ]
      },
      {
        phase: `Phase 2: Core Execution & Proof-of-Capability (${isAggressive ? 'Months 2–4' : isConservative ? 'Months 4–8' : 'Months 3–5'})`,
        actions: [
          'Build and publish 2 high-impact public case studies or working prototypes',
          'Initiate targeted outreach to 15 industry hiring managers or partners',
          'Refine analytics and user discovery skills through real-world feedback'
        ],
        milestone: 'Verified public portfolio with external feedback',
        projects: ['Flagship Prototype / Case Study', 'Public Teardown Article'],
        resources: ['Professional Networks', 'Build-in-Public Channels'],
        monthlyPlan: [
          { month: 1, theme: 'Build & Ship', goals: ['Ship V1 prototype', 'Gather feedback from 10 users'], keyMilestone: 'Prototype online' },
          { month: 2, theme: 'Network & Pitch', goals: ['Reach out to 15 target contacts', 'Attend 2 industry meetups'], keyMilestone: '5 response calls' },
          { month: 3, theme: 'Iterate & Refine', goals: ['Implement user feedback', 'Finalize resume / pitch deck'], keyMilestone: 'Market-ready' }
        ]
      },
      {
        phase: `Phase 3: Launch, Transition & Scaling (${isAggressive ? 'Months 4–6+' : isConservative ? 'Months 8–18+' : 'Months 6–12+'})`,
        actions: [
          'Enter active recruitment pipeline or launch commercial offering',
          'Negotiate optimal compensation (CTC / equity) or commercial terms',
          'Establish sustainable operational rhythm and growth loops'
        ],
        milestone: 'Successful role pivot or target revenue milestone achieved',
        projects: ['Offer Negotiation / Commercial Pricing Model'],
        resources: ['Compensation Benchmarks', 'Contract Templates']
      }
    ];
  }
}

export const roadmapService = new RoadmapService();
