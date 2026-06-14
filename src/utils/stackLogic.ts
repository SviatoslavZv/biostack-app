import { Supplement } from "@/constants/supplements";
import { PARTNER_CONFIG } from "@/constants/config";

// Тип для элемента корзины, чтобы функции знали, с чем работают
interface CartItem {
  id: string;
  count: number;
}

/**
 * Рассчитывает общую стоимость выбранных добавок с учетом КОЛИЧЕСТВА банок.
 */
export const calculateTotal = (cart: CartItem[], supplements: Supplement[]): number => {
  return cart.reduce((sum, cartItem) => {
    const product = supplements.find(s => s.id === cartItem.id);
    return sum + (product ? product.price * cartItem.count : 0);
  }, 0);
};


/**
 * Генерирует "умную" партнерскую ссылку iHerb (Shared Cart).
 * Собирает все товары из корзины в единый параметр pidlist, понятный iHerb.
 */
export const generateIHerbLink = (cart: CartItem[]): string => {
  const baseUrl = "https://checkout.iherb.com/cart/shared";
  const rcode = PARTNER_CONFIG.rewardsCode;

  if (cart.length === 0) return `https://www.iherb.com/?rcode=${rcode}`;

  // Формат: CGN-00940qty1sid0_NOW-00147qty2sid0
  const pcodes = cart
    .map(item => `${item.id}qty${item.count}sid0`)
    .join('_');

  return `${baseUrl}?pcodes=${pcodes}&v=2&rcode=${rcode}`;
};



/**
 * Рассчитывает стоимость одной порции (вспомогательная функция для UI).
 */
export const getPricePerServing = (price: number, servings: number): string => {
  if (!servings || servings <= 0) return "0.00";
  return (price / servings).toFixed(2);
};

/**
 * Находит самый выгодный товар по типу (subType).
 * (Оставляем как есть, она уже работает на subType — это отлично!)
 */
export const getBestValueId = (supplements: Supplement[], subType: string): string | null => {
  const relatedItems = supplements.filter(s =>
    s.subType === subType && s.isAvailable && s.servings > 0
  );

  if (relatedItems.length <= 1) return null;

  const bestValue = relatedItems.reduce((prev, curr) => {
    const prevCPS = prev.price / prev.servings;
    const currCPS = curr.price / curr.servings;
    return currCPS < prevCPS ? curr : prev;
  });

  return bestValue.id;
};


/**
 * Результат для одного неоптимального товара в корзине.
 * Описывает: что сейчас стоит, что лучше поставить, и сколько сэкономим.
 */
export interface OptimizationSuggestion {
  currentProduct: Supplement;
  currentCount: number;      // сколько банок текущего товара в корзине
  bestProduct: Supplement;
  suggestedCount: number;    // сколько банок лучшего товара нужно поставить
  savings: number;           // сколько долларов сэкономит пользователь
}

/**
 * Проверяет корзину на наличие неоптимальных по цене товаров.
 * Возвращает массив всех найденных предложений по оптимизации.
 */
export const findOptimizationSuggestions = (
  cart: CartItem[],
  supplements: Supplement[]
): OptimizationSuggestion[] => {
  if (!cart || !Array.isArray(cart) || cart.length === 0) return [];

  const suggestions: OptimizationSuggestion[] = [];

  for (const cartItem of cart) {
    const product = supplements.find(s => s.id === cartItem.id);
    if (!product || !product.subType) continue;

    const bestId = getBestValueId(supplements, product.subType);

    if (bestId && bestId !== cartItem.id) {
      const bestProduct = supplements.find(s => s.id === bestId);
      if (!bestProduct) continue;

      const totalServingsNeeded = product.servings * cartItem.count;

      const suggestedCount = Math.max(
        1,
        Math.ceil(totalServingsNeeded / bestProduct.servings)
      );

      const currentTotalCost = product.price * cartItem.count;
      const newTotalCost = bestProduct.price * suggestedCount;
      const savings = currentTotalCost - newTotalCost;

      if (savings > 0) {
        suggestions.push({
          currentProduct: product,
          currentCount: cartItem.count,
          bestProduct,
          suggestedCount,
          savings
        });
      }
    }
  }

  return suggestions;
};