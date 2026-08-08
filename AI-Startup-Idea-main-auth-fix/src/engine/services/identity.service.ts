import { UserProfile } from '../../types';
import { FDF_CONFIG } from '../../config/fdfConfig';

export interface IdentityAnalysis {
  normalizedProfile: UserProfile;
  weeklyCapacityHours: number;
  riskCapacityMultiplier: number;
  runwayEstimate: string;
  profileCompleteness: number;
  currencySymbol: string;
}

export class IdentityService {
  public analyzeProfile(profile: UserProfile): IdentityAnalysis {
    const hoursMatch = (profile.availableTime || '').match(/\d+/);
    const hoursPerWeek = hoursMatch ? parseInt(hoursMatch[0], 10) : 15;
    
    const isHighRisk = profile.riskTolerance === 'High';
    const isLowRisk = profile.riskTolerance === 'Low';

    const riskCapacityMultiplier = isHighRisk ? 1.25 : isLowRisk ? 0.75 : 1.0;
    
    let completeness = 0;
    if (profile.name) completeness += 20;
    if (profile.education) completeness += 15;
    if (profile.skills && profile.skills.length > 0) completeness += 25;
    if (profile.income) completeness += 20;
    if (profile.availableTime) completeness += 20;

    return {
      normalizedProfile: {
        ...profile,
        skills: profile.skills ? profile.skills.map(s => s.trim()).filter(Boolean) : []
      },
      weeklyCapacityHours: hoursPerWeek,
      riskCapacityMultiplier,
      runwayEstimate: profile.income ? `Supported by current ${profile.income} income buffer` : 'Flexible runway',
      profileCompleteness: completeness,
      currencySymbol: FDF_CONFIG.SYSTEM.CURRENCY.SYMBOL
    };
  }
}

export const identityService = new IdentityService();
