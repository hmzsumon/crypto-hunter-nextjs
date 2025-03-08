'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CoinList } from '../config/api';
import { CryptoState } from '@/context/CryptoContext';
import { useRouter } from 'next/navigation';

export function numberWithCommas(x: number | string) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface Coin {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	price_change_percentage_24h: number;
	market_cap: number;
}

export default function CoinsTable() {
	const [coins, setCoins] = useState<Coin[]>([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	const { currency, symbol } = CryptoState();
	const router = useRouter();

	const fetchCoins = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(CoinList(currency));
			setCoins(data);
		} catch (error) {
			console.error('Failed to fetch coins data', error);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchCoins();
	}, [currency]);

	const handleSearch = () => {
		return coins.filter(
			(coin) =>
				coin.name.toLowerCase().includes(search.toLowerCase()) ||
				coin.symbol.toLowerCase().includes(search.toLowerCase())
		);
	};

	const handlePageChange = (value: number) => {
		setPage(value);
		window.scrollTo({ top: 450, behavior: 'smooth' });
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-4xl font-bold text-center mb-6'>
				Cryptocurrency Prices by Market Cap
			</h1>

			<input
				type='text'
				placeholder='Search For a Cryptocurrency...'
				className='w-full p-2 mb-6 border border-gray-500 rounded bg-gray-900 text-white'
				onChange={(e) => setSearch(e.target.value)}
			/>

			<div className='overflow-x-auto'>
				{loading ? (
					<div className='w-full h-2 bg-gray-200 rounded-full'>
						<div className='h-2 bg-yellow-500 rounded-full animate-pulse' />
					</div>
				) : (
					<table className='w-full text-sm text-left text-gray-500'>
						<thead className='text-xs uppercase bg-yellow-500 text-black'>
							<tr>
								{['Coin', 'Price', '24h Change', 'Market Cap'].map((head) => (
									<th
										key={head}
										className='px-6 py-3 font-bold'
										align={head === 'Coin' ? 'left' : 'right'}
									>
										{head}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{handleSearch()
								.slice((page - 1) * 10, (page - 1) * 10 + 10)
								.map((row) => {
									const profit = row.price_change_percentage_24h > 0;
									return (
										<tr
											key={row.id}
											onClick={() => router.push(`/coins/${row.id}`)}
											className='cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all'
										>
											<td className='flex items-center px-6 py-4 whitespace-nowrap'>
												<img
													src={row.image}
													alt={row.name}
													className='w-10 h-10 mr-4'
												/>
												<div className='flex flex-col'>
													<span className='uppercase font-bold text-white'>
														{row.symbol}
													</span>
													<span className='text-gray-400'>{row.name}</span>
												</div>
											</td>
											<td className='px-6 py-4 text-right text-white'>
												{symbol}{' '}
												{numberWithCommas(row.current_price.toFixed(2))}
											</td>
											<td
												className={`px-6 py-4 text-right font-bold ${
													profit ? 'text-green-500' : 'text-red-500'
												}`}
											>
												{profit && '+'}
												{row.price_change_percentage_24h.toFixed(2)}%
											</td>
											<td className='px-6 py-4 text-right text-white'>
												{symbol}{' '}
												{numberWithCommas(
													row.market_cap.toString().slice(0, -6)
												)}
												M
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				)}
			</div>

			<div className='flex justify-center mt-6'>
				<div className='flex space-x-2'>
					{Array.from(
						{ length: Math.ceil(handleSearch().length / 10) },
						(_, i) => (
							<button
								key={i + 1}
								onClick={() => handlePageChange(i + 1)}
								className={`px-4 py-2 border rounded ${
									page === i + 1
										? 'bg-yellow-500 text-black'
										: 'bg-gray-800 text-white hover:bg-gray-700'
								}`}
							>
								{i + 1}
							</button>
						)
					)}
				</div>
			</div>
		</div>
	);
}
