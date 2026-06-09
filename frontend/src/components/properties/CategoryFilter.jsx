const categories = [
  "All",
  "House",
  "Apartment",
  "Villa",
];

export default function CategoryFilter({
  selected,
  setSelected,
}) {
  return (
    <div className="flex gap-4 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() =>
            setSelected(category)
          }
          className={`px-4 py-2 rounded-xl border
          ${
            selected === category
              ? "bg-blue-600 text-white"
              : ""
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}