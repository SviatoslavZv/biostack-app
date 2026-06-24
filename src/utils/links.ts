export const formatPartnerLink = (url: string): string => {
  if (!url) return "";
  const code = "PBG122";
  const urlObj = new URL(url);
  urlObj.searchParams.set("rcode", code);
  return urlObj.toString();
};


/**
 * Возвращает базовый URL текущего приложения.
 * Работает автоматически на любом хосте — localhost, Vercel, кастомный домен.
 */
export const getAppUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

export const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Универсальная функция "поделиться".
 * Если браузер поддерживает Web Share API — открывает системное окно "Поделиться".
 * Иначе — копирует ссылку в буфер обмена.
 * 
 * @param url - ссылка для шаринга
 * @param title - заголовок (показывается в системном окне на мобильных)
 * @returns 'shared' | 'copied' | 'failed'
 */
export const shareLink = async (url: string, title: string): Promise<'shared' | 'copied' | 'failed'> => {
  if ('share' in navigator && isMobileDevice()) {
    try {
      await navigator.share({ title, url });
      return 'shared';
    } catch {
      // AbortError — пользователь закрыл окно, это нормально
      // Любая другая ошибка — share не сработал, возвращаем 'failed' сразу
      return 'failed';
    }
  }

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
};


/**
 * Шаблоны share-ссылок для соцсетей.
 * Каждая платформа принимает URL (и иногда текст) через query-параметры —
 * это официальный публичный механизм, не требует API-ключей.
 */
export const getSharePlatformUrl = (
  platform: 'telegram' | 'whatsapp' | 'viber' | 'facebook' | 'twitter' | 'pinterest',
  url: string,
  text: string
): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  switch (platform) {
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case 'viber':
      return `viber://forward?text=${encodedText}%20${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
    default:
      return url;
  }
};