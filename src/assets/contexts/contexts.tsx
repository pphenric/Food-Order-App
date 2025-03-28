import { createContext } from "react";
import { ICartContext, IDialogContext } from "../util/interfaces";

export const CartContext = createContext<ICartContext | undefined>(undefined);
export const CartSummaryDialogContext  = createContext<IDialogContext | undefined>(undefined);