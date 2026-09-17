export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  locationName: string;
  subCounty: string;
  county: string;
}

export interface ClimateCurrent {
  temperature: number; // °C
  apparentTemperature: number; // °C
  relativeHumidity: number; // %
  precipitation: number; // mm
  rain: number; // mm
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number; // km/h
  surfacePressure: number; // hPa
  isDay: boolean;
}

export interface ClimateDaily {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationSum: number[];
  precipitationProbability: number[];
}

export interface ClimateHistoryAverages {
  annualRainfallEstimatedMm: number;
  longRainsAvgMm: number; // March - May
  shortRainsAvgMm: number; // Oct - Dec
  drySeasonAvgMm: number; // Jan - Feb / June - Sept
  microclimateCategory: 'Highland Sub-Humid' | 'Rift Valley Semi-Arid Floor' | 'Escarpment Mist Zone';
}

export interface SoilGridsData {
  rawDecicentsPh: number; // raw value from ISRIC, e.g., 62
  standardPh: number; // converted standard pH, e.g., 6.2
  phClassification: string; // e.g. Moderately Acidic, Neutral, Slightly Acidic
  organicCarbonDgKg: number; // raw dg/kg, e.g. 210
  organicCarbonGKg: number; // g/kg, e.g. 21.0
  organicCarbonPercentage: number; // %, e.g. 2.1%
  fertilityRating: 'High' | 'Moderate' | 'Low' | 'Very High';
  clayContentPercent: number;
  sandContentPercent: number;
  siltContentPercent: number;
  soilTextureClass: string; // e.g., 'Volcanic Silt Loam'
  volcanicOrigin: string; // Rift Valley pyroclastic silt
  soilMoisturePercent: number;
  dataSource: 'ISRIC SoilGrids REST v2.0' | 'ISRIC SoilGrids (Calibrated Rift Valley Volcanic Profile)';
  timestamp: string;
}

export interface EnvironmentalProfile {
  location: GeoLocation;
  elevation: number; // meters above sea level
  climate: {
    current: ClimateCurrent;
    daily: ClimateDaily;
    historical: ClimateHistoryAverages;
    soilMoistureHourlyAvg: number;
    dataSource: string;
  };
  soil: SoilGridsData;
}

export type SupportedCrop = 'Maize' | 'Irish Potatoes' | 'Beans' | 'Pyrethrum';

export interface CropScore {
  crop: SupportedCrop;
  varietyRecommendation: string;
  suitabilityScore: number; // 0 - 100%
  confidence: number; // RF confidence
  reasons: string[];
  limitingFactors: string[];
  optimalElevationRange: string;
  optimalPhRange: string;
  optimalRainfallRange: string;
}

export interface CropRecommendationResult {
  topRecommendedCrop: SupportedCrop;
  variety: string;
  confidenceScore: number; // e.g. 94%
  suitabilityRankings: CropScore[];
  plantingWindow: {
    seasonName: string; // e.g., "Long Rains (Masika)" or "Short Rains (Vuli)"
    startDate: string; // e.g., "2026-03-20"
    endDate: string; // e.g., "2026-04-30"
    status: 'Optimal Planting Now' | 'Upcoming Planting Window' | 'Land Preparation Phase' | 'Short Rains Prep';
    soilMoistureSuitability: string;
    germinationDays: number;
  };
  harvestingSchedule: {
    estimatedDaysToMaturity: number;
    targetHarvestStartDate: string;
    targetHarvestEndDate: string;
    expectedYieldEstimate: string; // e.g., "28-35 bags/acre"
  };
  agronomicGuidelines: {
    spacing: string;
    fertilizerRecommendation: string;
    seedRate: string;
    pestManagementFocus: string;
  };
  randomForestMetrics: {
    treesEvaluated: number;
    elevationGiniImportance: number;
    phGiniImportance: number;
    rainfallGiniImportance: number;
    organicCarbonGiniImportance: number;
  };
}

export interface TreatmentOption {
  type: 'Cultural / Agronomic' | 'Organic / Biological' | 'Chemical / Fungicide';
  title: string;
  action: string;
  timing: string;
  kenyaRegPcpbProduct?: string; // Kenya Pest Control Products Board registered active
  preHarvestInterval?: string;
  effectiveness: 'High' | 'Very High' | 'Preventative / Moderate';
}

export interface LeafScanDiagnosis {
  id: string;
  cropDetected: string;
  condition: string;
  isHealthy: boolean;
  scientificPathogen: string;
  confidencePercentage: number;
  severityLevel: 'None' | 'Mild (10-25%)' | 'Moderate (26-55%)' | 'Severe (>55%)';
  symptomSummary: string;
  affectedPart: string;
  plantVillageClassMatch: string;
  treatments: TreatmentOption[];
  localNakuruAdvice: string;
  scanTimestamp: string;
  imageThumbnail?: string;
}
