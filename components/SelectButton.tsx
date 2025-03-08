'use client';
interface SelectButtonProps {
	children: React.ReactNode;
	selected: boolean;
	onClick: () => void;
}

const SelectButton = ({ children, selected, onClick }: SelectButtonProps) => {
	return (
		<span
			onClick={onClick}
			className={`border border-gold rounded-md px-5 py-2 cursor-pointer font-montserrat transition-colors
        ${
					selected
						? 'bg-gold text-black font-bold'
						: 'bg-transparent text-white font-medium'
				}
        hover:bg-gold hover:text-black
        w-1/5 text-center`}
		>
			{children}
		</span>
	);
};

export default SelectButton;
