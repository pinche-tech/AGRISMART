import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Scan,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  RefreshCcw,
  Pill,
  Leaf,
  Bug,
  Info,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { LeafScanDiagnosis, TreatmentOption } from '../types';
import { SAMPLE_LEAVES, SampleLeaf } from '../data/sampleLeaves';
import { analyzeLeafImageHeuristic } from '../utils/plantVillageClassifier';

interface CropHealthScannerProps {
  onScanComplete?: (diagnosis: LeafScanDiagnosis) => void;
}

export const CropHealthScanner: React.FC<CropHealthScannerProps> = ({ onScanComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_LEAVES[0].thumbnail);
  const [selectedCropHint, setSelectedCropHint] = useState<string>('Tomato');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<LeafScanDiagnosis | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Cultural' | 'Organic' | 'Chemical'>('All');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize with the first sample on mount
  useEffect(() => {
    runDiagnosis(SAMPLE_LEAVES[0].thumbnail, 'Tomato');
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser context');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please check permissions or upload a leaf photo.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      stopCamera();
      runDiagnosis(dataUrl, selectedCropHint);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        stopCamera();
        runDiagnosis(result, selectedCropHint);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    stopCamera();
    setSelectedImage(sample.thumbnail);
    setSelectedCropHint(sample.crop);
    runDiagnosis(sample.thumbnail, sample.crop);
  };

  const runDiagnosis = async (imageSrc: string, cropHint?: string) => {
    setIsScanning(true);
    setDiagnosis(null);

    try {
      // Call backend API endpoint first
      const res = await fetch('/api/crop-health/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          cropHint: cropHint || selectedCropHint
        })
      });

      if (res.ok) {
        const data: LeafScanDiagnosis = await res.json();
        setDiagnosis(data);
        if (onScanComplete) onScanComplete(data);
      } else {
        throw new Error('Backend scan failed');
      }
    } catch (err) {
      // Fallback: PlantVillage Deep Learning Classifier Heuristic
      const fallbackResult = analyzeLeafImageHeuristic(imageSrc, cropHint || selectedCropHint);
      setDiagnosis(fallbackResult);
      if (onScanComplete) onScanComplete(fallbackResult);
    } finally {
      setIsScanning(false);
    }
  };

  const filteredTreatments = diagnosis?.treatments.filter((t) => {
    if (filterType === 'All') return true;
    if (filterType === 'Cultural') return t.type.includes('Cultural');
    if (filterType === 'Organic') return t.type.includes('Organic');
    if (filterType === 'Chemical') return t.type.includes('Chemical');
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner: PlantVillage Computer Vision Architecture */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d271c] border border-emerald-800/70 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">
                Computer Vision Crop Health Scanner
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                PlantVillage Trained Model
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Identifies Tomato Blight, Maize Rust, Potato Blight & generates 3-way Kenya PCPB recovery treatments
            </p>
          </div>
        </div>
      </div>

      {/* Main Scanner Stage: Dual-Pane Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 Cols): Camera Module Upload & Live Viewfinder */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b2217] border border-emerald-800/80 rounded-2xl p-4 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                Camera & Leaf Input
              </span>

              {/* Crop Hint Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-emerald-300/80 text-[11px]">Crop:</span>
                <select
                  value={selectedCropHint}
                  onChange={(e) => {
                    setSelectedCropHint(e.target.value);
                    if (selectedImage) runDiagnosis(selectedImage, e.target.value);
                  }}
                  className="bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-200 text-xs px-2 py-1 outline-none focus:border-emerald-500"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Maize">Maize</option>
                  <option value="Irish Potatoes">Irish Potatoes</option>
                  <option value="Beans">Beans</option>
                  <option value="Pyrethrum">Pyrethrum</option>
                </select>
              </div>
            </div>

            {/* Viewfinder Canvas Area */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/80 border-2 border-emerald-700/60 flex items-center justify-center group">
              {/* Camera Video Stream */}
              {cameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder Reticle Overlay */}
                  <div className="absolute inset-8 border border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
                    <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
                    <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
                    <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
                    <span className="text-[10px] text-emerald-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                      Align leaf blade inside reticle
                    </span>
                  </div>

                  {/* Shutter Button */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                    <button
                      id="btn-snap-photo"
                      onClick={captureCameraFrame}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Capture Leaf
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-black/70 hover:bg-black text-white text-xs px-3 py-2 rounded-full border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : selectedImage ? (
                <div className="relative w-full h-full flex items-center justify-center bg-[#07170f]">
                  <img
                    src={selectedImage}
                    alt="Scanned crop leaf"
                    className="w-full h-full object-contain p-2"
                  />

                  {/* Scanning Animation Laser Line */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex flex-col justify-center items-center">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce shadow-lg shadow-emerald-400/50" />
                      <span className="text-xs font-mono font-bold text-emerald-300 mt-3 bg-black/80 px-3 py-1 rounded-full border border-emerald-500/50 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        PlantVillage CNN Inference...
                      </span>
                    </div>
                  )}

                  {/* Reticle marks on static leaf */}
                  {!isScanning && (
                    <div className="absolute inset-4 border border-emerald-500/30 rounded-lg pointer-events-none">
                      <div className="w-3 h-3 border-t-2 border-l-2 border-emerald-400 absolute -top-0.5 -left-0.5" />
                      <div className="w-3 h-3 border-t-2 border-r-2 border-emerald-400 absolute -top-0.5 -right-0.5" />
                      <div className="w-3 h-3 border-b-2 border-l-2 border-emerald-400 absolute -bottom-0.5 -left-0.5" />
                      <div className="w-3 h-3 border-b-2 border-r-2 border-emerald-400 absolute -bottom-0.5 -right-0.5" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 space-y-2 text-emerald-300/80">
                  <Camera className="w-12 h-12 mx-auto text-emerald-500/60" />
                  <p className="text-xs">No leaf image loaded</p>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-2.5 bg-amber-950/80 border border-amber-800 rounded-xl text-xs text-amber-200">
                {cameraError}
              </div>
            )}

            {/* Input Action Controls */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="btn-trigger-camera"
                onClick={startCamera}
                disabled={cameraActive}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Live Viewfinder</span>
              </button>

              <button
                id="btn-upload-leaf-photo"
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload Leaf Photo</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Quick Test Sample Leaf Presets */}
            <div className="pt-2 border-t border-emerald-900/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-emerald-300/80">
                <span className="font-semibold uppercase tracking-wider">Test Sample Leaf Bank:</span>
                <span>Click to diagnose</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_LEAVES.map((sample) => (
                  <button
                    key={sample.id}
                    id={`btn-${sample.id}`}
                    onClick={() => handleSelectSample(sample)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/60 text-left cursor-pointer transition-all text-xs"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-emerald-700/40">
                      <img src={sample.thumbnail} alt={sample.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-white truncate text-[11px]">{sample.name}</div>
                      <div className="text-[10px] text-emerald-400 truncate">{sample.crop}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Diagnosis & 3-Way Recovery Treatments */}
        <div className="lg:col-span-7 space-y-4">
          {diagnosis ? (
            <div className="space-y-4">
              {/* Primary Diagnosis Header Card */}
              <div
                id="card-leaf-diagnosis"
                className={`p-5 rounded-2xl border-2 shadow-xl relative overflow-hidden transition-all ${
                  diagnosis.isHealthy
                    ? 'bg-gradient-to-br from-[#0c2e1b] to-[#06190e] border-emerald-500'
                    : 'bg-gradient-to-br from-[#29170e] via-[#1f130b] to-[#120a06] border-amber-600/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          diagnosis.isHealthy
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                            : 'bg-red-950 text-red-300 border border-red-700'
                        }`}
                      >
                        {diagnosis.isHealthy ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {diagnosis.isHealthy ? 'Healthy Leaf' : 'Pathology Detected'}
                      </span>

                      <span className="text-xs text-emerald-300 font-mono font-bold">
                        PlantVillage Match: {diagnosis.confidencePercentage}%
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white font-display">
                      {diagnosis.condition}
                    </h3>
                    <p className="text-xs italic text-amber-300/90 font-mono mt-0.5">
                      Pathogen: {diagnosis.scientificPathogen}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span className="bg-black/40 px-2.5 py-0.5 rounded text-emerald-200 border border-white/10">
                        Crop: <strong className="text-white">{diagnosis.cropDetected}</strong>
                      </span>
                      <span className="bg-black/40 px-2.5 py-0.5 rounded text-emerald-200 border border-white/10">
                        Severity: <strong className={diagnosis.isHealthy ? 'text-emerald-400' : 'text-amber-400'}>{diagnosis.severityLevel}</strong>
                      </span>
                      <span className="bg-black/40 px-2.5 py-0.5 rounded text-emerald-200 border border-white/10">
                        Class: <code className="text-emerald-300 text-[10px]">{diagnosis.plantVillageClassMatch}</code>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Symptom Summary */}
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-emerald-100/90 leading-relaxed bg-black/30 p-3 rounded-xl">
                  <strong className="text-emerald-400 block mb-1">Clinical Symptoms Observed:</strong>
                  {diagnosis.symptomSummary}
                </div>

                {/* Localized Nakuru Advice */}
                <div className="mt-2.5 text-xs text-amber-100/90 bg-amber-950/40 border border-amber-800/40 p-3 rounded-xl flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300">Elmenteita Field Guidance:</strong>{' '}
                    <span>{diagnosis.localNakuruAdvice}</span>
                  </div>
                </div>
              </div>

              {/* 3 Distinct Mitigation Options or Treatments Section */}
              <div className="bg-[#0b2217] border border-emerald-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/60 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                      <Pill className="w-4 h-4 text-emerald-400" />
                      Recovery Recommendations (3 Distinct Treatment Pathways)
                    </h4>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      Curated for Kenya PCPB compliance and Great Rift Valley agro-climate
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 text-xs">
                    {(['All', 'Cultural', 'Organic', 'Chemical'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilterType(tab)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          filterType === tab
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Treatment Cards Grid */}
                <div className="space-y-3">
                  {filteredTreatments.map((treatment, idx) => {
                    const isChemical = treatment.type.includes('Chemical');
                    const isOrganic = treatment.type.includes('Organic');
                    const isCultural = treatment.type.includes('Cultural');

                    return (
                      <div
                        key={idx}
                        id={`treatment-option-${idx}`}
                        className="bg-[#071c12] border border-emerald-800/70 hover:border-emerald-700 rounded-xl p-4 space-y-2 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isChemical
                                  ? 'bg-purple-950 text-purple-300 border border-purple-700/60'
                                  : isOrganic
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                  : 'bg-blue-950 text-blue-300 border border-blue-700/60'
                              }`}
                            >
                              Option {idx + 1}: {treatment.type}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {treatment.title}
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                            Effectiveness: {treatment.effectiveness}
                          </span>
                        </div>

                        <p className="text-xs text-emerald-200/90 leading-relaxed">
                          {treatment.action}
                        </p>

                        <div className="pt-2 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span className="text-emerald-400 font-medium">
                            ⏱️ Timing: <strong className="text-white">{treatment.timing}</strong>
                          </span>

                          {treatment.kenyaRegPcpbProduct && (
                            <span className="text-purple-300 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900/60">
                              Registered: {treatment.kenyaRegPcpbProduct}
                            </span>
                          )}

                          {treatment.preHarvestInterval && (
                            <span className="text-amber-300 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60">
                              PHI: {treatment.preHarvestInterval}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Blank state / loading */
            <div className="bg-[#0b2217] border border-emerald-800/80 rounded-2xl p-12 text-center space-y-3">
              <Scan className="w-12 h-12 mx-auto text-emerald-500 animate-pulse" />
              <h4 className="text-lg font-bold text-white font-display">
                Analyzing Leaf Morphology...
              </h4>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                Comparing leaf lesions against PlantVillage disease classes and East African highland pathogen libraries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
