'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, X } from 'lucide-react';
import { getSharePlatformUrl } from '@/utils/links';
import { TelegramIcon, WhatsAppIcon, ViberIcon, XIcon, PinterestIcon, FacebookIcon } from './icons/SocialIcons';

interface SharePopoverProps {
    url: string;
    title: string;
    heading?: string; // заголовок попапа, по умолчанию универсальный
    onClose: () => void;
    anchorRect: DOMRect; // позиция кнопки, относительно которой рисуем попап
}

export const SharePopover = ({ url, title, heading = 'Share with friends', onClose, anchorRect }: SharePopoverProps) => {
    const [copied, setCopied] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // молча игнорируем
        }
    };

    const platforms = [
        { key: 'telegram' as const, icon: TelegramIcon, label: 'Telegram', color: 'bg-sky-500 hover:bg-sky-600' },
        { key: 'whatsapp' as const, icon: WhatsAppIcon, label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
        { key: 'viber' as const, icon: ViberIcon, label: 'Viber', color: 'bg-purple-500 hover:bg-purple-600' },
        { key: 'facebook' as const, icon: FacebookIcon, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
        { key: 'twitter' as const, icon: XIcon, label: 'X (Twitter)', color: 'bg-slate-900 hover:bg-slate-800' },
        { key: 'pinterest' as const, icon: PinterestIcon, label: 'Pinterest', color: 'bg-red-600 hover:bg-red-700' },
    ];

    // Вычисляем позицию попапа на экране на основе координат кнопки.
    const popoverWidth = 288;
    const popoverHeight = 320; // примерная высота попапа с учётом всех секций

    // Проверяем, хватает ли места снизу от кнопки до низа экрана
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const shouldOpenUpward = spaceBelow < popoverHeight + 16;

    // Если места снизу мало — открываем попап ВВЕРХ от кнопки
    const top = shouldOpenUpward
        ? anchorRect.top - popoverHeight - 8
        : anchorRect.bottom + 8;

    let left = anchorRect.right - popoverWidth;
    if (left < 8) left = 8;

    const popoverContent = (
        <div
            ref={popoverRef}
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'fixed', top, left, width: popoverWidth }}
            className="bg-white rounded-2xl shadow-2xl shadow-slate-600/50 border border-slate-200 p-4 z-[120] animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-black uppercase text-slate-400 tracking-widest">
                    {heading}
                </p>
                <button
                    onClick={onClose}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-90"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <input
                    readOnly
                    value={url}
                    className="flex-1 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 truncate outline-none"
                />
                <button
                    onClick={handleCopy}
                    className={`shrink-0 p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    {copied ? <Check size={14} /> : <Copy size={16} />}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {platforms.map((p) => (
                    <a key={p.key}
                        href={getSharePlatformUrl(p.key, url, title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.label}
                        className={`flex items-center justify-center w-12 h-12 mx-auto rounded-full text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 active:duration-150 ${p.color}`}>
                        <p.icon size={25} />
                    </a>
                ))}
            </div>
        </div >
    );

    // createPortal рендерит этот JSX не в текущем месте дерева,
    // а напрямую в document.body — минуя любой overflow:hidden родителей
    return createPortal(popoverContent, document.body);
};