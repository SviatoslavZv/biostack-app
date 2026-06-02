export interface Rule {
  id: string;
  condition: (selectedSubTypes: string[]) => boolean;
  message: string;
  type: 'info' | 'warning' | 'success';
}

export const STACK_RULES: Rule[] = [

  // ✅ СИНЕРГИЯ — хорошие комбинации
  {
    id: 'caffeine-theanine-synergy',
    condition: (types) => types.includes('caffeine') && types.includes('theanine'),
    message: "⚡ Great combo! Caffeine + L-Theanine is a classic biohacker stack — smooth energy without jitters.",
    type: 'success'
  },
  {
    id: 'coq10-omega3-synergy',
    condition: (types) => types.includes('coq10') && types.includes('omega-3'),
    message: "✅ Smart pairing! CoQ10 is fat-soluble and absorbs significantly better when taken with Omega-3.",
    type: 'success'
  },
  {
    id: 'vitamin-d3-k2-synergy',
    condition: (types) => types.includes('vitamin-d3') && types.includes('vitamin-d3-k2'),
    message: "⚠️ You have both Vitamin D3 and D3+K2 in your stack. This may lead to excessive Vitamin D intake.",
    type: 'warning'
  },

  // ⚠️ ПРЕДУПРЕЖДЕНИЯ — дублирование
  {
    id: 'magnesium-duplicate',
    condition: (types) => {
      const magTypes = types.filter(t => t === 'magnesium' || t === 'magnesium-threonate');
      return magTypes.length >= 2;
    },
    message: "⚠️ You have multiple magnesium forms selected. Choose one to avoid excess intake.",
    type: 'warning'
  },
  {
    id: 'zinc-duplicate',
    condition: (types) => types.filter(t => t === 'zinc').length >= 2,
    message: "⚠️ Multiple zinc supplements detected. Excess zinc can interfere with copper absorption.",
    type: 'warning'
  },
  {
    id: 'melatonin-ashwagandha-caution',
    condition: (types) => types.includes('melatonin') && types.includes('ashwagandha'),
    message: "💤 Both Melatonin and Ashwagandha affect sleep. Start with low doses to assess your response.",
    type: 'warning'
  },
  {
    id: 'nac-duplicate',
    condition: (types) => types.filter(t => t === 'nac').length >= 2,
    message: "⚠️ Multiple NAC products selected. Stick to one — excess NAC may cause oxidative stress at high doses.",
    type: 'warning'
  },

  // ℹ️ СОВЕТЫ — как принимать
  {
    id: 'coq10-without-omega3',
    condition: (types) => types.includes('coq10') && !types.includes('omega-3'),
    message: "💡 CoQ10 is fat-soluble. Consider adding Omega-3 to your stack for better absorption.",
    type: 'info'
  },
  {
    id: 'vitamin-d3-without-k2',
    condition: (types) => types.includes('vitamin-d3') && !types.includes('vitamin-d3-k2'),
    message: "💡 Vitamin D3 works best with K2 (MK-7) — K2 directs calcium to bones, not arteries.",
    type: 'info'
  },
  {
    id: 'magnesium-evening',
    condition: (types) => types.includes('magnesium') || types.includes('magnesium-threonate'),
    message: "🌙 Magnesium is most effective when taken in the evening — it supports relaxation and sleep quality.",
    type: 'info'
  },
  {
    id: 'berberine-timing',
    condition: (types) => types.includes('berberine'),
    message: "🍽️ Take Berberine with meals — it helps regulate blood sugar most effectively when taken before eating.",
    type: 'info'
  },
  {
    id: 'astaxanthin-fat-soluble',
    condition: (types) => types.includes('astaxanthin') && !types.includes('omega-3'),
    message: "💡 Astaxanthin is fat-soluble. Take it with a meal containing healthy fats, or add Omega-3 to your stack.",
    type: 'info'
  },
  {
    id: 'nmn-morning',
    condition: (types) => types.includes('nmn'),
    message: "☀️ Take NMN in the morning — it supports NAD+ production and cellular energy, best aligned with your circadian rhythm.",
    type: 'info'
  },
  {
    id: 'spermidine-fasting',
    condition: (types) => types.includes('spermidine'),
    message: "⏱️ Spermidine activates autophagy most effectively when taken during a fasting window or in the morning.",
    type: 'info'
  },
  // ✅ СИНЕРГИИ — межкатегорийные комбинации
  {
    id: 'resveratrol-quercetin-synergy',
    condition: (types) => types.includes('resveratrol') && types.includes('quercetin'),
    message: "⚡ Powerful longevity combo! Resveratrol + Quercetin both activate SIRT1 pathways — a classic biohacker anti-aging stack.",
    type: 'success'
  },
  {
    id: 'nac-vitamin-c-synergy',
    condition: (types) => types.includes('nac') && types.includes('vitamin-c'),
    message: "✅ Great antioxidant pair! NAC + Vitamin C work synergistically to boost glutathione production and cellular defense.",
    type: 'success'
  },
  {
    id: 'zinc-vitamin-c-synergy',
    condition: (types) => types.includes('zinc') && types.includes('vitamin-c'),
    message: "✅ Strong immune stack! Zinc + Vitamin C together provide significantly enhanced immune protection.",
    type: 'success'
  },
  {
    id: 'curcumin-omega3-synergy',
    condition: (types) => types.includes('curcumin') && types.includes('omega-3'),
    message: "✅ Smart combo! Omega-3 enhances curcumin absorption and together they provide powerful anti-inflammatory support.",
    type: 'success'
  },
  {
    id: 'saw-palmetto-zinc-synergy',
    condition: (types) => types.includes('saw-palmetto') && types.includes('zinc'),
    message: "✅ Classic men's health stack! Saw Palmetto + Zinc is a well-researched combination for prostate and hormonal support.",
    type: 'success'
  },
  {
    id: 'ashwagandha-magnesium-synergy',
    condition: (types) => types.includes('ashwagandha') && (types.includes('magnesium') || types.includes('magnesium-threonate')),
    message: "✅ Excellent stress-relief stack! Ashwagandha + Magnesium together provide enhanced cortisol reduction and relaxation.",
    type: 'success'
  },

  // ⚠️ ПРЕДУПРЕЖДЕНИЯ — конфликты и риски
  {
    id: 'zinc-iron-conflict',
    condition: (types) => types.includes('zinc') && types.includes('iron'),
    message: "⚠️ Zinc and Iron compete for absorption. Take them at least 2 hours apart for maximum effectiveness.",
    type: 'warning'
  },
  {
    id: 'high-d3-without-k2',
    condition: (types) => types.includes('vitamin-d3') && !types.includes('vitamin-d3-k2'),
    message: "⚠️ Taking Vitamin D3 without K2 long-term may increase arterial calcium risk. Consider adding D3+K2 instead.",
    type: 'warning'
  },
  {
    id: 'berberine-coq10-caution',
    condition: (types) => types.includes('berberine') && !types.includes('coq10'),
    message: "⚠️ Berberine may reduce CoQ10 levels over time. Consider adding CoQ10 to protect mitochondrial energy production.",
    type: 'warning'
  },
  {
    id: 'too-many-stimulants',
    condition: (types) => {
      const stimulants = types.filter(t => t === 'caffeine' || t === 'nmn' || t === 'vitamin-b-complex');
      return stimulants.length >= 3;
    },
    message: "⚠️ Multiple energy-boosting supplements detected. Avoid taking them all at once — spread them through the morning.",
    type: 'warning'
  },
  {
    id: 'resveratrol-duplicate',
    condition: (types) => types.filter(t => t === 'resveratrol').length >= 2,
    message: "⚠️ Multiple resveratrol products selected. One source is sufficient — excess resveratrol may have diminishing returns.",
    type: 'warning'
  },

  // ℹ️ СОВЕТЫ — умные подсказки
  {
    id: 'caffeine-without-ashwagandha',
    condition: (types) => types.includes('caffeine') && !types.includes('ashwagandha'),
    message: "💡 Consider adding Ashwagandha to your stack — it helps reduce cortisol spikes caused by caffeine.",
    type: 'info'
  },
  {
    id: 'sleep-stack-suggestion',
    condition: (types) => types.includes('magnesium') && !types.includes('melatonin'),
    message: "💡 You have Magnesium — adding Melatonin would complete a powerful sleep optimization stack.",
    type: 'info'
  },
  {
    id: 'longevity-stack-suggestion',
    condition: (types) => types.includes('resveratrol') && !types.includes('quercetin'),
    message: "💡 You have Resveratrol — adding Quercetin would significantly enhance your longevity stack synergy.",
    type: 'info'
  },
  {
    id: 'collagen-vitamin-c',
    condition: (types) => (types.includes('collagen-bovine') || types.includes('collagen-marine')) && !types.includes('vitamin-c'),
    message: "💡 Vitamin C is essential for collagen synthesis. Add it to your stack to maximize collagen effectiveness.",
    type: 'info'
  },
  {
    id: 'omega3-timing',
    condition: (types) => types.includes('omega-3'),
    message: "🍽️ Take Omega-3 with your largest meal of the day — fat-soluble nutrients absorb best with dietary fats.",
    type: 'info'
  },
  {
    id: 'quercetin-timing',
    condition: (types) => types.includes('quercetin'),
    message: "🍽️ Take Quercetin with a meal containing healthy fats — it significantly improves its bioavailability.",
    type: 'info'
  },
  {
    id: 'b-complex-morning',
    condition: (types) => types.includes('vitamin-b-complex'),
    message: "☀️ Take B-Complex in the morning with breakfast — B vitamins support energy metabolism and may interfere with sleep if taken late.",
    type: 'info'
  },
  {
    id: 'prostate-complete-stack',
    condition: (types) => types.includes('prostate-support') && !types.includes('zinc'),
    message: "💡 Add Zinc to complement your prostate support formula — zinc is one of the most important minerals for prostate health.",
    type: 'info'
  },
];