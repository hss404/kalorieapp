// Import necessary libraries
import React from 'react';
import { Bar } from 'react-chartjs-2';

const MacroTracker = ({ macros }) => {
    const data = {
        labels: ['Protein', ' Carbs', 'Fats'],
        datasets: [{
            label: 'Macros',
            data: [macros.protein, macros.carbs, macros.fats],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        }],
    };

    return <Bar data={data} />;
};

const IndexPage = () => {
    const [macros, setMacros] = React.useState({ protein: 0, carbs: 0, fats: 0 });

    const handleMacroChange = (e) => {
        const { name, value } = e.target;
        setMacros({ ...macros, [name]: Number(value) });
    };

    return (
        <div>
            <h1>Macro Tracker</h1>
            <input type='number' name='protein' onChange={handleMacroChange} placeholder='Protein' />
            <input type='number' name='carbs' onChange={handleMacroChange} placeholder='Carbs' />
            <input type='number' name='fats' onChange={handleMacroChange} placeholder='Fats' />
            <MacroTracker macros={macros} />
        </div>
    );
};

export default IndexPage;