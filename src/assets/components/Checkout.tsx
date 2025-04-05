import { useEffect, useState, useActionState, useContext } from "react";
import { handleModal, insertOder, transformNestJsErrors } from "../util/functions";
import { ICheckout, IOrder } from "../util/interfaces";
import { createPortal } from "react-dom";
import { CartContext } from "../contexts/contexts";

export default function Checkout({pricetotal, checkoutDialogRef, cartdetails} : ICheckout) {
    const [dialogContainer, setDialogContainer] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setDialogContainer(document.getElementById("dialog-container"));
    }, []);

    const [, action, isPending] = useActionState(handleForm, null);
    const [formData, setFormData] = useState<IOrder | null>(null);
    const [submissionErrors, setSubmissionErrors] = useState<Partial<IOrder> | null>(null);

    const cartContext = useContext(CartContext);
    if (!cartContext) throw new Error("CartContext must be used inside CartProvider");
    const { setCartData } = cartContext;

    async function handleForm(previousState: IOrder | null, formDomData: FormData) {
        setSubmissionErrors(null); // Clear previous errors on new submission attempt

        const processedFormData: IOrder = {
          name: formDomData.get('name') as string,
          email: formDomData.get('email') as string,
          street: formDomData.get('street') as string,
          postalcode: formDomData.get('postalcode') as string,
          city: formDomData.get('city') as string,
          pricetotal: pricetotal,
          cartdetails: JSON.stringify(cartdetails)
        };

        setFormData(processedFormData);

        // --- Call API ---
        const result = await insertOder(processedFormData);

        // --- Process Result ---
        if (result.success) {
            console.log("Order submitted successfully!");
            handleModal(checkoutDialogRef, 'close', undefined, '');
            setFormData(null); // Clear saved form state on success
            setCartData([]); // Clear cart on success
            setSubmissionErrors(null); // Ensure errors are cleared
        } else {
            console.error("Submission failed:", result);
            // If specific validation errors are returned, transform and set them
            if (result.errors) {
                 const formattedErrors = transformNestJsErrors(result.errors);
                 setSubmissionErrors(formattedErrors);
            } else {
                 setSubmissionErrors({ name: result.message || "An unknown error occurred." });
            }
        }
        return previousState;
    }

    return (
        <>
            {dialogContainer && createPortal(
                <form action={action}>
                    <dialog id="cart-summary" ref={checkoutDialogRef}>
                        <h2>Checkout</h2>
                        <p id="checkout-p">Total Amount: €{pricetotal.toFixed(2)}</p>

                        <h4>Full Name</h4>
                        <input type="text" name="name"
                            className={submissionErrors?.name ? "input-error" : undefined}
                            defaultValue={typeof formData?.name === "string" ? formData.name : ''}
                        />
                        {submissionErrors?.name && <p id="input-error-p">{String(submissionErrors.name)}</p>}

                        <h4>E-mail Address</h4>
                        <input type="text" name="email"
                            className={submissionErrors?.email ? "input-error" : undefined}
                            defaultValue={typeof formData?.email === "string" ? formData.email : ''}
                        />
                        {submissionErrors?.email && <p id="input-error-p">{String(submissionErrors.email)}</p>}

                        <h4>Street</h4>
                        <input type="text" name="street"
                            className={submissionErrors?.street ? "input-error" : undefined}
                            defaultValue={typeof formData?.street === "string" ? formData.street : ''}
                        />
                        {submissionErrors?.street && <p id="input-error-p">{String(submissionErrors.street)}</p>}

                        <div id="checkout-div">
                            <div>
                                <h4>Postal Code</h4>
                                <input type="text" name="postalcode"
                                    className={submissionErrors?.postalcode ? "input-error" : undefined}
                                    defaultValue={typeof formData?.postalcode === "string" ? formData.postalcode : ''}
                                />
                                {submissionErrors?.postalcode && <p id="input-error-p">{String(submissionErrors.postalcode)}</p>}
                            </div>
                            <div>
                                <h4>City</h4>
                                <input type="text" name="city"
                                    className={submissionErrors?.city ? "input-error" : undefined}
                                    defaultValue={typeof formData?.city === "string" ? formData.city : ''}
                                />
                                {submissionErrors?.city && <p id="input-error-p">{String(submissionErrors.city)}</p>}
                            </div>
                        </div>
                        <section id="cart-summary-footer">
                            <button type="button" onClick={() => {
                                handleModal(checkoutDialogRef, 'close', undefined, '');
                                setSubmissionErrors(null);
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