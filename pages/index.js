import React, { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

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
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Suche
        </button>
      </div>

      <div style={{ border: '2px dashed #ccc', padding: '40px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
        <h3>QR-Code Scan</h3>
        <p>Hier wird später der Kamerastream angezeigt.</p>
        <button style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📷 Kamera starten
        </button>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Beliebte Kategorien</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>🥛 Milchprodukte & Eier</li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>🥦 Obst & Gemüse</li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>🍞 Brot & Backwaren</li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>🥤 Getränke</li>
        </ul>
      </div>
    </div>
  );
}