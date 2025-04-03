import Header from "@/src/assets/components/Header";
import MainSection from "@/src/assets/components/MainSection";
import { CartProvider } from "@/src/assets/contexts/contexts";

export default function Home() {
  return (
    <CartProvider>
      <Header />
      <MainSection />
    </CartProvider>
  );
}
