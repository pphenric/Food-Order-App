"use client";

import { useState } from "react";

import Header from "@/src/assets/components/Header";
import MainSection from "@/src/assets/components/MainSection";
import { ICart } from "@/src/assets/util/interfaces";
import { CartContext } from "@/src/assets/contexts/contexts";

export default function Home() {
  const [cartData, setCartData] = useState<ICart[]>([]);
  
  return (
      <CartContext.Provider value={{cartData, setCartData}}>
        <Header />
        <MainSection />
      </CartContext.Provider>
  );
}
