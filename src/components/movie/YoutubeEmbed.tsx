type Props = {
	className?: string;
	src: string;
};
export default function YoutubeEmbed({ className = '', src }: Props) {
	return (
		<div className='video-responsive w-full flex justify-center items-center'>
			<iframe
				className={'h-[480px] w-[853px] max-w-11/12 ' + className}
				// width='853'
				src={src}
				frameBorder='0'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
				title='Embedded youtube'
			/>
		</div>
	);
}
