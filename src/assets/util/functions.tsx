import { RefObject, Dispatch, SetStateAction } from "react";
import { ICart, ICartSummary, IOrder } from "./interfaces";
import { ICartContext } from "./interfaces";

export function createUniqueKey(len : number) : string {
    len = len > 62 ? 62: len;
    let key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    key = Array.from(key, () => key[Math.floor(Math.random() * key.length)])
        .join('').substring(0, len-1);
    return key;
}

export async function getCartData(setCardData: Dispatch<SetStateAction<ICart[] | undefined>>) {
    fetch("/api/query")
    .then((res) => res.json())
    .then((data) => setCardData(data.data))
    .catch((error) => {
        console.error(error);
    });
}

export async function insertOder(order: IOrder) {
    fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    })
        .then((res) => res.json())
        .then((data) => {
        console.log("Order inserted:", data);
        })
        .catch((error) => {
        console.error("Error inserting order:", error);
        });
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

export function checkInput(inputFieldName: string, input: string, minLength: number, isEmail: boolean) : string | null {
    if (!input) {
        return `${inputFieldName} cannot be empty`;
    }
    if (input.length < minLength) {
        return `${inputFieldName} cannot contain less then ${minLength} characters`;
    }
    if (isEmail && !input.includes('@')) {
        return 'No valid email detected. Please add a a valid email';
    }
    return null;
}