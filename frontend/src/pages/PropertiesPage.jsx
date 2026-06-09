import { useState, useEffect } from 'react';
import SearchBar from '@/components/properties/SearchBar';
import CategoryFilter from '@/components/properties/CategoryFilter';
import PropertyGrid from '@/components/properties/PropertyGrid'; // <-- Relies on standard grid routing file split
import { getProperties } from '@/services/propertyService';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('All');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        // Fallback to safe empty array to prevent filtering runtime exceptions
        setProperties(data || []); 
      } catch (error) {
        console.log("Vite Catalog Fetch Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filtered = properties.filter((property) => {
    // Defensive safeguard: Skip item if structural parameters are completely corrupt or missing
    if (!property || !property.title) return false;

    const matchesSearch = property.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selected === 'All' ? true : property.type === selected;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <h2 className="p-10 text-center text-xl font-medium text-slate-400">Loading Properties Catalog...</h2>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-5xl font-bold mb-8 text-white">Properties</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <div className="my-6">
        <CategoryFilter selected={selected} setSelected={setSelected} />
      </div>
      <PropertyGrid properties={filtered} />
    </div>
  );
}
