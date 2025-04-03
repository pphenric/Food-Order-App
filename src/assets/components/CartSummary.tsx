import { Guid } from 'js-guid';
import { createPortal } from "react-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import { getPriceTotal, handleCartSummary, handleModal, processCartData } from "../util/functions";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext, CartSummaryDialogContext } from "../contexts/contexts";
import Checkout from "./Checkout";

export default function CartSummary() {
    const cartContext = useContext(CartContext);
    if (!cartContext) throw new Error("CartContext must be used inside CartProvider");
    const { cartData } = cartContext;
    const processedCartData = processCartData(cartData);

    const [dialogContainer, setDialogContainer] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setDialogContainer(document.getElementById("dialog-container"));
    }, []);

    const cartSummaryDialogContext = useContext(CartSummaryDialogContext);
    if (!cartContext) throw new Error("CartContext must be used inside CartProvider");
    const cartSummaryDialogRef = cartSummaryDialogContext?.dialogRef;
    const checkoutDialogRef = useRef(null);

    return(
        <>
            {dialogContainer && createPortal(
                <dialog id="cart-summary" ref={cartSummaryDialogRef} open={false}>
                    <h2>Your Cart</h2>
                    {processedCartData.map((cartItem)=>
                        <ol key={String(Guid.newGuid())}>
                            <li>
                                <p>{cartItem.name} - {cartItem.quantity} x €{cartItem.price}</p>
                                <div>
                                    <button 
                                        onClick={() => handleCartSummary('del', cartContext, cartItem, cartSummaryDialogRef)}
                                    ><FaMinus id="cart-summary-btnIcons"/></button>
                                    <p>{cartItem.quantity}</p>
                                    <button 
                                        onClick={() => handleCartSummary('add', cartContext, cartItem, cartSummaryDialogRef)}
                                    ><FaPlus id="cart-summary-btnIcons"/></button>
                                </div>
                            </li>
                        </ol>
                    )}
                    <h3>€{getPriceTotal(processedCartData).toFixed(2)}</h3>
                    <section id="cart-summary-footer">
                        <button type="button" onClick={() => handleModal(cartSummaryDialogRef, 'close', undefined, '')}>Close</button>
                        <button type="button" id="cart-summary-footer-button"
                            onClick={() => handleModal(checkoutDialogRef, 'open', cartSummaryDialogRef, 'close')}
                        >Go To Checkout</button>
                    </section>
                </dialog>,
                dialogContainer
            )}
            <Checkout pricetotal={getPriceTotal(processedCartData)} checkoutDialogRef={checkoutDialogRef} cartdetails={processedCartData} />
        </>
    )
}