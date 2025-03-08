'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { HistoricalChart } from '../config/api';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import SelectButton from './SelectButton';
import { chartDays } from '../config/data';
import { CryptoState } from '@/context/CryptoContext';

// Register necessary Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

interface CoinInfoProps {
	coin: {
		id: string;
		name: string;
	};
}

const CoinInfo = ({ coin }: CoinInfoProps) => {
	const [historicData, setHistoricData] = useState<number[][]>([]);
	const [days, setDays] = useState<number>(1);
	const { currency } = CryptoState();
	const [loading, setLoading] = useState<boolean>(true);

	const fetchHistoricData = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				HistoricalChart(coin.id, days, currency)
			);
			setHistoricData(data.prices);
		} catch (error) {
			console.error('Failed to fetch historic data', error);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchHistoricData();
	}, [days]);

	return (
		<div className='flex flex-col items-center justify-center w-full md:w-3/4 mt-6 p-4 md:p-10'>
			{loading ? (
				<div className='flex items-center justify-center'>
					<div className='w-20 h-20 border-4 border-yellow-500 border-dashed rounded-full animate-spin'></div>
				</div>
			) : (
				<>
					<Line
						data={{
							labels: historicData.map((coin) => {
								const date = new Date(coin[0]);
								const time =
									date.getHours() > 12
										? `${date.getHours() - 12}:${date.getMinutes()} PM`
										: `${date.getHours()}:${date.getMinutes()} AM`;
								return days === 1 ? time : date.toLocaleDateString();
							}),
							datasets: [
								{
									data: historicData.map((coin) => coin[1]),
									label: `Price (Past ${days} Days) in ${currency}`,
									borderColor: '#EEBC1D',
								},
							],
						}}
						options={{
							elements: {
								point: {
									radius: 1,
								},
							},
							scales: {
								x: {
									type: 'category',
								},
							},
						}}
					/>
					<div className='flex justify-around w-full mt-6'>
						{chartDays.map((day) => (
							<SelectButton
								key={day.value}
								onClick={() => setDays(day.value)}
								selected={day.value === days}
							>
								{day.label}
							</SelectButton>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default CoinInfo;
