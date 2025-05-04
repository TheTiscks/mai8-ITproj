import { useEffect, useState } from 'react';

export default function OccupancyPage() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/occupancy/chart')
            .then(res => res.json())
            .then(data => setChartData(data.chart));
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Статистика занятости</h1>
            {chartData ? (
                <img
                    src={chartData}
                    alt="График занятости"
                    className="w-full rounded-lg shadow-md border"
                />
            ) : (
                <div className="text-center py-8">Загрузка графика...</div>
            )}
        </div>
    );
}