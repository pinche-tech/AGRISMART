import React from 'react';
import {
  Layers,
  Droplets,
  CloudRain,
  Thermometer,
  Gauge,
  Compass,
  ArrowUpRight,
  Info,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { EnvironmentalProfile } from '../types';

interface SoilClimateDeepDiveProps {
  profile: EnvironmentalProfile;
}

export const SoilClimateDeepDive: React.FC<SoilClimateDeepDiveProps> = ({ profile }) => {
  const { soil, climate, elevation, location } = profile;
  const daily = climate.daily;

  return (
    <div className="space-y-5">
      {/* Overview Card: ISRIC SoilGrids Decicents & Rift Valley Soil Metrics */}
      <div className="bg-[#0b2217] border border-emerald-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                ISRIC SoilGrids REST API v2.0 Profiling
              </h3>
              <p className="text-xs text-emerald-300 font-medium">
                Surface layer (0-5cm & 5-15cm) volcanic silt estimations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[11px]">
              Source: {soil.dataSource}
            </span>
          </div>
        </div>

        {/* The Decicent-to-Standard pH Conversion Explainer */}
        <div className="bg-emerald-950/60 border border-emerald-800/70 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <Gauge className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-sm font-bold text-white">
                  Decicent-to-Standard Unit pH Conversion
                </h4>
                <span className="text-[10px] font-mono bg-emerald-900/90 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
                  Standardized ISRIC Protocol
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                The ISRIC SoilGrids REST endpoint measures soil pH in <strong className="text-amber-400">decicents (pH &times; 10)</strong>.
                For this Elmenteita coordinate (<span className="text-emerald-300 font-mono">{location.latitude.toFixed(4)}°S, {location.longitude.toFixed(4)}°E</span>),
                the raw decicent value of <strong className="text-amber-400 font-mono">{soil.rawDecicentsPh} decicents</strong> was fetched and converted to
                standard <strong className="text-white font-mono">{soil.standardPh} pH units</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-900/60 text-xs">
            <div className="bg-[#06180f] p-3 rounded-lg border border-emerald-900/60">
              <span className="text-emerald-400 block text-[11px] uppercase font-semibold">Raw ISRIC Value</span>
              <span className="text-lg font-black text-amber-400 font-mono">{soil.rawDecicentsPh}</span>
              <span className="text-[10px] text-emerald-300/70 block">decicents (pH &times; 10)</span>
            </div>

            <div className="bg-[#06180f] p-3 rounded-lg border border-emerald-900/60">
              <span className="text-emerald-400 block text-[11px] uppercase font-semibold">Converted pH</span>
              <span className="text-lg font-black text-white font-mono">{soil.standardPh}</span>
              <span className="text-[10px] text-emerald-300/70 block">Standard pH units</span>
            </div>

            <div className="bg-[#06180f] p-3 rounded-lg border border-emerald-900/60">
              <span className="text-emerald-400 block text-[11px] uppercase font-semibold">Agronomic Status</span>
              <span className="text-sm font-bold text-emerald-300">{soil.phClassification}</span>
              <span className="text-[10px] text-emerald-300/70 block">Ideal for Rift Valley legumes & tubers</span>
            </div>
          </div>
        </div>

        {/* Volcanic Silt Soil Texture Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/60 space-y-2.5">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide block">
              Volcanic Silt Soil Fraction Distribution
            </span>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-200">Silt Content (Fine Pyroclastic Ash)</span>
                  <span className="font-mono font-bold text-emerald-400">{soil.siltContentPercent}%</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${soil.siltContentPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-200">Sand Fraction (Volcanic Tuff Particles)</span>
                  <span className="font-mono font-bold text-emerald-400">{soil.sandContentPercent}%</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${soil.sandContentPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-200">Clay Fraction (Weathered Smectite/Allophane)</span>
                  <span className="font-mono font-bold text-emerald-400">{soil.clayContentPercent}%</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${soil.clayContentPercent}%` }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-300/80 pt-2 border-t border-emerald-900/60">
              Texture: <strong className="text-white">{soil.soilTextureClass}</strong>. Provides exceptional moisture retention without waterlogging.
            </p>
          </div>

          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/60 space-y-2.5">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide block">
              Soil Organic Carbon (SOC) Fertility Metrics
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#06180f] p-2.5 rounded-lg">
                <span className="text-[10px] text-emerald-400/80 uppercase">Raw ISRIC SOC</span>
                <div className="text-base font-bold font-mono text-white">{soil.organicCarbonDgKg} dg/kg</div>
                <span className="text-[10px] text-emerald-400/70">decigrams/kilogram</span>
              </div>

              <div className="bg-[#06180f] p-2.5 rounded-lg">
                <span className="text-[10px] text-emerald-400/80 uppercase">Standard Unit</span>
                <div className="text-base font-bold font-mono text-emerald-400">{soil.organicCarbonGKg} g/kg</div>
                <span className="text-[10px] text-emerald-300">({soil.organicCarbonPercentage}% organic matter)</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-950/80 rounded-lg border border-emerald-800/60 text-[11px] text-emerald-200">
              <strong className="text-emerald-300">Fertility Index: {soil.fertilityRating}</strong>. High cation exchange capacity ensures sustained micronutrient availability for maize and potato roots.
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Open-Meteo Microclimatic Weather & Rain Forecast */}
      <div className="bg-[#0b2217] border border-emerald-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-display">
              7-Day Open-Meteo Microclimate & Rain Forecast
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono">
            {location.subCounty}, Elmenteita
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {daily.time.slice(0, 7).map((dateStr, idx) => {
            const max = daily.temperatureMax[idx] ?? 23;
            const min = daily.temperatureMin[idx] ?? 13;
            const rainSum = daily.precipitationSum[idx] ?? 0;
            const rainProb = daily.precipitationProbability[idx] ?? 20;

            const dateObj = new Date(dateStr);
            const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayMonth = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div
                key={dateStr}
                className="bg-[#071c12] border border-emerald-800/60 rounded-xl p-3 text-center space-y-2 transition-all hover:border-emerald-600"
              >
                <div>
                  <div className="font-bold text-white text-xs">{dayName}</div>
                  <div className="text-[10px] text-emerald-400/80 font-mono">{dayMonth}</div>
                </div>

                <div className="py-1">
                  <div className="text-base font-extrabold text-white font-mono">{max.toFixed(0)}°</div>
                  <div className="text-[11px] text-emerald-400/80 font-mono">{min.toFixed(0)}° min</div>
                </div>

                <div className="pt-1.5 border-t border-emerald-900/60 text-[10px] text-emerald-200">
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-emerald-400" />
                    <span>{rainProb}%</span>
                  </div>
                  <div className="font-mono text-emerald-400 mt-0.5">
                    {rainSum > 0 ? `${rainSum.toFixed(1)}mm` : 'Dry'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
