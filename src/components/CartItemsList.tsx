'use client';

import { Zap } from 'lucide-react';
import { CartProductCard } from './CartProductCard';
import { StackTimeline } from './StackTimeline';
import { Supplement } from '@/constants/supplements';

interface CartItem {
    id: string;
    count: number;
}

interface CartItemsListProps {
    cart: CartItem[];
    allSupplements: Supplement[];
    updateQuantity: (id: string, delta: number) => void;
    onOpenProductModal: (product: Supplement) => void;
}

export const CartItemsList = ({
    cart,
    allSupplements,
    updateQuantity,
    onOpenProductModal,
}: CartItemsListProps) => {
    // Ранний return для пустого состояния — вместо тернарника внутри JSX,
    // как было в исходнике. Логика та же, просто читать чуть проще:
    // одна явная развилка "если пусто — вот это", а не вложенный if/else в разметке.
    if (cart.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center text-center space-y-3 opacity-50">
                <Zap size={24} className="text-slate-300" />
                <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                    Stack is empty
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {cart.map((item) => {
                const product = allSupplements.find((s) => s.id === item.id);
                if (!product) return null;
                return (
                    <CartProductCard
                        key={item.id}
                        id={item.id}
                        count={item.count}
                        product={product}
                        updateQuantity={updateQuantity}
                        onOpenProductModal={onOpenProductModal}
                    />
                );
            })}
            <StackTimeline cart={cart} allSupplements={allSupplements} />
        </div>
    );
};