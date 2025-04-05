import { RefObject, Dispatch, SetStateAction } from "react";
import { ICart, ICartSummary, IInsertOrderResult, IOrder } from "./interfaces";
import { ICartContext } from "./interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getCartData(setCardData: Dispatch<SetStateAction<ICart[] | undefined>>) {
  // Fetch from the NestJS /foods endpoint
  fetch(`${API_BASE_URL}/foods`)
    .then(async (res) => {
      if (!res.ok) {
         const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response' }));
         console.error('Error fetching foods:', res.status, errorData);
         throw new Error(errorData.message || `HTTP error ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        setCardData(data.data);
      } else {
        console.error("API indicated failure:", data);
      }
    })
    .catch((error) => {
        console.error("Could not fetch cart data:", error);
    });
}

export async function insertOder(order: IOrder): Promise<IInsertOrderResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error ${response.status}. Failed to parse error response body.`,
      }));
      console.error('Error inserting order - Response not OK:', response.status, errorData);

      if (response.status === 400 && errorData.message) {
        return { success: false, errors: errorData.message };
      } else {
        return { success: false, message: errorData.message || `Server error: ${response.status}` };
      }
    }

    const successData = await response.json();
    console.log("Order inserted:", successData);
    return { success: true, data: successData.data }; // Assuming NestJS wraps success data in 'data' property

  } catch (error: any) {
    console.error("Network or fetch error inserting order:", error);
    return { success: false, message: error.message || "An unexpected network error occurred." };
  }
}

export function transformNestJsErrors(errors: string[] | Record<string, string> | undefined): Partial<IOrder> {
    const errorObj: Partial<IOrder> = {};
    if (!errors) return errorObj;

    if (Array.isArray(errors)) {
        errors.forEach(msg => {
            if (msg.toLowerCase().includes('name')) errorObj.name = msg;
            else if (msg.toLowerCase().includes('email')) errorObj.email = msg;
            else if (msg.toLowerCase().includes('street')) errorObj.street = msg;
            else if (msg.toLowerCase().includes('postal code') || msg.toLowerCase().includes('postalcode')) errorObj.postalcode = msg;
            else if (msg.toLowerCase().includes('city')) errorObj.city = msg;
            else { // Add a general error if field can't be determined
                errorObj.name = (errorObj.name ? errorObj.name + '; ' : '') + msg;
            }
        });
    } else if (typeof errors === 'object') {
         // If NestJS was configured to return an object like { field: message }
         Object.assign(errorObj, errors);
    } else if (typeof errors === 'string') {
        // If it's just a single string message
        errorObj.name = errors; // Assign to a default field for display
    }

    return errorObj;
}

export function handleCartData(card: ICart, setCartData: Dispatch<SetStateAction<ICart[]>>) {
    setCartData((prevCartData) => [...prevCartData, card]);
}

export function handleModal(ref: RefObject<HTMLDialogElement | null> | undefined, action: string,
    ref2: RefObject<HTMLDialogElement | null> | undefined, action2: string
) {
    if (!ref?.current) {
        return;
    }

    if (action === 'open') {
        ref.current.showModal();
    } else if (action === 'close') {
        ref.current.close();
    }

    if (!ref2?.current) {
        return;
    }

    if (action2 === 'open') {
        ref2.current.showModal();
    } else if (action2 === 'close') {
        ref2.current.close();
    }
}

export function processCartData(cartData: ICart[]): ICartSummary[] {
    const cartDataCopy = [...cartData];

    cartDataCopy.sort((a, b)=> a.name.localeCompare(b.name));
    const groupedItems = Object.values(
        cartDataCopy.reduce((acc, item) => {
          if (!acc[item.id]) {
            acc[item.id] = { ...item, quantity: 1 };
          } else {
            acc[item.id].quantity++;
          }
          return acc;
        }, {} as Record<string, { name: string; price: number; quantity: number }>)
      );

      return groupedItems;
}

export function getPriceTotal(cartSummary: ICartSummary[]) : number {
    let priceTotal = 0;
    for (let idx = 0; idx < cartSummary.length; idx++) {
        priceTotal += Number(cartSummary[idx].price) * Number(cartSummary[idx].quantity);
    }
    return priceTotal;
}

export function handleCartSummary(mode: string, cartContext: ICartContext, cartSummaryItem: ICartSummary, dialog: RefObject<HTMLDialogElement | null> | undefined) {
    let updatedCartData = [...cartContext.cartData];
    const itemIndex = updatedCartData.findIndex(item => item.name === cartSummaryItem.name);

    const cartSummary = processCartData(updatedCartData);
    const summaryItemIndex = cartSummary.findIndex(item => item.name === cartSummaryItem.name);

    if (itemIndex !== -1) {
        const updatedItem = { ...updatedCartData[itemIndex] };

        if (mode === 'add') {
            updatedCartData.push(updatedItem);
        } else if (mode === 'del') {
            if (cartSummary[summaryItemIndex].quantity > 1) {
                updatedCartData.splice(itemIndex, 1);
            } else {
                updatedCartData = updatedCartData.filter(item => item.name !== cartSummaryItem.name);
                cartContext.setCartData(updatedCartData);
                
                if (!updatedCartData.length) {
                    handleModal(dialog, 'close', undefined, '');
                }
                return;
            }
        }
    }

    cartContext.setCartData(updatedCartData);
}

// * not needed anymore, since validation is done via pipe on nest
// export function checkInput(inputFieldName: string, input: string, minLength: number, isEmail: boolean) : string | null {
//     if (!input) {
//         return `${inputFieldName} cannot be empty`;
//     }
//     if (input.length < minLength) {
//         return `${inputFieldName} cannot contain less then ${minLength} characters`;
//     }
//     if (isEmail && !input.includes('@')) {
//         return 'No valid email detected. Please add a a valid email';
//     }
//     return null;
// }