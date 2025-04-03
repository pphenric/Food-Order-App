"use client";

import { useState, createContext } from "react";
import { ICart, ICartContext, IDialogContext, ICartProviderProps } from "../util/interfaces";

export const CartContext = createContext<ICartContext | undefined>(undefined);
export const CartSummaryDialogContext  = createContext<IDialogContext | undefined>(undefined);

export function CartProvider({children}: ICartProviderProps) {
    const [cartData, setCartData] = useState<ICart[]>([]);
    return (
        <CartContext.Provider value={{cartData, setCartData}}>
            {children}
        </CartContext.Provider>
    );
}