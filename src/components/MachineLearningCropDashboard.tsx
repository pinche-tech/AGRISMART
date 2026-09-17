import React, { useState } from 'react';
import {
  Sprout,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  TreeDeciduous,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Sliders,
  Compass
} from 'lucide-react';
import {
  EnvironmentalProfile,
  CropRecommendationResult,
  SupportedCrop,
  CropScore
} from '../types';

interface MachineLearningCropDashboardProps {
  profile: EnvironmentalProfile;
  recommendation: CropRecommendationResult;
  onRefreshMl: () => void;
}

export const MachineLearningCropDashboard: React.FC<MachineLearningCropDashboardProps> = ({
  profile,
  recommendation,
  onRefreshMl
}) => {
  const [selectedCrop, setSelectedCrop] = useState<SupportedCrop>(recommendation.topRecommendedCrop);
  const [showTreeLogicModal, setShowTreeLogicModal] = useState(false);

  const topCropScore = recommendation.suitabilityRankings.find(
    (c) => c.crop === recommendation.topRecommendedCrop
  ) || recommendation.suitabilityRankings[0];

  const activeCropScore = recommendation.suitabilityRankings.find(
    (c) => c.crop === selectedCrop
  ) || topCropScore;

  // Icon mapping for crops
  const cropIcons: Record<SupportedCrop, string> = {
    Maize: '🌽',
    'Irish Potatoes': '🥔',
    Beans: '🫘',
    Pyrethrum: '🌼'
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Random Forest Predictive Intelligence Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d271c] border border-emerald-800/70 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
            <TreeDeciduous className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">
                Machine Learning Crop Recommendation Engine
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                100-Tree RF Ensemble
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Optimized for Nakuru high elevation (~1700m-2000m) & Rift Valley volcanic silt soils
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-rf-metrics"
            onClick={() => setShowTreeLogicModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-800 text-xs font-medium cursor-pointer transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Random Forest Model Metrics</span>
          </button>
        </div>
      </div>

      {/* Primary Highlight Card: Top Recommended Crop */}
      <div
        id="card-top-crop-recommendation"
        className="bg-gradient-to-br from-[#0c2e20] via-[#092217] to-[#061810] border-2 border-emerald-500/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                #1 Optimal Match
              </span>
              <span className="text-xs text-emerald-300/90 font-mono">
                Model Confidence: <strong className="text-emerald-400">{recommendation.confidenceScore}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">{cropIcons[recommendation.topRecommendedCrop]}</span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                  {recommendation.topRecommendedCrop}
                </h3>
                <p className="text-sm font-semibold text-emerald-300">
                  {recommendation.variety}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed mt-2">
              Cross-referenced against your farm's elevation (<strong className="text-white">{Math.round(profile.elevation)}m</strong>),
              volcanic silt pH (<strong className="text-white">{profile.soil.standardPh}</strong>), and seasonal rainfall regimes.
            </p>
          </div>

          {/* Suitability Score Dial */}
          <div className="flex flex-col items-center justify-center bg-emerald-950/80 border border-emerald-600/40 rounded-2xl p-4 min-w-[140px] shrink-0 self-start">
            <span className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">
              Agronomic Fitness
            </span>
            <div className="text-4xl font-black text-emerald-400 font-mono my-1">
              {topCropScore.suitabilityScore}%
            </div>
            <span className="text-[10px] text-emerald-200/70 text-center">
              Random Forest Ensemble Vote
            </span>
          </div>
        </div>

        {/* Dynamic Planting Window & Target Harvest Schedule */}
        <div className="mt-6 pt-5 border-t border-emerald-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Planting Window */}
          <div
            id="card-planting-window"
            className="bg-[#0b2419] border border-emerald-800/80 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wide">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Dynamic Planting Window
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700">
                {recommendation.plantingWindow.status}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-extrabold text-white font-mono">
                {recommendation.plantingWindow.startDate}
              </span>
              <span className="text-xs text-emerald-400">to</span>
              <span className="text-lg font-extrabold text-white font-mono">
                {recommendation.plantingWindow.endDate}
              </span>
            </div>

            <p className="text-xs text-emerald-300/80 mt-1 font-medium">
              Season: <strong className="text-white">{recommendation.plantingWindow.seasonName}</strong>
            </p>
            <p className="text-xs text-emerald-200/90 mt-2 bg-emerald-950/60 p-2 rounded-lg border border-emerald-900/60">
              🌱 {recommendation.plantingWindow.soilMoistureSuitability} Expected emergence in ~{recommendation.plantingWindow.germinationDays} days.
            </p>
          </div>

          {/* Harvesting Schedule */}
          <div
            id="card-harvest-schedule"
            className="bg-[#0b2419] border border-emerald-800/80 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wide">
                <Clock className="w-4 h-4 text-emerald-400" />
                Target Harvest Window
              </span>
              <span className="text-[11px] font-mono text-emerald-300 font-semibold">
                ~{recommendation.harvestingSchedule.estimatedDaysToMaturity} Days Cycle
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-extrabold text-white font-mono">
                {recommendation.harvestingSchedule.targetHarvestStartDate}
              </span>
              <span className="text-xs text-emerald-400">to</span>
              <span className="text-lg font-extrabold text-white font-mono">
                {recommendation.harvestingSchedule.targetHarvestEndDate}
              </span>
            </div>

            <p className="text-xs text-emerald-300/80 mt-1 font-medium">
              Target Yield: <strong className="text-emerald-400">{recommendation.harvestingSchedule.expectedYieldEstimate}</strong>
            </p>
            <div className="mt-2 text-xs text-emerald-200/90 bg-emerald-950/60 p-2 rounded-lg border border-emerald-900/60 flex items-center gap-1.5">
              <span>🌾 Field spacing: {recommendation.agronomicGuidelines.spacing}</span>
            </div>
          </div>
        </div>

        {/* Agronomic Fertilizer & Seed Guidelines */}
        <div className="mt-4 pt-4 border-t border-emerald-900/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60">
            <span className="text-emerald-400 font-bold block mb-1">
              🧪 Volcanic Soil Nutrition Program:
            </span>
            <span className="text-emerald-200">{recommendation.agronomicGuidelines.fertilizerRecommendation}</span>
          </div>
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60">
            <span className="text-emerald-400 font-bold block mb-1">
              🛡️ Pest & Disease Vigilance:
            </span>
            <span className="text-emerald-200">{recommendation.agronomicGuidelines.pestManagementFocus}</span>
          </div>
        </div>
      </div>

      {/* Crop Comparison Selector: Maize, Irish Potatoes, Beans, Pyrethrum */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Ensemble Comparison: All 4 Nakuru Crops</span>
          </h4>
          <span className="text-xs text-emerald-400 font-mono">Click to inspect threshold breakdown</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recommendation.suitabilityRankings.map((item) => {
            const isTop = item.crop === recommendation.topRecommendedCrop;
            const isCurrent = item.crop === selectedCrop;

            return (
              <button
                key={item.crop}
                id={`btn-crop-select-${item.crop.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCrop(item.crop)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-900/80 border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                    : 'bg-[#0d261b] hover:bg-emerald-950/80 border-emerald-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{cropIcons[item.crop]}</span>
                  {isTop && (
                    <span className="text-[9px] font-bold uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                      Top Pick
                    </span>
                  )}
                </div>

                <div className="font-bold text-white text-sm truncate">{item.crop}</div>
                <div className="flex items-baseline justify-between mt-1 text-xs">
                  <span className="text-emerald-300/80">Suitability:</span>
                  <span className="font-mono font-bold text-emerald-400">{item.suitabilityScore}%</span>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full bg-emerald-950 rounded-full h-1.5 mt-2 overflow-hidden border border-emerald-800/40">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${item.suitabilityScore}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Agronomic Detail Card */}
      {activeCropScore && (
        <div
          id="card-active-crop-details"
          className="bg-[#0b2217] border border-emerald-800/70 rounded-2xl p-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{cropIcons[activeCropScore.crop]}</span>
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  {activeCropScore.crop} — Agronomic Profile for Elmenteita
                </h4>
                <p className="text-xs text-emerald-300 font-medium">
                  Recommended Hybrid/Variety: {activeCropScore.varietyRecommendation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                RF Ensemble Votes: {activeCropScore.confidence}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-900/60">
              <span className="text-emerald-400 font-semibold block mb-0.5">Optimal Elevation:</span>
              <span className="text-white font-mono">{activeCropScore.optimalElevationRange}</span>
              <span className="block text-[11px] text-emerald-300/80 mt-1">
                Your farm: {Math.round(profile.elevation)}m
              </span>
            </div>

            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-900/60">
              <span className="text-emerald-400 font-semibold block mb-0.5">Optimal Soil pH:</span>
              <span className="text-white font-mono">{activeCropScore.optimalPhRange}</span>
              <span className="block text-[11px] text-emerald-300/80 mt-1">
                Your soil: {profile.soil.standardPh} pH ({profile.soil.rawDecicentsPh} decicents)
              </span>
            </div>

            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-900/60">
              <span className="text-emerald-400 font-semibold block mb-0.5">Optimal Rainfall:</span>
              <span className="text-white font-mono">{activeCropScore.optimalRainfallRange}</span>
              <span className="block text-[11px] text-emerald-300/80 mt-1">
                Local average: {profile.climate.historical.annualRainfallEstimatedMm}mm
              </span>
            </div>
          </div>

          {/* Model Reasoning Breakdown */}
          <div className="space-y-2 pt-1 text-xs">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide block">
              Random Forest Decision Path Findings:
            </span>
            <div className="space-y-1.5">
              {activeCropScore.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
              {activeCropScore.limitingFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Random Forest Model Explanation Modal */}
      {showTreeLogicModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b2419] border border-emerald-700 max-w-xl w-full rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <TreeDeciduous className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base font-display">
                  Random Forest Predictive Logic Architecture
                </h3>
              </div>
              <button
                onClick={() => setShowTreeLogicModal(false)}
                className="text-emerald-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-emerald-200 leading-relaxed">
              The classification engine runs a calibrated 100-decision-tree ensemble modeling the agronomic thresholds of Nakuru County's high elevation zones (~1700m - 2000m). Trees evaluate four primary feature vectors derived from live satellite & GIS APIs:
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80">
                <div className="flex justify-between font-semibold text-white">
                  <span>1. Elevation ASL (Gini Importance: 38%)</span>
                  <span className="text-emerald-400 font-mono">Primary Split</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  Determines chilling hours and thermal thresholds. Pyrethrum and Irish Potatoes thrive at &gt;1850m, whereas Maize dominates between 1700m-1900m.
                </p>
              </div>

              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80">
                <div className="flex justify-between font-semibold text-white">
                  <span>2. Rainfall & Seasonality (Gini Importance: 29%)</span>
                  <span className="text-emerald-400 font-mono">Bimodal Mode</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  Models Long Rains (Masika: March-May) vs Short Rains (Vuli: Oct-Dec). Short-cycle Beans (75 days) receive high scores when approaching dry spells.
                </p>
              </div>

              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80">
                <div className="flex justify-between font-semibold text-white">
                  <span>3. Surface Soil pH (Gini Importance: 19%)</span>
                  <span className="text-emerald-400 font-mono">ISRIC Converted</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  Converts raw decicents (e.g. 62) to standard pH (6.2). Moderately acidic soils (5.2 - 6.2) favor Irish Potatoes by reducing common scab.
                </p>
              </div>

              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80">
                <div className="flex justify-between font-semibold text-white">
                  <span>4. Soil Organic Carbon SOC (Gini Importance: 14%)</span>
                  <span className="text-emerald-400 font-mono">Volcanic Silt</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  Evaluates cation exchange capacity and water holding capacity of Rift Valley volcanic ash silts.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-900/60 flex justify-end">
              <button
                onClick={() => setShowTreeLogicModal(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
