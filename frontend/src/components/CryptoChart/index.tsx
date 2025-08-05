import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { getHistoryBySymbol } from '../../services/api';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import './styles.css';


ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const SYMBOLS = ['BTC', 'ETH', 'SOL'];

const METRICS: Record<string, string> = {
    price: 'Precio',
    volume_24h: 'Volumen 24h',
    percent_change_1h: '% Cambio 1h',
    percent_change_24h: '% Cambio 24h',
    percent_change_7d: '% Cambio 7d',
};

const TIME_RANGES: Record<string, number> = {
    '5min': 5,
    '15min': 15,
    '30min': 30,
    '60min': 60,
};

const CryptoChart = () => {
    const [selectedSymbol, setSelectedSymbol] = useState('BTC');
    const [selectedMetric, setSelectedMetric] = useState('price');
    const [selectedRange, setSelectedRange] = useState('60min');
    const [rawData, setRawData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const toastShown = useRef(false);


    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getHistoryBySymbol(selectedSymbol);
            setRawData(data);
            if (!toastShown.current) {
                toast.success('¡Datos cargados con éxito!');
                toastShown.current = true;
            }
        } catch (err) {
            console.error(`[Error] al obtener historial de ${selectedSymbol}:`, err);
            toast.error('Error al obtener los datos de la criptomoneda');
            toastShown.current = false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [selectedSymbol]);

    useEffect(() => {
        if (!rawData.length) return;

        const now = new Date();
        const minutesAgo = TIME_RANGES[selectedRange];
        const fromTime = new Date(now.getTime() - minutesAgo * 60 * 1000);

        const filtered = rawData.filter((d) => new Date(d.timestamp) >= fromTime);

        const labels = filtered.map((d) =>
            new Date(d.timestamp).toLocaleTimeString()
        );
        const values = filtered.map((d) => parseFloat(d[selectedMetric]));

        setChartData({
            labels,
            datasets: [
                {
                    label: `${selectedSymbol} - ${METRICS[selectedMetric]}`,
                    data: values,
                    borderColor: 'white',
                    backgroundColor: 'white',
                    tension: 0,
                    fill: true,
                    pointRadius: 2,
                    segment: {
                        borderColor: (ctx: any) => {
                            const { p0, p1 } = ctx;
                            return p1.parsed.y > p0.parsed.y ? 'rgba(46,189,133,1)' : 'rgba(246,70,93,1)';
                        },
                        backgroundColor: (ctx: any) => {
                            const { p0, p1 } = ctx;
                            return p1.parsed.y > p0.parsed.y
                                ? 'rgba(46,189,133,1)'
                                : 'rgba(246,70,93,1)';
                        },
                    },
                },
            ],
        });

    }, [rawData, selectedMetric, selectedRange]);

    return (
        <div>
            <h2>Visualizador de Criptomonedas</h2>

            <div className="crypto-chart-controls">
                <label>Criptomoneda: </label>
                <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                >
                    {SYMBOLS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <label>Métrica: </label>
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                >
                    {Object.entries(METRICS).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>

                <label>Rango: </label>
                <select
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                >
                    {Object.entries(TIME_RANGES).map(([label, _]) => (
                        <option key={label} value={label}>
                            Últimos {label}
                        </option>
                    ))}
                </select>
            </div>

            {loading || !chartData ? (
                <div className="spinner-container">
                    <ClipLoader color="#ffffff" size={50} />
                </div>
            ) : (
                <div className="crypto-chart-container">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: 'white',
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    ticks: { color: 'white' },
                                    grid: { color: '#2B3139' },
                                },
                                y: {
                                    ticks: { color: 'white' },
                                    grid: { color: '#2B3139' },
                                },
                            },
                            layout: {
                                padding: 10,
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CryptoChart;
