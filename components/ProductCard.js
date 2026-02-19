import React from 'react';

export default function ProductCard({ name, brand, calories, carbs, protein, fat, imageUrl }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginRight: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        overflow: 'hidden'
      }}>
        {imageUrl ? <img src={imageUrl} alt={name} style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : '🍎'}
      </div>
      
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{name}</h3>
        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{brand}</p>
        
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
          <div style={{ color: '#e67e22', fontWeight: 'bold' }}>⚡ {calories} kcal</div>
          <div>🍞 {carbs}g KH</div>
          <div>🥩 {protein}g Prot</div>
          <div>🥑 {fat}g Fett</div>
        </div>
      </div>
      
      <button style={{
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        +
      </button>
    </div>
  );
}