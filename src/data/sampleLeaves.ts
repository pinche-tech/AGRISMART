export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  diagnosis: string;
  expectedClass: string;
  thumbnail: string;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-tomato-blight',
    name: 'Tomato Blight Leaf',
    crop: 'Tomato',
    diagnosis: 'Tomato Late Blight (Phytophthora infestans)',
    expectedClass: 'Tomato___Late_blight',
    // High-resolution SVG data URI representing a diseased tomato leaf with water-soaked necrotic lesions and yellow halo
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
      <rect width="320" height="320" fill="%231a2e22" rx="16"/>
      <path d="M160 280 C155 230 150 170 145 70" stroke="%234d7c0f" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- Tomato leaf outline -->
      <path d="M150 80 C90 100 60 150 80 200 C95 240 140 260 160 270 C180 260 230 235 240 190 C250 140 215 95 150 80 Z" fill="%232d6a4f"/>
      <!-- Leaf veins -->
      <path d="M150 130 C120 120 90 140 80 160" stroke="%233a805c" stroke-width="2.5" fill="none"/>
      <path d="M155 170 C190 155 220 170 230 190" stroke="%233a805c" stroke-width="2.5" fill="none"/>
      <path d="M152 210 C120 205 100 220 95 235" stroke="%233a805c" stroke-width="2" fill="none"/>
      <!-- Late Blight Necrotic Lesions (water-soaked brown/black spots) -->
      <ellipse cx="120" cy="160" rx="28" ry="20" fill="%233a2312" opacity="0.95"/>
      <ellipse cx="120" cy="160" rx="33" ry="24" stroke="%23eab308" stroke-width="3" fill="none" opacity="0.8"/>
      <ellipse cx="190" cy="180" rx="24" ry="18" fill="%23261609" opacity="0.95"/>
      <ellipse cx="190" cy="180" rx="28" ry="22" stroke="%23eab308" stroke-width="3" fill="none" opacity="0.75"/>
      <ellipse cx="145" cy="110" rx="18" ry="14" fill="%233b2413" opacity="0.9"/>
      <!-- Powdery spores border -->
      <circle cx="105" cy="155" r="3" fill="%23f8fafc" opacity="0.7"/>
      <circle cx="112" cy="172" r="2.5" fill="%23f8fafc" opacity="0.7"/>
      <circle cx="132" cy="148" r="3" fill="%23f8fafc" opacity="0.8"/>
      <text x="160" y="305" fill="%23a7f3d0" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Sample: Tomato Late Blight</text>
    </svg>`
  },
  {
    id: 'sample-maize-rust',
    name: 'Maize Rust Leaf',
    crop: 'Maize',
    diagnosis: 'Maize Common Rust (Puccinia sorghi)',
    expectedClass: 'Corn_(maize)___Common_rust',
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
      <rect width="320" height="320" fill="%231a2e22" rx="16"/>
      <!-- Long Maize Blade -->
      <path d="M120 300 Q140 160 180 30 Q195 160 170 300 Z" fill="%233b7a57"/>
      <!-- Central rib -->
      <path d="M145 300 Q160 160 180 30" stroke="%236ee7b7" stroke-width="3" fill="none"/>
      <!-- Rust pustules (golden-cinnamon oval pustules) -->
      <g fill="%23c2410c">
        <ellipse cx="145" cy="90" rx="5" ry="8" transform="rotate(15 145 90)"/>
        <ellipse cx="160" cy="110" rx="6" ry="10" transform="rotate(-10 160 110)"/>
        <ellipse cx="150" cy="140" rx="7" ry="11" transform="rotate(5 150 140)"/>
        <ellipse cx="168" cy="165" rx="5" ry="9" transform="rotate(20 168 165)"/>
        <ellipse cx="140" cy="185" rx="6" ry="10" transform="rotate(-15 140 185)"/>
        <ellipse cx="158" cy="210" rx="7" ry="12" transform="rotate(10 158 210)"/>
        <ellipse cx="148" cy="245" rx="5" ry="8" transform="rotate(-5 148 245)"/>
      </g>
      <!-- Rust halos -->
      <g stroke="%23f59e0b" stroke-width="1.5" fill="none">
        <ellipse cx="145" cy="90" rx="7" ry="10"/>
        <ellipse cx="160" cy="110" rx="8" ry="12"/>
        <ellipse cx="150" cy="140" rx="9" ry="14"/>
        <ellipse cx="168" cy="165" rx="7" ry="11"/>
        <ellipse cx="158" cy="210" rx="9" ry="14"/>
      </g>
      <text x="160" y="305" fill="%23a7f3d0" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Sample: Maize Common Rust</text>
    </svg>`
  },
  {
    id: 'sample-potato-blight',
    name: 'Potato Blight Leaf',
    crop: 'Irish Potatoes',
    diagnosis: 'Potato Late Blight (Phytophthora infestans)',
    expectedClass: 'Potato___Late_blight',
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
      <rect width="320" height="320" fill="%231a2e22" rx="16"/>
      <!-- Potato compound leaf -->
      <path d="M160 280 L160 60" stroke="%23407040" stroke-width="5" fill="none"/>
      <!-- Terminal leaflet -->
      <ellipse cx="160" cy="90" rx="35" ry="48" fill="%232f6b48"/>
      <!-- Side leaflets -->
      <ellipse cx="105" cy="160" rx="30" ry="40" transform="rotate(-30 105 160)" fill="%232f6b48"/>
      <ellipse cx="215" cy="160" rx="30" ry="40" transform="rotate(30 215 160)" fill="%232f6b48"/>
      <ellipse cx="115" cy="230" rx="25" ry="35" transform="rotate(-35 115 230)" fill="%232f6b48"/>
      <ellipse cx="205" cy="230" rx="25" ry="35" transform="rotate(35 205 230)" fill="%232f6b48"/>
      <!-- Black rot blighted margins -->
      <path d="M140 70 Q170 50 190 85 Q170 105 155 90 Z" fill="%231e130a"/>
      <path d="M85 140 Q110 135 125 160 Q95 180 85 140 Z" fill="%231e130a"/>
      <path d="M225 150 Q240 170 220 190 Q200 170 225 150 Z" fill="%23261608"/>
      <circle cx="165" cy="80" r="2.5" fill="%23f1f5f9" opacity="0.8"/>
      <circle cx="175" cy="90" r="2" fill="%23f1f5f9" opacity="0.8"/>
      <text x="160" y="305" fill="%23a7f3d0" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Sample: Potato Late Blight</text>
    </svg>`
  },
  {
    id: 'sample-healthy-leaf',
    name: 'Healthy Maize / Bean Leaf',
    crop: 'Healthy Crop',
    diagnosis: 'Healthy Vigorous Leaf (No Pathogen)',
    expectedClass: 'Healthy_Crop___All',
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
      <rect width="320" height="320" fill="%231a2e22" rx="16"/>
      <!-- Healthy vibrant leaf -->
      <path d="M160 280 C155 200 150 150 150 50" stroke="%2315803d" stroke-width="5" fill="none"/>
      <path d="M150 50 C80 80 50 150 70 220 C85 260 130 275 160 280 C190 275 235 260 250 220 C270 150 240 80 150 50 Z" fill="%2316a34a"/>
      <!-- Clean healthy veins -->
      <path d="M150 110 C110 100 85 125 80 145" stroke="%2386efac" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M153 140 C195 130 220 155 225 175" stroke="%2386efac" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M152 180 C115 175 95 195 90 215" stroke="%2386efac" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M154 215 C190 210 210 225 215 240" stroke="%2386efac" stroke-width="1.8" fill="none" opacity="0.8"/>
      <!-- Healthy dewdrop glow -->
      <circle cx="175" cy="115" r="4" fill="%23ffffff" opacity="0.75"/>
      <circle cx="130" cy="190" r="3" fill="%23ffffff" opacity="0.6"/>
      <text x="160" y="305" fill="%23a7f3d0" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Sample: Healthy Plant Leaf</text>
    </svg>`
  }
];
