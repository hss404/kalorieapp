// Updated pages/index.js to fix SSR issues and restore functionality

import React from 'react';
import { fetchData } from '../utils/api';

const Home = ({ data }) => {
    return (
        <div>
            <h1>Welcome to Kalorie App</h1>
            <p>Data from server:</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export async function getServerSideProps() {
    const data = await fetchData();
    return {
        props: { data }, // will be passed to the page component as props
    };
}

export default Home;