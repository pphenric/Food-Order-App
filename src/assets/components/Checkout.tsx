import { useEffect, useState, useActionState, useContext } from "react";
import { checkInput, handleModal, insertOder } from "../util/functions";
import { ICheckout, IOrder } from "../util/interfaces";
import { createPortal } from "react-dom";
import { CartContext } from "../contexts/contexts";

export default function Checkout({pricetotal, checkoutDialogRef, cartdetails} : ICheckout) {
    const [dialogContainer, setDialogContainer] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setDialogContainer(document.getElementById("dialog-container"));
    }, []);

    const [_, action, isPending] = useActionState(handleForm, null);
    const [formData, setFormData] = useState<IOrder | null>(null);
    const [formErrorData, setFormErrorData] = useState<IOrder | null>(null);

    const cartContext = useContext(CartContext);
    if (!cartContext) throw new Error("CartContext must be used inside CartProvider");
    const { setCartData } = cartContext;

    async function handleForm(previousState: IOrder | null, formData: FormData) {
        const processedFormData: IOrder = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          street: formData.get('street') as string,
          postalcode: formData.get('postalcode') as string,
          city: formData.get('city') as string
        };
      
        const computedFormErrorData: IOrder = {
          name: checkInput('The Full name field', String(processedFormData.name), 3, false),
          email: checkInput('The E-mail Address field', String(processedFormData.email), 3, true),
          street: checkInput('The Street field', String(processedFormData.street), 3, false),
          postalcode: checkInput('The Postal Code field', String(processedFormData.postalcode), 3, false),
          city: checkInput('The City field', String(processedFormData.city), 3, false)
        };
      
        setFormData(processedFormData);
        setFormErrorData(computedFormErrorData);
      
        handleFormSubmission(processedFormData, computedFormErrorData);
      
        return processedFormData;
      }
      
      function handleFormSubmission(formData: IOrder, formErrorData: IOrder) {
        if (!(formData.name || formData.email || formData.street || formData.postalcode || formData.city)) {
          return;
        }
        if (formErrorData.name || formErrorData.email || formErrorData.street || formErrorData.postalcode || formErrorData.city) {
          return;
        }
        const order: IOrder = {
          name: formData.name,
          email: formData.email,
          street: formData.street,
          postalcode: formData.postalcode,
          city: formData.city,
          pricetotal: pricetotal,
          cartdetails: JSON.stringify(cartdetails)
        };
        insertOder(order);
        handleModal(checkoutDialogRef, 'close', undefined, '');
        setFormData(null);
        setCartData([]);
      }

    return (
        <>
            {dialogContainer && createPortal(
                <form action={action}>
                    <dialog id="cart-summary" ref={checkoutDialogRef}>
                        <h2>Checkout</h2>
                        <p id="checkout-p">Total Ammount: €{pricetotal.toFixed(2)}</p>
                        <h4>Full Name</h4>
                        <input type="text" name="name" className={formErrorData?.name ? "input-error" : undefined}
                            defaultValue={typeof formData?.name === "string" ? formData.name : undefined}
                        />
                        {formErrorData?.name && <p id="input-error-p">{String(formErrorData?.name)}</p>}
                        <h4>E-mail Address</h4>
                        <input type="text" name="email" className={formErrorData?.email ? "input-error" : undefined}
                            defaultValue={typeof formData?.email === "string" ? formData.email : undefined}
                        />
                        {formErrorData?.email && <p id="input-error-p">{String(formErrorData?.email)}</p>}
                        <h4>Street</h4>
                        <input type="text" name="street" className={formErrorData?.street ? "input-error" : undefined}
                            defaultValue={typeof formData?.street === "string" ? formData.street : undefined}
                        />
                        {formErrorData?.street && <p id="input-error-p">{String(formErrorData?.street)}</p>}
                        <div id="checkout-div">
                            <div>
                                <h4>Postal Code</h4>
                                <input type="text" name="postalcode" className={formErrorData?.postalcode ? "input-error" : undefined}
                                    defaultValue={typeof formData?.postalcode === "string" ? formData.postalcode : undefined}
                                />
                                {formErrorData?.postalcode && <p id="input-error-p">{String(formErrorData?.postalcode)}</p>}
                            </div>
                            <div>
                                <h4>City</h4>
                                <input type="text" name="city" className={formErrorData?.city ? "input-error" : undefined}
                                    defaultValue={typeof formData?.city === "string" ? formData.city : undefined}
                                />
                                {formErrorData?.city && <p id="input-error-p">{String(formErrorData?.city)}</p>}
                            </div>
                        </div>
                        <section id="cart-summary-footer">
                            <button type="button" onClick={() => {
                                handleModal(checkoutDialogRef, 'close', undefined, '');
                                setFormData(null);
                                setFormErrorData(null);
                            }}>Close</button>
                            <button disabled={isPending} id="cart-summary-footer-button">Submit Order</button>
                        </section>
                    </dialog>
                </form>,
            dialogContainer
            )}
        </>
    );
}