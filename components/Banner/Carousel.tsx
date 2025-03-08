'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import Link from 'next/link';

import { TrendingCoins } from '../../config/api';
import { numberWithCommas } from '../CoinsTable';
import { CryptoState } from '@/context/CryptoContext';

// Define the TypeScript type for the coin data
interface Coin {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	price_change_percentage_24h: number;
}

const Carousel = () => {
	const [trending, setTrending] = useState<Coin[]>([]);
	const { currency, symbol } = CryptoState();

	// Fetch trending coins with proper error handling
	const fetchTrendingCoins = async () => {
		try {
			const { data } = await axios.get<Coin[]>(TrendingCoins(currency));
			setTrending(data);
		} catch (error) {
			console.error('Failed to fetch trending coins', error);
		}
	};

	useEffect(() => {
		fetchTrendingCoins();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency]);

	// Prepare carousel items
	const items = trending.map((coin) => {
		const profit = coin.price_change_percentage_24h >= 0;

		return (
			<Link
				key={coin.id}
				href={`/coins/${coin.id}`}
				className='flex flex-col items-center uppercase px-2 cursor-pointer'
			>
				<img
					src={coin.image}
					alt={coin.name}
					className='w-20 h-20 object-contain mb-2'
				/>
				<span>
					{coin.symbol}&nbsp;
					<span
						style={{
							color: profit ? 'rgb(14, 203, 129)' : 'red',
							fontWeight: 500,
						}}
					>
						{profit && '+'}
						{coin.price_change_percentage_24h.toFixed(2)}%
					</span>
				</span>
				<span style={{ fontSize: 22, fontWeight: 500 }}>
					{symbol} {numberWithCommas(coin.current_price.toFixed(2))}
				</span>
			</Link>
		);
	});

	// Define responsive behavior for the carousel
	const responsive = {
		0: {
			items: 2,
		},
		512: {
			items: 4,
		},
	};

	return (
		<div className='h-[50%] flex items-center'>
			<AliceCarousel
				mouseTracking
				infinite
				autoPlayInterval={1000}
				animationDuration={1500}
				disableDotsControls
				disableButtonsControls
				responsive={responsive}
				items={items}
				autoPlay
			/>
		</div>
	);
};

export default Carousel;
