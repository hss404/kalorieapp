import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import dynamic from 'next/dynamic';

// Dynamic import for QR Reader
const QrReader = dynamic(() => import('react-qr-reader').then(mod => mod.QrReader), {
  ssr: false,
  loading: () => <div style={{padding: '20px', textAlign: 'center'}}>Kamera wird geladen...</div>
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Load favorites from local storage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('kalorieapp_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('kalorieapp_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    if (favorites.some(fav => fav.code === product.code)) {
      setFavorites(favorites.filter(fav => fav.code !== product.code));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const isFavorite = (code) => {
    return favorites.some(fav => fav.code === code);
  };

  const searchProducts = async (term = searchTerm) => {
    if (!term) return;
    
    setLoading(true);
    setError(null);
    setShowFavorites(false);
    try {
      const response = await fetch(`https://de.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=20`);
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
        setError("Keine Produkte gefunden.");
      }
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Fehler bei der Suche. Bitte überprüfe deine Internetverbindung.");
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (result, error) => {
    if (!!result) {
      setShowScanner(false);
      const code = result?.text;
      if (code) {
        setLoading(true);
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
            const data = await response.json();
            if (data.product) {
                setProducts([data.product]);
                setShowFavorites(false);
            } else {
                setError("Produkt nicht gefunden.");
            }
        } catch(err) {
            setError("Fehler beim Scannen.");
        } finally {
            setLoading(false);
        }
      }
    }
  };

  const displayedProducts = showFavorites ? favorites : products;

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      color: '#333'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '10px' }}>
        <h1 style={{ color: '#2ecc71', margin: '0 0 5px 0', fontSize: '2.5rem' }}>KalorieApp 🍎</h1>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
          <button 
            onClick={() => setShowFavorites(false)}
            style={{background: 'none', border: 'none', color: !showFavorites ? '#2ecc71' : '#aaa', fontWeight: 'bold', cursor: 'pointer'}}
          >
            Suche
          </button>
          <button 
            onClick={() => setShowFavorites(true)}
            style={{background: 'none', border: 'none', color: showFavorites ? '#2ecc71' : '#aaa', fontWeight: 'bold', cursor: 'pointer'}}
          >
            Favoriten ({favorites.length})
          </button>
        </div>
      </header>
      
      {!showFavorites && (
        <>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '20px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
            padding: '15px', 
            borderRadius: '16px', 
            backgroundColor: 'white' 
          }}>
            <input 
              type="text" 
              placeholder="Suche..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
              style={{ 
                padding: '12px', 
                flex: 1, 
                borderRadius: '10px', 
                border: '1px solid #eee', 
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f9f9f9'
              }}
            />
            <button 
              onClick={() => searchProducts()}
              disabled={loading}
              style={{ 
                padding: '0 20px', 
                backgroundColor: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: 'bold',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              🔍
            </button>
          </div>

          <button 
            onClick={() => setShowScanner(!showScanner)}
            style={{
                width: '100%',
                padding: '16px',
                backgroundColor: showScanner ? '#e74c3c' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '25px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {showScanner ? '❌ Kamera schließen' : '📷 Barcode scannen'}
          </button>

          {showScanner && (
            <div style={{ 
              marginBottom: '20px', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              border: '4px solid #27ae60',
              position: 'relative',
              backgroundColor: '#000'
            }}>
                <QrReader
                    onResult={handleScan}
                    constraints={{ facingMode: 'environment' }}
                    style={{ width: '100%' }}
                />
                <p style={{
                  position: 'absolute', 
                  bottom: '10px', 
                  width: '100%', 
                  textAlign: 'center', 
                  color: 'white', 
                  zIndex: 10,
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  Halte einen Barcode in die Kamera
                </p>
            </div>
          )}
        </>
      )}

      {error && <div style={{ color: '#721c24', textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '12px' }}>{error}</div>}

      {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>Lade Daten... <span style={{display: 'inline-block', animation: 'spin 1s linear infinite'}}>⏳</span></div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.code || Math.random()}
            code={product.code}
            name={product.product_name || 'Unbekanntes Produkt'}
            brand={product.brands || 'Keine Marke'}
            calories={product.nutriments?.['energy-kcal_100g'] || 0}
            carbs={product.nutriments?.carbohydrates_100g || 0}
            protein={product.nutriments?.proteins_100g || 0}
            fat={product.nutriments?.fat_100g || 0}
            imageUrl={product.image_front_small_url}
            isFavorite={isFavorite(product.code)}
            onToggleFavorite={() => toggleFavorite(product)}
          />
        ))}
      </div>
      
      {displayedProducts.length === 0 && !loading && !error && !showScanner && (
        <div style={{textAlign: 'center', marginTop: '40px', color: '#aaa'}}>
          <div style={{fontSize: '40px', marginBottom: '10px'}}>{showFavorites ? '⭐' : '🥗'}</div>
          <p>{showFavorites ? 'Du hast noch keine Favoriten gespeichert.' : 'Suche nach Produkten oder scanne einen Barcode.'}</p>
        </div>
      )}
    </div>
  );
}