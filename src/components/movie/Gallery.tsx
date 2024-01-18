import React, { useContext } from 'react';
import Image from './Image';
import { AdminContext } from '../../contexts/AdminContext';
import { MovieType } from '../repertoire/Repertoire';
import AddPhoto from './AddPhoto';

type Props = {
	movie: MovieType;
	showAddPhoto: boolean;
	setShowAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
	setContentHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
	movieId: string;
};

export default function Gallery({
	movie,
	showAddPhoto,
	setShowAddPhoto,
	setContentHasChanged,
	movieId,
}: Props) {
	const adminContext = useContext(AdminContext);
	return (
		<>
			<div className='w-11/12 mt-8 self-center border-b-2 border-b-slate-500'>
				<p className='ml-10 p-2 font-medium text-xl'>Galeria</p>
			</div>
			{/* <div className='galleryWrapper w-full grid auto-cols-auto grid-flow-col-dense auto-rows-[12em] gap-2 mt-6 ml-8'> */}
			<div className='galleryWrapper w-full flex flex-wrap gap-2 mt-6 ml-8'>
				{movie?.galleryPhotoUrls.map((photoUrl, index) => (
					<Image
						key={index}
						setHasChanged={setContentHasChanged}
						src={photoUrl}
						movieId={movieId || ''}
						className='h-48'
					/>
				))}
				{adminContext?.isAdmin && (
					<p
						onClick={() => setShowAddPhoto(true)}
						className='cursor-pointer self-center bg-outer-space-quarter border border-magnolia hover:border-rosered hover:text-rosered hover:bg-transparent transition-colors duration-100 px-6 py-3 w-fit rounded-md text-lg text-center align-middle'
					>
						+
					</p>
				)}
				{showAddPhoto && (
					<AddPhoto setShow={setShowAddPhoto} movieId={movieId} />
				)}
			</div>
		</>
	);
}
