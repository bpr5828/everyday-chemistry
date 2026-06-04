import React, { useState } from 'react';
import { Home, Sparkles, AlertTriangle, ArrowRight, Eye, ShieldCheck, Heart } from 'lucide-react';

interface ObjectItem {
  id: string;
  name: string;
  chemicalName: string;
  formula: string;
  compoundUuid: string;
  safety: 'Green' | 'Yellow' | 'Red';
  details: string;
  uses: string;
  safetyNote: string;
  markerPos: { top: string; left: string }; // Position in room SVG
}

interface Room {
  id: string;
  name: string;
  desc: string;
  items: ObjectItem[];
}

interface XRayHouseProps {
  onSearchCompound: (uuid: string) => void;
}

export default function XRayHouse({ onSearchCompound }: XRayHouseProps) {
  const [activeRoom, setActiveRoom] = useState<string>('kitchen');
  const [selectedItem, setSelectedItem] = useState<ObjectItem | null>(null);

  const rooms: Room[] = [
    {
      id: 'kitchen',
      name: 'The Kitchen Lab',
      desc: 'Explore cooking, preservation, and acid-base reactions hidden in plain sight.',
      items: [
        {
          id: 'vinegar',
          name: 'Vinegar Bottle',
          chemicalName: 'Acetic Acid',
          formula: 'CH3COOH',
          compoundUuid: 'acetic_acid',
          safety: 'Yellow',
          details: 'Standard vinegar is a 5% aqueous solution of acetic acid. In the kitchen, it acts as a souring agent, a cleaning descaler, and a preservative.',
          uses: 'Cooking, pickling, salad dressing, eco-friendly cleaning.',
          safetyNote: 'Dilute vinegar is safe, but concentrated acetic acid is corrosive and causes severe skin burns.',
          markerPos: { top: '35%', left: '42%' }
        },
        {
          id: 'baking_soda',
          name: 'Baking Soda Canister',
          chemicalName: 'Sodium Bicarbonate',
          formula: 'NaHCO3',
          compoundUuid: 'sodium_bicarbonate',
          safety: 'Green',
          details: 'A weak chemical base. When it reacts with an acid (like vinegar or lemon juice), it releases carbon dioxide gas, producing bubbles that make cake dough rise.',
          uses: 'Baking, deodorizing, scrubbing, mild antacid.',
          safetyNote: 'Extremely safe. Ingesting massive quantities is not recommended as it disrupts blood pH.',
          markerPos: { top: '22%', left: '55%' }
        },
        {
          id: 'table_salt',
          name: 'Salt Shaker',
          chemicalName: 'Sodium Chloride',
          formula: 'NaCl',
          compoundUuid: 'sodium_chloride',
          safety: 'Green',
          details: 'An ionic lattice of sodium and chlorine. Salt preserves food by pulling water out of bacterial cells through osmosis, dehydrating and killing them.',
          uses: 'Food seasoning, curing meats, water softening.',
          safetyNote: 'Daily nutritional necessity, but excessive intake is linked to high blood pressure.',
          markerPos: { top: '45%', left: '60%' }
        },
        {
          id: 'citrus_fruits',
          name: 'Citrus Fruit Bowl',
          chemicalName: 'Citric Acid',
          formula: 'C6H8O7',
          compoundUuid: 'citric_acid',
          safety: 'Green',
          details: 'A natural organic acid in lemons, limes, and oranges. It gives citrus fruits their tart flavor and serves as a natural antioxidant preservative.',
          uses: 'Flavoring, sour candy coating, chelating agent, cosmetic pH adjuster.',
          safetyNote: 'Mild acid, safe to eat. Can erode tooth enamel if consumed in excessive, pure amounts.',
          markerPos: { top: '55%', left: '25%' }
        },
        {
          id: 'msg_canister',
          name: 'Umami MSG Shaker',
          chemicalName: 'Monosodium Glutamate',
          formula: 'C5H8NNaO4',
          compoundUuid: 'monosodium_glutamate',
          safety: 'Green',
          details: 'The sodium salt of glutamic acid. When dissolved, it releases glutamate ions that bind specifically to umami receptors on the tongue, creating a savory taste profile.',
          uses: 'Umami flavor enhancement in soups, chips, and stir-fries.',
          safetyNote: 'Extensively studied and declared safe by international panels. The "MSG syndrome" is a myth.',
          markerPos: { top: '15%', left: '28%' }
        }
      ]
    },
    {
      id: 'bathroom',
      name: 'The Bathroom Lab',
      desc: 'Decode the surfactants, minerals, and disinfectants inside hygiene products.',
      items: [
        {
          id: 'toothpaste',
          name: 'Toothpaste Tube',
          chemicalName: 'Sodium Fluoride',
          formula: 'NaF',
          compoundUuid: 'sodium_fluoride',
          safety: 'Red',
          details: 'Toothpaste contains fluoride to strengthen teeth. It replaces hydroxide ions in tooth enamel with fluorapatite, which is significantly more resistant to acid decay.',
          uses: 'Dental cavity prevention and enamel remineralization.',
          safetyNote: 'Toxic if ingested in large quantities (e.g. eating a whole tube). Spit it out after brushing.',
          markerPos: { top: '30%', left: '32%' }
        },
        {
          id: 'shampoo',
          name: 'Shampoo Bottle',
          chemicalName: 'Sodium Laureth Sulfate (SLES)',
          formula: 'C14H29NaO5S',
          compoundUuid: 'sodium_laureth_sulfate',
          safety: 'Yellow',
          details: 'An anionic surfactant that reduces water surface tension. Its hydrophobic tail attaches to oil/sebum and its hydrophilic head binds to water, letting dirt wash away.',
          uses: 'Shampoos, body washes, soaps, dishwashing detergents.',
          safetyNote: 'Can cause skin irritation or eye burning in high concentrations, but is not carcinogenic.',
          markerPos: { top: '48%', left: '25%' }
        },
        {
          id: 'mouthwash',
          name: 'Mouthwash Bottle',
          chemicalName: 'Menthol',
          formula: 'C10H20O',
          compoundUuid: 'menthol',
          safety: 'Green',
          details: 'Triggers cold-sensitive nerve receptors (TRPM8) in the skin and mouth, causing a cooling sensation without a literal drop in temperature.',
          uses: 'Breath freshening, cough lozenges, muscle rubs.',
          safetyNote: 'Safe in standard concentrations. Concentrated peppermint oils should not be ingested.',
          markerPos: { top: '25%', left: '60%' }
        },
        {
          id: 'sunscreen',
          name: 'Sunscreen Lotion',
          chemicalName: 'Zinc Oxide',
          formula: 'ZnO',
          compoundUuid: 'zinc_oxide',
          safety: 'Green',
          details: 'A physical mineral UV blocker. It sits on top of the skin and acts as a mirror to reflect and scatter UVA and UVB rays away from cells.',
          uses: 'Broad-spectrum sun protection, diaper rash creams, ointments.',
          safetyNote: 'Highly safe for external use. Reef-friendly compared to chemical filters.',
          markerPos: { top: '60%', left: '55%' }
        },
        {
          id: 'aspirin',
          name: 'Aspirin Bottle',
          chemicalName: 'Acetylsalicylic Acid',
          formula: 'C9H8O4',
          compoundUuid: 'acetylsalicylic_acid',
          safety: 'Yellow',
          details: 'Modified salicylate synthesized from willow bark chemicals. It inhibits cyclooxygenase (COX) enzymes, blocking the production of pain and clotting signals.',
          uses: 'Pain relief, fever reducer, low-dose heart attack prevention.',
          safetyNote: 'Should not be given to children under 16 due to links to Reye\'s Syndrome.',
          markerPos: { top: '15%', left: '45%' }
        }
      ]
    },
    {
      id: 'living_room',
      name: 'Laundry & Living Room Lab',
      desc: 'Discover the oxidizing bleaching agents, polymers, and solvents in daily routines.',
      items: [
        {
          id: 'bleach',
          name: 'Bleach Jug',
          chemicalName: 'Sodium Hypochlorite',
          formula: 'NaClO',
          compoundUuid: 'sodium_hypochlorite',
          safety: 'Red',
          details: 'A powerful oxidizer. It denatures proteins in cell membranes, killing bacteria, fungi, and viruses almost instantly while bleaching color pigments.',
          uses: 'Disinfection, laundry whitening, water sanitation.',
          safetyNote: 'CRITICAL: Never mix with acids (creates chlorine gas) or ammonia (creates chloramine gas). Both gases are lethal.',
          markerPos: { top: '42%', left: '30%' }
        },
        {
          id: 'hand_sanitizer',
          name: 'Hand Sanitizer Gel',
          chemicalName: 'Ethanol',
          formula: 'C2H5OH',
          compoundUuid: 'ethanol',
          safety: 'Yellow',
          details: 'A fast-acting antiseptic. It denatures cellular proteins and dissolves lipid cell walls in pathogens, killing them within 15 seconds.',
          uses: 'Sanitation, solvent, fuel.',
          safetyNote: 'Flammable. Ingesting denatured alcohol causes severe alcohol poisoning.',
          markerPos: { top: '30%', left: '58%' }
        },
        {
          id: 'detergent',
          name: 'Detergent Powder',
          chemicalName: 'Sodium Carbonate',
          formula: 'Na2CO3',
          compoundUuid: 'sodium_carbonate',
          safety: 'Yellow',
          details: 'Also known as washing soda. It binds to calcium and magnesium minerals in hard water, softening it so surfactants can clean clothes effectively.',
          uses: 'Laundry booster, water softening, glass manufacture.',
          safetyNote: 'Moderately alkaline (pH ~11). Do not eat and avoid prolonged direct skin contact.',
          markerPos: { top: '55%', left: '44%' }
        },
        {
          id: 'screen',
          name: 'TV / Monitor Screen',
          chemicalName: 'Dimethicone',
          formula: 'C2H6OSi',
          compoundUuid: 'dimethicone',
          safety: 'Green',
          details: 'A silicone-based polymer that forms a smooth, protective, water-resistant barrier. Used in hair smoothers, moisturizers, and screen protection coat layers.',
          uses: 'Cosmetic smoothing agent, screen coating, anti-foaming agent.',
          safetyNote: 'Inert and highly safe for cosmetic applications.',
          markerPos: { top: '20%', left: '42%' }
        }
      ]
    }
  ];

  const currentRoom = rooms.find(r => r.id === activeRoom) || rooms[0];

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="p-6 bg-gradient-to-r from-green-50 via-slate-100 to-white border border-green-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-extrabold font-display tracking-tight text-slate-800 m-0">The Molecular X-Ray House</h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Click through rooms and tap glowing nodes to scan everyday objects and reveal the underlying chemical structures and compounds that power our homes.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-2xl">
          <Eye className="w-5 h-5 text-green-700" />
          <span className="text-xs text-green-700 font-semibold uppercase tracking-wider">X-Ray Scanner Engaged</span>
        </div>
      </div>

      {/* Room Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => {
              setActiveRoom(room.id);
              setSelectedItem(null);
            }}
            className={`px-6 py-3.5 font-display text-sm font-semibold border-b-2 transition-all ${
              activeRoom === room.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-slate-500 hover:text-slate-850'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Layout Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Room Visualizer Blueprint */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] shadow-sm">
          {/* Blueprint grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/10 to-slate-50/40 pointer-events-none" />

          {/* Interactive room name */}
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-lg font-bold font-display text-slate-800 m-0">{currentRoom.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{currentRoom.desc}</p>
          </div>

          {/* Styled Room SVG / Canvas representation */}
          <div className="w-full max-w-lg aspect-square relative border border-dashed border-slate-350/60 rounded-2xl bg-slate-50/50 flex items-center justify-center mt-6">
            
            {/* Draw active room background schematic */}
            {activeRoom === 'kitchen' && (
              <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-slate-400/40 opacity-70">
                <rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1"/>
                {/* Kitchen counter outline */}
                <rect x="15" y="15" width="70" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                {/* Kitchen sink */}
                <rect x="45" y="18" width="10" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
                {/* Refrigerator outline */}
                <rect x="70" y="40" width="15" height="35" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                {/* Dining table circle */}
                <circle cx="40" cy="70" r="14" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}

            {activeRoom === 'bathroom' && (
              <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-slate-400/40 opacity-70">
                <rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                {/* Bathtub outline */}
                <rect x="15" y="15" width="20" height="50" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                {/* Bathroom counter vanity */}
                <rect x="50" y="15" width="35" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                {/* Toilet outline */}
                <rect x="65" y="65" width="15" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}

            {activeRoom === 'living_room' && (
              <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-slate-400/40 opacity-70">
                <rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                {/* Sofa outline */}
                <rect x="20" y="60" width="60" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                {/* TV bench shelf */}
                <rect x="25" y="15" width="50" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                {/* Laundry washing machine outline */}
                <rect x="70" y="32" width="15" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}

            {/* Render click markers */}
            {currentRoom.items.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  style={{ top: item.markerPos.top, left: item.markerPos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-3 rounded-full border transition-all duration-300 group z-20 ${
                    isSelected
                      ? 'bg-green-600 text-white border-white scale-125 shadow-lg shadow-green-200'
                      : 'bg-white text-green-600 border-green-300 hover:scale-110 hover:border-green-500 shadow-sm'
                  }`}
                >
                  <span className={`absolute inset-0 rounded-full bg-green-500/20 group-hover:animate-ping ${isSelected ? 'hidden' : ''}`} />
                  <span className="w-3.5 h-3.5 flex items-center justify-center font-display text-[9px] font-extrabold uppercase">
                    {item.name[0]}
                  </span>
                  
                  {/* Floating marker label */}
                  <span className={`absolute top-full mt-1 px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap bg-slate-800 border border-slate-700 text-white pointer-events-none transition-opacity duration-200 shadow-md ${
                    isSelected ? 'opacity-100 border-green-500/40' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-6 right-6 text-slate-400 text-[11px] font-semibold">
            Click nodes to trigger scan
          </div>
        </div>

        {/* Compound Analyzer Scanner Side-Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          {selectedItem ? (
            <div className="space-y-6 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-green-700 font-extrabold uppercase tracking-widest bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                    Scanner Output
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                    selectedItem.safety === 'Green' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : selectedItem.safety === 'Yellow'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-750'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    Safety: {selectedItem.safety}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-display tracking-tight text-slate-850 leading-tight">
                    {selectedItem.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-500">{selectedItem.chemicalName}</span>
                    <span className="text-xs font-mono bg-purple-50 border border-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                      {selectedItem.formula}
                    </span>
                  </div>
                </div>

                {/* Main description */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider block mb-1">
                    Description & Chemistry
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    {selectedItem.details}
                  </p>
                </div>

                {/* Uses */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider block mb-1">
                    Common Uses
                  </h4>
                  <p className="text-xs text-slate-700 font-semibold bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    {selectedItem.uses}
                  </p>
                </div>

                {/* Safety details */}
                <div className="space-y-2.5 bg-yellow-50/50 border border-yellow-100 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Exposure & Safety Context
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {selectedItem.safetyNote}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => onSearchCompound(selectedItem.compoundUuid)}
                  className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all duration-150 shadow-sm"
                >
                  <span>De-Jargonize Compound Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-full text-slate-400 animate-pulse">
                <Home className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-750">No Object Inspected</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Select any highlighted glowing circular marker in the room layout blueprint to initialize the molecular x-ray scanner.
                </p>
              </div>

              <div className="w-full pt-4 border-t border-slate-200 mt-6 text-left space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanning Principles</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-600"><strong className="text-slate-800">Green Tier:</strong> Safe for standard contact and consumption.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-600"><strong className="text-slate-800">Yellow Tier:</strong> Avoid ingestion, can cause irritation at high concentrations.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-600"><strong className="text-slate-800">Red Tier:</strong> Corrosive or toxic in raw states. Handle with extreme care.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
