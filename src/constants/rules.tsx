import React from 'react';

/**
 * Интерфейс контекста, который SmartAlerts передает в каждое правило.
 * Предоставляет полную аналитику по текущему состоянию корзины.
 */
export interface RuleContext {
  types: string[]; // Плоский массив всех subType с учетом количества (для простых синергий)
  getMultipleFormsTypes: () => string[]; // Возвращает подтипы, где выбраны РАЗНЫЕ бренды/формы
  getHighQuantityTypes: () => Array<{ subType: string; count: number; name: string }>; // Возвращает товары, купленные в количестве 2+ шт.
}

/**
 * Интерфейс структуры правила.
 * message может быть обычной строкой или функцией, возвращающей JSX.
 */
export interface Rule {
  id: string;
  condition: (ctx: RuleContext) => boolean;
  message: string | ((ctx: RuleContext) => React.ReactNode);
  type: 'info' | 'warning' | 'success';
}

/**
 * Единая база знаний и правил для анализа стека добавок
 */
export const STACK_RULES: Rule[] = [

  // ==========================================================================
  // ⚠️ ГЛОБАЛЬНЫЕ ДИНАМИЧЕСКИЕ ПРАВИЛА (Автоматически работают для всего каталога)
  // ==========================================================================
  {
    id: 'global-multiple-forms',
    condition: (ctx) => ctx.getMultipleFormsTypes().length > 0,
    message: (ctx) => {
      const conflicts = ctx.getMultipleFormsTypes().map(t => t.toUpperCase()).join(', ');
      return `⚠️ You have selected multiple DIFFERENT brands or forms for: ${conflicts}. Consider choosing one optimal product to avoid overlapping doses.`;
    },
    type: 'warning'
  },
  {
    id: 'global-high-quantity',
    condition: (ctx) => ctx.getHighQuantityTypes().length > 0,
    message: (ctx) => {
      const items = ctx.getHighQuantityTypes();
      return (
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.subType}>
              📦 You've added <strong>{item.count} units</strong> of <em>{item.name}</em>. Ensure this high volume matches your current biohacking protocol or family stack goals.
            </div>
          ))}
        </div>
      );
    },
    type: 'warning'
  },

  // ==========================================================================
  // ✅ СИНЕРГИЯ — Отличные комбинации и пары с повышенной эффективностью
  // ==========================================================================
  {
    id: 'caffeine-theanine-synergy',
    condition: (ctx) => ctx.types.includes('caffeine') && ctx.types.includes('theanine'),
    message: "⚡ Great combo! Caffeine + L-Theanine is a classic biohacker stack — smooth energy without jitters.",
    type: 'success'
  },
  {
    id: 'coq10-omega3-synergy',
    condition: (ctx) => ctx.types.includes('coq10') && ctx.types.includes('omega-3'),
    message: "✅ Smart pairing! CoQ10 is fat-soluble and absorbs significantly better when taken with Omega-3.",
    type: 'success'
  },
  {
    id: 'resveratrol-quercetin-synergy',
    condition: (ctx) => ctx.types.includes('resveratrol') && ctx.types.includes('quercetin'),
    message: "⚡ Powerful longevity combo! Resveratrol + Quercetin both activate SIRT1 pathways — a classic biohacker anti-aging stack.",
    type: 'success'
  },
  {
    id: 'nac-vitamin-c-synergy',
    condition: (ctx) => ctx.types.includes('nac') && ctx.types.includes('vitamin-c'),
    message: "✅ Great antioxidant pair! NAC + Vitamin C work synergistically to boost glutathione production and cellular defense.",
    type: 'success'
  },
  {
    id: 'zinc-vitamin-c-synergy',
    condition: (ctx) => ctx.types.includes('zinc') && ctx.types.includes('vitamin-c'),
    message: "✅ Strong immune stack! Zinc + Vitamin C together provide significantly enhanced immune protection.",
    type: 'success'
  },
  {
    id: 'curcumin-omega3-synergy',
    condition: (ctx) => ctx.types.includes('curcumin') && ctx.types.includes('omega-3'),
    message: "✅ Smart combo! Omega-3 enhances curcumin absorption and together they provide powerful anti-inflammatory support.",
    type: 'success'
  },
  {
    id: 'saw-palmetto-zinc-synergy',
    condition: (ctx) => ctx.types.includes('saw-palmetto') && ctx.types.includes('zinc'),
    message: "✅ Classic men's health stack! Saw Palmetto + Zinc is a well-researched combination for prostate and hormonal support.",
    type: 'success'
  },
  {
    id: 'ashwagandha-magnesium-synergy',
    condition: (ctx) => ctx.types.includes('ashwagandha') && (ctx.types.includes('magnesium') || ctx.types.includes('magnesium-threonate')),
    message: "✅ Excellent stress-relief stack! Ashwagandha + Magnesium together provide enhanced cortisol reduction and relaxation.",
    type: 'success'
  },
  {
    id: 'nmn-trimethylglycine-synergy',
    condition: (ctx) => ctx.types.includes('nmn') && ctx.types.includes('tmg'),
    message: "⚡ Pro Biohacker Stack! NMN depletes methyl groups during NAD+ conversion; adding TMG (Trimethylglycine) provides crucial methylation support.",
    type: 'success'
  },
  {
    id: 'alpha-gpc-racetam-synergy',
    condition: (ctx) => ctx.types.includes('alpha-gpc') && (ctx.types.includes('noopept') || ctx.types.includes('piracetam')),
    message: "🧠 Optimized Focus Stack! Racetams increase acetylcholine demand. Adding Alpha-GPC provides the necessary choline supply to prevent headaches and maximize focus.",
    type: 'success'
  },
  {
    id: 'iron-vitamin-c-synergy',
    condition: (ctx) => ctx.types.includes('iron') && ctx.types.includes('vitamin-c'),
    message: "✅ Excellent pairing! Vitamin C enhances the bioavailability and absorption of non-heme Iron significantly.",
    type: 'success'
  },

  // ==========================================================================
  // ⚠️ ПРЕДУПРЕЖДЕНИЯ — Специфические конфликты и риски несовместимости
  // ==========================================================================
  {
    id: 'vitamin-d3-k2-overlap',
    condition: (ctx) => ctx.types.includes('vitamin-d3') && ctx.types.includes('vitamin-d3-k2'),
    message: "⚠️ You have both Vitamin D3 and D3+K2 in your stack. This may lead to excessive Vitamin D intake.",
    type: 'warning'
  },
  {
    id: 'melatonin-ashwagandha-caution',
    condition: (ctx) => ctx.types.includes('melatonin') && ctx.types.includes('ashwagandha'),
    message: "💤 Both Melatonin and Ashwagandha affect sleep. Start with low doses to assess your response.",
    type: 'warning'
  },
  {
    id: 'zinc-iron-conflict',
    condition: (ctx) => ctx.types.includes('zinc') && ctx.types.includes('iron'),
    message: "⚠️ Zinc and Iron compete for absorption. Take them at least 2 hours apart for maximum effectiveness.",
    type: 'warning'
  },
  {
    id: 'iron-calcium-conflict',
    condition: (ctx) => ctx.types.includes('iron') && ctx.types.includes('calcium'),
    message: "⚠️ Iron and Calcium strongly compete for the same absorption pathways. Take them at completely different times of day.",
    type: 'warning'
  },
  {
    id: 'green-tea-iron-conflict',
    condition: (ctx) => (ctx.types.includes('egcg') || ctx.types.includes('green-tea')) && ctx.types.includes('iron'),
    message: "⚠️ Green Tea Extract (EGCG) binds to Iron and inhibits its absorption significantly. Avoid taking them together.",
    type: 'warning'
  },
  {
    id: 'high-d3-without-k2',
    condition: (ctx) => ctx.types.includes('vitamin-d3') && !ctx.types.includes('vitamin-d3-k2'),
    message: "⚠️ Taking Vitamin D3 without K2 long-term may increase arterial calcium risk. Consider adding D3+K2 instead.",
    type: 'warning'
  },
  {
    id: 'berberine-coq10-caution',
    condition: (ctx) => ctx.types.includes('berberine') && !ctx.types.includes('coq10'),
    message: "⚠️ Berberine may reduce CoQ10 levels over time. Consider adding CoQ10 to protect mitochondrial energy production.",
    type: 'warning'
  },
  {
    id: 'too-many-stimulants',
    condition: (ctx) => {
      const stimulants = ctx.types.filter(t => t === 'caffeine' || t === 'nmn' || t === 'vitamin-b-complex');
      return stimulants.length >= 3;
    },
    message: "⚠️ Multiple energy-boosting supplements detected. Avoid taking them all at once — spread them through the morning.",
    type: 'warning'
  },

  // ==========================================================================
  // ℹ️ СОВЕТЫ — Умные подсказки по таймингу, биодоступности и улучшению стека
  // ==========================================================================
  {
    id: 'zinc-copper-imbalance',
    condition: (ctx) => ctx.types.includes('zinc') && !ctx.types.includes('copper'),
    message: "💡 Long-term Zinc supplementation can deplete Copper levels. Consider adding a low-dose Copper supplement to maintain mineral balance.",
    type: 'info'
  },
  {
    id: 'zinc-nausea-warning',
    condition: (ctx) => ctx.types.includes('zinc'),
    message: "🍽️ Zinc can cause mild to acute stomach upset or nausea if taken on an empty stomach. Always take it after a solid meal.",
    type: 'info'
  },
  {
    id: 'nac-stomach-protection',
    condition: (ctx) => ctx.types.includes('nac'),
    message: "💧 Take NAC with a full glass of water. It is highly acidic and can occasionally cause acid reflux or irritate an empty stomach.",
    type: 'info'
  },
  {
    id: 'coq10-without-omega3',
    condition: (ctx) => ctx.types.includes('coq10') && !ctx.types.includes('omega-3'),
    message: "💡 CoQ10 is fat-soluble. Consider adding Omega-3 to your stack for better absorption.",
    type: 'info'
  },
  {
    id: 'magnesium-evening',
    condition: (ctx) => ctx.types.includes('magnesium') || ctx.types.includes('magnesium-threonate'),
    message: "🌙 Magnesium is most effective when taken in the evening — it supports relaxation and sleep quality.",
    type: 'info'
  },
  {
    id: 'berberine-timing',
    condition: (ctx) => ctx.types.includes('berberine'),
    message: "🍽️ Take Berberine with meals — it helps regulate blood sugar most effectively when taken before eating.",
    type: 'info'
  },
  {
    id: 'astaxanthin-fat-soluble',
    condition: (ctx) => ctx.types.includes('astaxanthin') && !ctx.types.includes('omega-3'),
    message: "💡 Astaxanthin is fat-soluble. Take it with a meal containing healthy fats, or add Omega-3 to your stack.",
    type: 'info'
  },
  {
    id: 'nmn-morning',
    condition: (ctx) => ctx.types.includes('nmn'),
    message: "☀️ Take NMN in the morning — it supports NAD+ production and cellular energy, best aligned with your circadian rhythm.",
    type: 'info'
  },
  {
    id: 'spermidine-fasting',
    condition: (ctx) => ctx.types.includes('spermidine'),
    message: "⏱️ Spermidine activates autophagy most effectively when taken during a fasting window or in the morning.",
    type: 'info'
  },
  {
    id: 'caffeine-without-ashwagandha',
    condition: (ctx) => ctx.types.includes('caffeine') && !ctx.types.includes('ashwagandha'),
    message: "💡 Consider adding Ashwagandha to your stack — it helps reduce cortisol spikes caused by caffeine.",
    type: 'info'
  },
  {
    id: 'sleep-stack-suggestion',
    condition: (ctx) => (ctx.types.includes('magnesium') || ctx.types.includes('magnesium-threonate')) && !ctx.types.includes('melatonin'),
    message: "💡 You have Magnesium — adding Melatonin would complete a powerful sleep optimization stack.",
    type: 'info'
  },
  {
    id: 'longevity-stack-suggestion',
    condition: (ctx) => ctx.types.includes('resveratrol') && !ctx.types.includes('quercetin'),
    message: "💡 You have Resveratrol — adding Quercetin would significantly enhance your longevity stack synergy.",
    type: 'info'
  },
  {
    id: 'collagen-vitamin-c',
    condition: (ctx) => (ctx.types.includes('collagen-bovine') || ctx.types.includes('collagen-marine')) && !ctx.types.includes('vitamin-c'),
    message: "💡 Vitamin C is essential for collagen synthesis. Add it to your stack to maximize collagen effectiveness.",
    type: 'info'
  },
  {
    id: 'omega3-timing',
    condition: (ctx) => ctx.types.includes('omega-3'),
    message: "🍽️ Take Omega-3 with your largest meal of the day — fat-soluble nutrients absorb best with dietary fats.",
    type: 'info'
  },
  {
    id: 'quercetin-timing',
    condition: (ctx) => ctx.types.includes('quercetin'),
    message: "🍽️ Take Quercetin with a meal containing healthy fats — it significantly improves its bioavailability.",
    type: 'info'
  },
  {
    id: 'b-complex-morning',
    condition: (ctx) => ctx.types.includes('vitamin-b-complex'),
    message: "☀️ Take B-Complex in the morning with breakfast — B vitamins support energy metabolism and may interfere with sleep if taken late.",
    type: 'info'
  },
  {
    id: 'prostate-complete-stack',
    condition: (ctx) => ctx.types.includes('prostate-support') && !ctx.types.includes('zinc'),
    message: "💡 Add Zinc to complement your prostate support formula — zinc is one of the most important minerals for prostate health.",
    type: 'info'
  }
];