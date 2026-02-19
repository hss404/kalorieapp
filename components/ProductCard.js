import React from 'react';

const ProductCard = ({ 
  name, 
  brand, 
  calories, 
  carbs, 
  protein, 
  fat, 
  imageUrl, 
  onAddToDaily,
  isFavorite, 
  onToggleFavorite 
}) => {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '15px',
      marginBottom: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      alignItems: 'center',
      gap: '15px',
      position: 'relative',
      border: '1px solid #eee'
    }}>
      {/* Product Image */}
      <div style={{
        width: '70px',
        height: '70px',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #eee'
      }}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        ) : (
          <span style={{fontSize: '24px'}}>🍎</span>
        )}
      </div>

      {/* Product Info */}
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
            <div style={{marginRight: '10px'}}>
                <h3 style={{margin: '0 0 4px 0', fontSize: '16px', color: '#2c3e50', fontWeight: '600', lineHeight: '1.2'}}>{name || 'Unbekanntes Produkt'}</h3>
                <p style={{margin: '0', fontSize: '13px', color: '#7f8c8d'}}>{brand || 'Keine Marke'}</p>
            </div>
        </div>

        {/* Macros Grid */}
        <div style={{display: 'flex', gap: '12px', fontSize: '12px', color: '#555'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <span style={{fontWeight: 'bold', color: '#e67e22'}}>{Math.round(calories || 0)}</span>
                <span style={{fontSize: '10px', color: '#95a5a6'}}>kcal</span>
            </div>
            <div style={{width: '1px', backgroundColor: '#eee'}}></div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <span style={{fontWeight: 'bold', color: '#3498db'}}>{Math.round(protein || 0)}g</span>
                <span style={{fontSize: '10px', color: '#95a5a6'}}>Prot</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <span style={{fontWeight: 'bold', color: '#f1c40f'}}>{Math.round(carbs || 0)}g</span>
                <span style={{fontSize: '10px', color: '#95a5a6'}}>Carb</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <span style={{fontWeight: 'bold', color: '#e74c3c'}}>{Math.round(fat || 0)}g</span>
                <span style={{fontSize: '10px', color: '#95a5a6'}}>Fett</span>
            </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center'}}>
         <button 
            onClick={onToggleFavorite}
            style={{
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: isFavorite ? '#f1c40f' : '#ccc',
                padding: '0',
                lineHeight: '1'
            }}
            title="Zu Favoriten hinzufügen"
        >
            {isFavorite ? '★' : '☆'}
        </button>

        <button 
            onClick={onAddToDaily}
            style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#2ecc71',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(46, 204, 113, 0.3)',
            transition: 'transform 0.1s'
            }}
            title="Zum Tagesziel hinzufügen"
        >
            +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;