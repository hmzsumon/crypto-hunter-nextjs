'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import parse from 'html-react-parser';

import CoinInfo from '@/components/CoinInfo';
import { SingleCoin } from '@/config/api';
import { numberWithCommas } from '@/components/CoinsTable';
import { CryptoState } from '@/context/CryptoContext';

const CoinPage = () => {
	const { id } = useParams();
	const [coin, setCoin] = useState<any>(null);
	const { currency, symbol } = CryptoState();

	const fetchCoin = async () => {
		const { data } = await axios.get(SingleCoin(id));
		setCoin(data);
	};

	useEffect(() => {
		fetchCoin();
	}, []);

	if (!coin) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<div className='w-16 h-16 border-4 border-yellow-500 border-t-transparent border-dashed rounded-full animate-spin'></div>
			</div>
		);
	}

	return (
		<div className='flex flex-col md:flex-row p-4 md:p-10'>
			<div className='md:w-1/3 flex flex-col items-center border-r border-gray-600 p-4'>
				<img
					src={coin?.image.large}
					alt={coin?.name}
					className='w-52 h-52 mb-4'
				/>
				<h1 className='text-3xl font-bold mb-4'>{coin?.name}</h1>
				<p className='text-gray-300 mb-6 text-justify'>
					{parse(coin?.description.en.split('. ')[0])}.
				</p>

				<div className='w-full space-y-4'>
					<div className='flex justify-between'>
						<h2 className='text-lg font-semibold'>Rank:</h2>
						<p className='text-lg'>{numberWithCommas(coin?.market_cap_rank)}</p>
					</div>

					<div className='flex justify-between'>
						<h2 className='text-lg font-semibold'>Current Price:</h2>
						<p className='text-lg'>
							{symbol}{' '}
							{numberWithCommas(
								coin?.market_data.current_price[currency.toLowerCase()]
							)}
						</p>
					</div>

					<div className='flex justify-between'>
						<h2 className='text-lg font-semibold'>Market Cap:</h2>
						<p className='text-lg'>
							{symbol}{' '}
							{numberWithCommas(
								coin?.market_data.market_cap[currency.toLowerCase()]
									.toString()
									.slice(0, -6)
							)}
							M
						</p>
					</div>
				</div>
			</div>

			<div className='flex-grow mt-6 md:mt-0 md:ml-6'>
				<CoinInfo coin={coin} />
			</div>
		</div>
	);
};

export default CoinPage;
