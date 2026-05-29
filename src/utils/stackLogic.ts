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
  const baseUrl = "https://www.iherb.com/tr/cb";
  const rcode = PARTNER_CONFIG.rewardsCode;

  // Если корзина пуста, просто отправляем на главную iHerb с реферальным кодом
  if (cart.length === 0) return `https://www.iherb.com/?rcode=${rcode}`;

  // 1. Превращаем каждый элемент [ {id: "NOW-123", count: 2} ] в строку формата "NOW-123-2"
  const formattedItems = cart.map(item => `${item.id}-${item.count}`);

  // 2. Объединяем полученный массив строк через восклицательный знак "!"
  // Получится строка: "NOW-123-2!SOL-567-1"
  const pidlist = formattedItems.join('!');

  // 3. Собираем финальный URL, передавая pidlist и твой реферальный код rcode
  return `${baseUrl}?pidlist=${pidlist}&rcode=${rcode}`;
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