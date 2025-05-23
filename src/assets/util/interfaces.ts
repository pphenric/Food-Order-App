import { ReactNode, RefObject } from "react";

export interface ICart {
    id: string,
    name: string,
    price: number,
    description: string,
    imgurl: string,
}

export interface ICartProviderProps {
    children: ReactNode;
}

export interface ICartContext {
    cartData: ICart[];
    setCartData: React.Dispatch<React.SetStateAction<ICart[]>>;
}

export interface IDialogContext {
    dialogRef: RefObject<HTMLDialogElement | null>;
}

export interface ICartSummary {
    name: string,
    quantity: number,
    price: number,
}

export interface IOrder {
    name: FormDataEntryValue | null | string,
    email: FormDataEntryValue | null | string,
    street: FormDataEntryValue | null | string,
    postalcode: FormDataEntryValue | null | string,
    city: FormDataEntryValue | null | string,
    pricetotal?: number,
    cartdetails?: string
}

export interface ICheckout {
    pricetotal: number,
    checkoutDialogRef: RefObject<null>,
    cartdetails: ICartSummary[]
}

export interface IInsertOrderResult {
    success: boolean;
    data?: any; // Data on success (e.g., created order ID)
    errors?: Record<string, string> | string[]; // Structured errors or raw message array/string
    message?: string; // General error message for non-validation errors
  };