'use client';
import Carousel from './Carousel';

function Banner() {
	return (
		<div className=''>
			<div className='flex flex-col pt-25 justify-around h-[400px]'>
				<div className='flex h-[40%] flex-col justify-center text-center'>
					<p
						className='text-3xl'
						style={{
							fontWeight: 'bold',
							marginBottom: 15,
							fontFamily: 'Montserrat',
						}}
					>
						Crypto Hunter
					</p>
					<p
						className='text-md'
						style={{
							color: 'darkgrey',
							textTransform: 'capitalize',
							fontFamily: 'Montserrat',
						}}
					>
						Get all the Info regarding your favorite Crypto Currency
					</p>
				</div>
				<Carousel />
			</div>
		</div>
	);
}

export default Banner;
