import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getHistoryBySymbol = async (symbol: string) => {
    const res = await axios.get(`${API_URL}/api/cryptos/history/${symbol}`);
    return res.data;
};
