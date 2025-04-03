"use client";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import { ICart } from "../util/interfaces";
import CardPlaceholders from "./CardPlaceholders";
import { CartContext } from "@/src/assets/contexts/contexts";
import { getCartData, handleCartData } from "../util/functions";

export default function Cards() {
    const [cardData, setCardData] = useState<ICart[]>();
    const [isLoading, setIsLoading] = useState(true);

    const cartContext = useContext(CartContext);
    if (!cartContext) throw new Error("CartContext must be used inside CartProvider");
    const { setCartData } = cartContext;

    useEffect(() => {
        getCartData(setCardData);
        setIsLoading(false);
    }, []);

    return (
        <>
            {isLoading ? (
                <CardPlaceholders />
            ) : (
                cardData?.map((card) => (
                    <div id="card" key={card.id} className="fade-in">
                        <Image src={card.imgurl} alt="" height={450} width={450} />
                        <h3>{card.name}</h3>
                        <h4>€{card.price}</h4>
                        <p>{card.description}</p>
                        <button onClick={() => handleCartData(card, setCartData)}>Add to Cart</button>
                    </div>
                ))
            )}
        </>
    );
}
