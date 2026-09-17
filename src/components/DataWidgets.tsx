import React from 'react';
import {
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
  Layers,
  Mountain,
  Gauge,
  Sparkles,
  Info,
  CalendarDays,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { EnvironmentalProfile } from '../types';

interface DataWidgetsProps {
  profile: EnvironmentalProfile;
  loading: boolean;
}

export const DataWidgets: React.FC<DataWidgetsProps> = ({ profile, loading }) => {
  const { climate, soil, elevation } = profile;
  const current = climate.current;
  const historical = climate.historical;

  // Determine pH meter position (pH scale 4.0 to 9.0)
  const phClamped = Math.max(4.0, Math.min(9.0, soil.standardPh));
  const phPercent = ((phClamped - 4.0) / (9.0 - 4.0)) * 100;

  return (
    <div className="space-y-4">
      {/* 4 Core Scannable Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Widget 1: Real-Time Weather & Microclimate */}
        <div
          id="widget-weather"
          className="bg-[#0e271c] border border-emerald-800/60 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:border-emerald-700/80"
        >
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-emerald-400" />
              Microclimate Weather
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Open-Meteo
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div>
              <div className="text-3xl font-extrabold text-white font-display tracking-tight">
                {current.temperature.toFixed(1)}°C
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5 font-medium">
                Feels like {current.apparentTemperature.toFixed(1)}°C • {current.weatherDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-900/60 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Droplets className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Humidity: <strong>{current.relativeHumidity}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Wind: <strong>{current.windSpeed} km/h</strong></span>
            </div>
          </div>
        </div>

        {/* Widget 2: Elevation & Agro-Ecological Zone */}
        <div
          id="widget-elevation"
          className="bg-[#0e271c] border border-emerald-800/60 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:border-emerald-700/80"
        >
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-emerald-400" />
              Elevation & Topography
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              GPS Native
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div>
              <div className="text-3xl font-extrabold text-white font-display tracking-tight font-mono">
                {Math.round(elevation)}
                <span className="text-sm font-sans font-medium text-emerald-400 ml-1">meters ASL</span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5 font-medium">
                {elevation >= 1950
                  ? 'Upper Escarpment Zone (Cool nights, high mist)'
                  : elevation >= 1800
                  ? 'Mid-Plateau Volcanic Belt (Optimal maize/potato)'
                  : 'Rift Floor Basin (Mild thermal lake basin)'}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-xs text-emerald-200">
            <span>AEZ: <strong>{elevation > 1900 ? 'Lower Highland (LH2)' : 'Upper Midland (UM3/UM4)'}</strong></span>
            <span className="text-emerald-400 text-[11px] font-medium">Great Rift Valley</span>
          </div>
        </div>

        {/* Widget 3: Soil pH (Raw Decicents to Standard Conversion) */}
        <div
          id="widget-soil-ph"
          className="bg-[#0e271c] border border-emerald-800/60 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:border-emerald-700/80"
        >
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Surface Soil pH
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              ISRIC SoilGrids
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-display tracking-tight font-mono">
                  {soil.standardPh.toFixed(1)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-medium">
                  {soil.phClassification}
                </span>
              </div>
              <div className="text-[11px] text-emerald-300/80 mt-0.5 flex items-center gap-1 font-mono">
                <span>Raw ISRIC:</span>
                <span className="text-amber-400 font-bold">{soil.rawDecicentsPh} decicents</span>
                <span className="text-emerald-500 text-[10px]">(&divide;10 = {soil.standardPh} pH)</span>
              </div>
            </div>
          </div>

          {/* Visual pH Bar */}
          <div className="mt-3 pt-2.5 border-t border-emerald-900/60">
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 to-blue-500 relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-900 shadow-md transform -translate-x-1/2 transition-all duration-500"
                style={{ left: `${phPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-emerald-400/80 mt-1 font-mono">
              <span>4.0 Acidic</span>
              <span className="text-emerald-300 font-bold">6.5 Neutral</span>
              <span>9.0 Alkaline</span>
            </div>
          </div>
        </div>

        {/* Widget 4: Soil Moisture & Volcanic Organic Carbon */}
        <div
          id="widget-soil-moisture"
          className="bg-[#0e271c] border border-emerald-800/60 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:border-emerald-700/80"
        >
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Moisture & Carbon (SOC)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Rift Volcanic
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div>
              <div className="text-3xl font-extrabold text-white font-display tracking-tight font-mono">
                {soil.soilMoisturePercent.toFixed(0)}%
                <span className="text-xs font-sans text-emerald-400 font-normal ml-1.5">root moisture</span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5 font-medium">
                Organic Carbon: <strong className="text-white">{soil.organicCarbonGKg.toFixed(1)} g/kg</strong> ({soil.organicCarbonPercentage}%)
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-xs text-emerald-200">
            <span>Fertility: <strong className="text-emerald-400">{soil.fertilityRating}</strong></span>
            <span className="text-[11px] text-emerald-300/90 truncate max-w-[130px]" title={soil.soilTextureClass}>
              {soil.soilTextureClass.split(' ')[0]} Silt Loam
            </span>
          </div>
        </div>
      </div>

      {/* Geological & Rainfall Context Strip */}
      <div className="bg-[#091e15] border border-emerald-900/80 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-900/60 flex items-center justify-center text-emerald-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="text-emerald-200 font-medium">
              Geological Bedrock Profile:
            </span>{' '}
            <span className="text-white font-semibold">{soil.volcanicOrigin}</span>
            <span className="text-emerald-400/80 ml-2 hidden sm:inline">
              (Silt: {soil.siltContentPercent}%, Sand: {soil.sandContentPercent}%, Clay: {soil.clayContentPercent}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-emerald-300 font-mono text-[11px]">
          <span>Annual Rain Avg: <strong className="text-white">{historical.annualRainfallEstimatedMm}mm</strong></span>
          <span className="text-emerald-800">•</span>
          <span>Long Rains (M-M): <strong className="text-emerald-400">{historical.longRainsAvgMm}mm</strong></span>
        </div>
      </div>
    </div>
  );
};
