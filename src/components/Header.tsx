import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Navigation2,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { GeoLocation, EnvironmentalProfile } from '../types';
import { ELMENTEITA_PRESETS, NakuruLocationPreset } from '../data/elmenteitaLocations';

interface HeaderProps {
  profile: EnvironmentalProfile | null;
  loading: boolean;
  onRefresh: () => void;
  onSelectPreset: (preset: NakuruLocationPreset) => void;
  onUseNativeGps: () => void;
  gpsActive: boolean;
  gpsError: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  loading,
  onRefresh,
  onSelectPreset,
  onUseNativeGps,
  gpsActive,
  gpsError
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <header className="bg-[#0b1f15] border-b border-emerald-900/60 sticky top-0 z-30 shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Region Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-md shadow-emerald-900/40 text-white font-black text-xl tracking-tight border border-emerald-400/30">
                🌿
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                    AgriSmart <span className="text-emerald-400">Nakuru</span>
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                    Elmenteita Edition
                  </span>
                </div>
                <p className="text-xs text-emerald-200/70 font-medium">
                  Precision Agro-Geological Profiling • Rift Valley Kenya
                </p>
              </div>
            </div>

            {/* Mobile quick-refresh button */}
            <div className="sm:hidden flex items-center gap-2">
              <button
                id="btn-mobile-refresh"
                onClick={onRefresh}
                disabled={loading}
                aria-label="Refresh agricultural data"
                className="p-2 rounded-lg bg-emerald-950 text-emerald-300 hover:text-white border border-emerald-800 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Location & GPS Action Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Location selector dropdown button */}
            <button
              id="btn-location-selector"
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-800/80 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold max-w-[170px] truncate">
                {profile ? profile.location.locationName : 'Elmenteita Basin'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
            </button>

            {/* GPS capture trigger */}
            <button
              id="btn-native-gps"
              onClick={onUseNativeGps}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                gpsActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/60'
              }`}
            >
              <Navigation2 className={`w-3.5 h-3.5 ${gpsActive ? 'text-white' : 'text-emerald-400'}`} />
              <span>{gpsActive ? 'GPS Active' : 'Native GPS'}</span>
            </button>

            {/* Desktop Refresh */}
            <button
              id="btn-desktop-refresh"
              onClick={onRefresh}
              disabled={loading}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-800/80 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
              <span>{loading ? 'Querying APIs...' : 'Sync Data'}</span>
            </button>
          </div>
        </div>

        {/* GPS Coordinates & Altitude Banner */}
        {profile && (
          <div className="mt-2.5 pt-2 border-t border-emerald-900/40 flex flex-wrap items-center justify-between text-[11px] text-emerald-300/80 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono">
                  {profile.location.latitude.toFixed(4)}°S, {profile.location.longitude.toFixed(4)}°E
                </span>
              </span>
              <span className="text-emerald-700 hidden sm:inline">•</span>
              <span>
                Elevation: <strong className="text-white font-mono">{Math.round(profile.elevation)}m</strong> ASL
              </span>
              <span className="text-emerald-700 hidden sm:inline">•</span>
              <span className="text-emerald-200">
                Zone: <span className="text-white">{profile.climate.historical.microclimateCategory}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Open-Meteo & SoilGrids Connected
              </span>
            </div>
          </div>
        )}

        {gpsError && (
          <div className="mt-2 bg-amber-950/80 border border-amber-800/60 rounded-lg px-3 py-1.5 text-xs text-amber-200 flex items-center justify-between">
            <span>{gpsError}</span>
            <span className="text-[10px] text-amber-400">Using Elmenteita default</span>
          </div>
        )}
      </div>

      {/* Elmenteita Sub-Location Picker Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d261b] border border-emerald-700/60 rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Select Elmenteita Farm Zone</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-emerald-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-emerald-200/80 my-3">
              Nakuru County features distinctive elevation gradients (~1700m to 2150m) between the lake basin floor and the eastern escarpments, directly impacting rainfall and soil pH.
            </p>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {ELMENTEITA_PRESETS.map((preset) => {
                const isSelected =
                  profile &&
                  Math.abs(profile.location.latitude - preset.latitude) < 0.01 &&
                  Math.abs(profile.location.longitude - preset.longitude) < 0.01;

                return (
                  <button
                    key={preset.id}
                    id={`preset-${preset.id}`}
                    onClick={() => {
                      onSelectPreset(preset);
                      setShowLocationModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-900/60 border-emerald-400 text-white'
                        : 'bg-emerald-950/40 hover:bg-emerald-900/40 border-emerald-800/60 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                        {preset.name}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        ~{preset.nominalElevation}m ASL
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/80 mt-1">{preset.description}</p>
                    <div className="mt-2 text-[11px] text-emerald-400/90 font-medium">
                      🌾 Typical: {preset.predominantFarming}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center justify-between">
              <button
                onClick={() => {
                  onUseNativeGps();
                  setShowLocationModal(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Navigation2 className="w-4 h-4" />
                Trigger Live Device GPS Geolocation
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
