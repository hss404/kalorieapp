import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProductCard from '../components/ProductCard';

// Dynamic import for QR Reader
const QrReader = dynamic(() => import('react-qr-reader').then(mod => mod.QrReader), {
  ssr: false,
  loading: () => <div style={{padding: '20px', textAlign: 'center'}}>Kamera wird geladen...</div>
});

// Dynamic import for Recharts to avoid SSR issues
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [dailyMacros, setDailyMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [isClient, setIsClient] = useState(false);

  // Load favorites and daily macros from local storage on mount
  useEffect(() => {
    setIsClient(true);
    const savedFavorites = localStorage.getItem('kalorieapp_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedMacros = localStorage.getItem('kalorieapp_macros');
    const lastDate = localStorage.getItem('kalorieapp_date');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
        localStorage.setItem('kalorieapp_date', today);
        localStorage.setItem('kalorieapp_macros', JSON.stringify({ calories: 0, protein: 0, carbs: 0, fat: 0 }));
        setDailyMacros({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    } else if (savedMacros) {
        setDailyMacros(JSON.parse(savedMacros));
    }
  }, []);

  // Save favorites to local storage
  useEffect(() => {
    if (isClient) localStorage.setItem('kalorieapp_favorites', JSON.stringify(favorites));
  }, [favorites, isClient]);

  // Save macros to local storage
  useEffect(() => {
    if (isClient) localStorage.setItem('kalorieapp_macros', JSON.stringify(dailyMacros));
  }, [dailyMacros, isClient]);

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

  const addToDaily = (product) => {
      const newMacros = {
          calories: dailyMacros.calories + (product.nutriments?.['energy-kcal_100g'] || 0),
          protein: dailyMacros.protein + (product.nutriments?.proteins_100g || 0),
          carbs: dailyMacros.carbs + (product.nutriments?.carbohydrates_100g || 0),
          fat: dailyMacros.fat + (product.nutriments?.fat_100g || 0)
      };
      setDailyMacros(newMacros);
      alert(`${product.product_name} wurde hinzugefügt!`);
  };

  const searchProducts = async (term = searchTerm) => {
    if (!term) return;
    
    setLoading(true);
    setError(null);
    setShowFavorites(false);
    try {
      // OPTIMIZED SEARCH: Limited fields and page size for faster response
      const fields = 'code,product_name,brands,image_front_small_url,nutriments';
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=15&fields=${fields}`);
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
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
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json?fields=code,product_name,brands,image_front_small_url,nutriments`);
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

  // Macro Charts Data - WITH DISTINCT CALORIE RING
  const macroData = [
      { name: 'Kcal', value: dailyMacros.calories, color: '#9b59b6', max: 2500 }, // Purple for Calories
      { name: 'Protein', value: dailyMacros.protein, color: '#3498db', max: 150 },
      { name: 'Carbs', value: dailyMacros.carbs, color: '#f1c40f', max: 250 },
      { name: 'Fett', value: dailyMacros.fat, color: '#e74c3c', max: 80 }
  ];

  const renderMacroChart = (data) => {
      if (!isClient) return null;
      const remaining = Math.max(0, data.max - data.value);
      const chartData = [
          { name: 'Consumed', value: data.value },
          { name: 'Remaining', value: remaining }
      ];

      return (
          <div key={data.name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '22%'}}>
             <div style={{width: '70px', height: '70px', position: 'relative'}}>
                <PieChart width={70} height={70}>
                    <Pie
                        data={chartData}
                        cx={35}
                        cy={35}
                        innerRadius={22}
                        outerRadius={30}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                    >
                        <Cell key={`cell-0`} fill={data.color} />
                        <Cell key={`cell-1`} fill="#ecf0f1" />
                    </Pie>
                </PieChart>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                    fontSize: '10px', fontWeight: 'bold', color: '#555',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'
                }}>
                    {Math.round(data.value)}
                </div>
             </div>
             <span style={{fontSize: '11px', color: '#777', marginTop: '-5px', fontWeight: 'bold'}}>{data.name}</span>
          </div>
      );
  };

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
        <h1 style={{ color: '#2ecc71', margin: '0 0 15px 0', fontSize: '2.5rem' }}>KalorieApp 🍎</h1>
        
        {/* Macro Overview */}
        <div style={{
            backgroundColor: 'white', padding: '15px', borderRadius: '16px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px'
        }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '0 10px'}}>
               <span style={{fontWeight: 'bold', color: '#555'}}>Tagesübersicht</span>
               <span style={{fontSize: '12px', color: '#aaa'}}>{new Date().toLocaleDateString()}</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                {macroData.map(m => renderMacroChart(m))}
            </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
          <button 
            onClick={() => setShowFavorites(false)}
            style={{background: 'none', border: 'none', color: !showFavorites ? '#2ecc71' : '#aaa', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'}}
          >
            Suche
          </button>
          <button 
            onClick={() => setShowFavorites(true)}
            style={{background: 'none', border: 'none', color: showFavorites ? '#2ecc71' : '#aaa', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'}}
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
              placeholder="Produktname (z.B. Apfel)..." 
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
            onAddToDaily={() => addToDaily(product)}
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