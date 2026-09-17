import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sprout,
  Scan,
  Layers,
  RefreshCw,
  AlertCircle,
  Activity,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin
} from 'lucide-react';
import { EnvironmentalProfile, CropRecommendationResult, LeafScanDiagnosis } from './types';
import { runRandomForestCropRecommendation } from './utils/randomForestClassifier';
import { ELMENTEITA_PRESETS, NakuruLocationPreset } from './data/elmenteitaLocations';
import { Header } from './components/Header';
import { DataWidgets } from './components/DataWidgets';
import { MachineLearningCropDashboard } from './components/MachineLearningCropDashboard';
import { CropHealthScanner } from './components/CropHealthScanner';
import { SoilClimateDeepDive } from './components/SoilClimateDeepDive';

export default function App() {
  const [profile, setProfile] = useState<EnvironmentalProfile | null>(null);
  const [recommendation, setRecommendation] = useState<CropRecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendation' | 'scanner' | 'soilClimate'>('overview');

  // Load initial Elmenteita agricultural profile
  useEffect(() => {
    fetchProfile(-0.4485, 36.2415);
  }, []);

  const fetchProfile = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/location/profile?lat=${lat}&lon=${lon}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch agricultural profile (HTTP ${res.status})`);
      }
      const data: EnvironmentalProfile = await res.json();
      setProfile(data);

      // Run Machine Learning Random Forest Crop Recommendation
      const mlResult = runRandomForestCropRecommendation(data);
      setRecommendation(mlResult);
    } catch (err: any) {
      console.error('Error fetching agricultural profile:', err);
      setError(err.message || 'Unable to connect to agricultural profile service');
    } finally {
      setLoading(false);
    }
  };

  // Native Device GPS Geolocation
  const handleUseNativeGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsActive(true);
        fetchProfile(latitude, longitude);
      },
      (err) => {
        console.warn('Native GPS capture failed:', err);
        setGpsActive(false);
        setGpsError(
          err.code === 1
            ? 'Location permission denied. You can select an Elmenteita preset zone above.'
            : 'Unable to acquire precise GPS fix. Using Elmenteita default coordinates.'
        );
        // Fallback to Elmenteita Kasambara Basin
        fetchProfile(-0.4485, 36.2415);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSelectPreset = (preset: NakuruLocationPreset) => {
    setGpsActive(false);
    setGpsError(null);
    fetchProfile(preset.latitude, preset.longitude);
  };

  const handleRefresh = () => {
    if (profile) {
      fetchProfile(profile.location.latitude, profile.location.longitude);
    } else {
      fetchProfile(-0.4485, 36.2415);
    }
  };

  return (
    <div className="min-h-screen bg-[#06160e] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Header & GPS Status */}
      <Header
        profile={profile}
        loading={loading}
        onRefresh={handleRefresh}
        onSelectPreset={handleSelectPreset}
        onUseNativeGps={handleUseNativeGps}
        gpsActive={gpsActive}
        gpsError={gpsError}
      />

      {/* Primary Mobile Navigation Tab Strip */}
      <div className="bg-[#091f15] border-b border-emerald-900/80 sticky top-[65px] sm:top-[73px] z-20 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Field Dashboard</span>
            </button>

            <button
              id="tab-recommendation"
              onClick={() => setActiveTab('recommendation')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'recommendation'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>ML Crop Advisory</span>
              {recommendation && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 hidden sm:inline">
                  {recommendation.topRecommendedCrop}
                </span>
              )}
            </button>

            <button
              id="tab-scanner"
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Leaf Health Scanner</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              id="tab-soil-climate"
              onClick={() => setActiveTab('soilClimate')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'soilClimate'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Soil & Climate Deep Dive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Global Loading Bar */}
        {loading && !profile && (
          <div className="bg-[#0b2419] border border-emerald-800 rounded-2xl p-12 text-center space-y-3 shadow-xl">
            <RefreshCw className="w-10 h-10 mx-auto text-emerald-400 animate-spin" />
            <h3 className="text-lg font-bold text-white font-display">
              Initializing AgriSmart Profiling for Elmenteita...
            </h3>
            <p className="text-xs text-emerald-300/80 max-w-md mx-auto">
              Connecting to Open-Meteo microclimate server and ISRIC SoilGrids REST API v2.0 for surface soil pH & organic carbon metrics.
            </p>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-950/80 border border-red-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded-lg font-medium text-xs shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {profile && (
          <>
            {/* View 1: Overview Dashboard */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* 4 Core Scannable Widgets */}
                <DataWidgets profile={profile} loading={loading} />

                {/* Quick Recommendation Highlight Card */}
                {recommendation && (
                  <div className="bg-[#0d271c] border border-emerald-800/80 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                          Predictive Intelligence Result
                        </span>
                        <h3 className="text-xl font-black text-white font-display">
                          Recommended Crop for Current Profile: {recommendation.topRecommendedCrop}
                        </h3>
                        <p className="text-xs text-emerald-300">
                          {recommendation.variety} • Confidence: {recommendation.confidenceScore}%
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('recommendation')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm transition-all"
                      >
                        <span>Full Agronomic Schedule</span>
                        <Sprout className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#071c12] p-3 rounded-xl border border-emerald-900/60">
                        <span className="text-emerald-400 font-bold block mb-1">
                          📅 Dynamic Planting Window:
                        </span>
                        <span className="text-white font-mono font-bold">
                          {recommendation.plantingWindow.startDate} to {recommendation.plantingWindow.endDate}
                        </span>
                        <span className="block text-emerald-300/80 text-[11px] mt-0.5">
                          {recommendation.plantingWindow.seasonName} ({recommendation.plantingWindow.status})
                        </span>
                      </div>

                      <div className="bg-[#071c12] p-3 rounded-xl border border-emerald-900/60">
                        <span className="text-emerald-400 font-bold block mb-1">
                          🎯 Target Harvesting Schedule:
                        </span>
                        <span className="text-white font-mono font-bold">
                          {recommendation.harvestingSchedule.targetHarvestStartDate} to {recommendation.harvestingSchedule.targetHarvestEndDate}
                        </span>
                        <span className="block text-emerald-300/80 text-[11px] mt-0.5">
                          Yield: {recommendation.harvestingSchedule.expectedYieldEstimate} (~{recommendation.harvestingSchedule.estimatedDaysToMaturity} days)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Scanner Launch Banner */}
                <div className="bg-gradient-to-r from-[#0d2a1d] via-[#0b2217] to-[#071910] border border-emerald-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Scan className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-display">
                        PlantVillage Leaf Disease & Pest Scanner
                      </h4>
                      <p className="text-xs text-emerald-300/80 mt-0.5">
                        Detect Tomato Blight, Maize Rust, and Potato Blight with instant 3-pathway recovery treatments.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shrink-0 cursor-pointer shadow-md transition-all"
                  >
                    <Scan className="w-4 h-4" />
                    <span>Launch Leaf Scanner</span>
                  </button>
                </div>
              </div>
            )}

            {/* View 2: Machine Learning Crop Recommendation */}
            {activeTab === 'recommendation' && recommendation && (
              <div className="animate-in fade-in duration-200">
                <MachineLearningCropDashboard
                  profile={profile}
                  recommendation={recommendation}
                  onRefreshMl={handleRefresh}
                />
              </div>
            )}

            {/* View 3: Computer Vision Crop Health Scanner */}
            {activeTab === 'scanner' && (
              <div className="animate-in fade-in duration-200">
                <CropHealthScanner />
              </div>
            )}

            {/* View 4: Soil & Climate Deep Dive */}
            {activeTab === 'soilClimate' && (
              <div className="animate-in fade-in duration-200">
                <SoilClimateDeepDive profile={profile} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Floating Action Bottom Bar */}
      <footer className="bg-[#05130b] border-t border-emerald-950 py-4 px-4 text-center text-xs text-emerald-400/60 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>
            AgriSmart Nakuru © {new Date().getFullYear()} • Elmenteita Agricultural Extension System
          </span>
          <div className="flex items-center gap-3">
            <span>ISRIC SoilGrids v2.0 REST</span>
            <span>•</span>
            <span>Open-Meteo WMO API</span>
            <span>•</span>
            <span>PlantVillage Dataset</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
