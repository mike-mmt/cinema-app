import { useContext, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { AdminContext } from '../../contexts/AdminContext';
import axios from 'axios';

type Props = {
	src: string;
	className: string;
	movieId: string;
	setHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Image({ src, className, movieId, setHasChanged }: Props) {
	const [fullScreen, setFullScreen] = useState<boolean>(false);
	const adminContext = useContext(AdminContext);

	function handleClick(event: React.MouseEvent) {
		event.stopPropagation();
		setFullScreen(!fullScreen);
	}

	async function handleDelete(event: React.MouseEvent) {
		event.stopPropagation();
		const response = await axios.delete(process.env.BACKEND_URL + '/movie/' + movieId + '/galleryPhoto', {
			params: {
				galleryPhotoUrl: src,
			},
		});
		setHasChanged(true);
		console.log(response);
	}

	return (
		<>
			<div className='relative'>
				<img src={src} className={className} onClick={(e) => handleClick(e)}></img>
				{adminContext?.isAdmin && (
					<MdDeleteForever
						color='red'
						size='1.5em'
						className='absolute top-0 right-0 m-1 hover:bg-outer-space-half rounded-xl'
						onClick={(e) => handleDelete(e)}
					/>
				)}
			</div>

			{fullScreen && (
				<div className='fixed flex justify-center items-center inset-0 h-[90vh] z-50 mt-2  hover:cursor-pointer'>
					<img src={src} className='h-full' onClick={(e) => handleClick(e)}></img>
				</div>
			)}
		</>
	);
}
