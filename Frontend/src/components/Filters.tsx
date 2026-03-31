// Category filter sidebar component
function Filters({ setCategory }: any) {
    return (
        <div className="p-4 w-60 border-r">
            <h2 className="font-bold mb-4">Filters</h2>
            <button onClick={() => setCategory("men")}>Men</button><br />
            <button onClick={() => setCategory("women")}>Women</button><br />
            <button onClick={() => setCategory("kids")}>Kids</button><br />
            <button onClick={() => setCategory("")}>All</button>
        </div>
    );
}

export default Filters;