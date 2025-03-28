import { ReactNode } from "react";

import Image from 'next/image';
import Cart from "./Cart";

export default function Header() : ReactNode {
    return (
        <header>
            <div id="title">
                <Image src='/logo.jpg' height={100} width={100} alt="An explosive food menu"/>
                <h1>REACTFOOD</h1>
            </div>
            <Cart />
        </header>
    )
}