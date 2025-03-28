import { useContext, useRef } from "react";

import { TiShoppingCart } from "react-icons/ti";
import { CartContext, CartSummaryDialogContext } from "../contexts/contexts";
import { handleModal } from "../util/functions";
import CartSummary from "./CartSummary";

export default function Cart() {
    const cartContext = useContext(CartContext);
    if (!cartContext) throw new Error("CartContext must be used inside CartProvider");
    const { cartData } = cartContext;

    const cartSummaryDialogRef = useRef(null);
    return (
        <CartSummaryDialogContext.Provider value={{dialogRef: cartSummaryDialogRef}}>
            <div id="cart">
                <button onClick={() => handleModal(cartSummaryDialogRef, cartData.length ? 'open' : 'close', undefined, '')}>
                    <TiShoppingCart id="cart-icon" />
                    Cart ({cartData.length})
                </button>
            </div>
            <CartSummary />
        </CartSummaryDialogContext.Provider>
    );
}