import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    setError(null);
    try {
      // Search German OpenFoodFacts database
      const response = await fetch(`https://de.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=20`);
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Fehler bei der Suche. Bitte überprüfe deine Internetverbindung.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchProducts();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>KalorieApp 🍎</h1>
      <p>Finde Kalorien und Inhaltsstoffe deutscher Produkte.</p>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Produkt suchen (z.B. Apfel)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button 
          onClick={searchProducts}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading ? '#ccc' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Suche...' : 'Suche'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ marginTop: '20px' }}>
        {products.map((product) => (
          <ProductCard
            key={product.code || Math.random()}
            name={product.product_name || 'Unbekanntes Produkt'}
            brand={product.brands || 'Keine Marke'}
            calories={product.nutriments?.['energy-kcal_100g'] || 0}
            carbs={product.nutriments?.carbohydrates_100g || 0}
            protein={product.nutriments?.proteins_100g || 0}
            fat={product.nutriments?.fat_100g || 0}
            imageUrl={product.image_front_small_url}
          />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div style={{ border: '2px dashed #ccc', padding: '40px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9', marginTop: '40px' }}>
          <h3>QR-Code Scan</h3>
          <p>Hier wird später der Kamerastream angezeigt.</p>
          <button style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            📷 Kamera starten
          </button>
        </div>
      )}
    </div>
  );
}