import Cards from "./Cards";
import { FaChevronCircleUp } from "react-icons/fa";

export default function MainSection() {
    return (
        <>
            <section id="card-container">
                <Cards/>
            </section>
            <button id="main-section-button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            ><FaChevronCircleUp />
            </button>
        </>
    );
}