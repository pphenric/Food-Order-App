import { createUniqueKey } from "../util/functions";

export default function CardPlaceholders() {    
    return (
        <>
            {[...Array(10)].map(() => 
                <div id="card-placeholder" key={createUniqueKey(20)}>
                    <div id="card-placeholder-img" />
                    <h3></h3>
                    <h4></h4>
                    <p></p>
                    <button disabled></button>
                </div>
            )}
        </>
    );
}