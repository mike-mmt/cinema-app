import { useFormik } from 'formik';
import { useRef } from 'react';
import * as Yup from 'yup';

import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

type Props = {
	movieId: string | undefined;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

interface ValuesType {
	photoUrls: string;
	photoFiles: File[] | null;
}

export default function AddPhoto({ movieId, setShow }: Props) {
	const fileRef = useRef<HTMLInputElement | null>(null);

	const formik = useFormik({
		initialValues: {
			photoUrls: '',
			photoFiles: null,
		},
		validationSchema: Yup.object({
			photoUrls: Yup.string(),
			photoFiles: Yup.string().notRequired(),
		}),
		onSubmit: (values: ValuesType) => {
			sendGalleryImages(values);
			setShow(false);
		},
	});

	async function sendGalleryImages(values: ValuesType) {
		const formData = new FormData();
		// formData.append('movieId', movieId || '');
		values.photoUrls?.split(',').forEach((url: string) => {
			formData.append('galleryPhotoUrls', url.trim());
		});
		for (const file of fileRef.current?.files || []) {
			formData.append('galleryImages', file);
		}

		const response = await axios.patch(
			// 'http://localhost:5000/movie/65a441df0ef18e3b0ef7e6ef',
			process.env.BACKEND_URL + '/movie/' + movieId,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);
		console.log(response);
	}

	return (
		<div className='fixed inset-0 flex items-start justify-center z-50'>
			<div className='absolute inset-0 bg-black opacity-50'></div>
			<div className='bg-gunmetal mt-16 px-6 pt-3 pb-8 rounded shadow-lg z-10 flex flex-col items-center'>
				<p
					onClick={() => setShow(false)}
					className='self-end text-lg border rounded-lg border-magnolia px-3 text-center align-middle duration-100 hover:border-rosered hover:text-rosered'
				>
					x
				</p>
				<h2 className='text-center text-lg'>Dodaj zdjęcia</h2>
				<form
					onSubmit={formik.handleSubmit}
					className='w-4/5 flex flex-col items-center gap-4 text-gunmetal *:bg-gunmetal *:text-magnolia'
				>
					<label htmlFor='photoUrls'>Linki URL do zdjęć</label>
					<textarea
						id='photoUrls'
						wrap='hard'
						cols={80}
						rows={10}
						className='border-2 rounded-sm border-magnolia'
						{...formik.getFieldProps('photoUrls')}
					/>
					{formik.touched.photoUrls && formik.errors.photoUrls ? (
						<div className='formikError'>{formik.errors.photoUrls}</div>
					) : null}
					<label htmlFor='photoFiles'>Pliki zdjęć</label>
					<input
						ref={fileRef}
						id='photoFiles'
						type='file'
						multiple
						{...formik.getFieldProps('photoFiles')}
						// onChange={(event: FormEvent) => {
						// 	formik.setFieldValue(
						// 		'photoFiles',
						// 		(event.currentTarget as HTMLInputElement).files,
						// 	);
						// 	formik.setFieldValue('photoUrl', '');
						// }}
						className='text-magnolia'
					/>
					{formik.touched.photoFiles && formik.errors.photoFiles ? (
						<div className='formikError'>{formik.errors.photoFiles}</div>
					) : null}
					<button type='submit' className='form-button mt-4 w-fit text-magnolia'>
						Dodaj
					</button>
				</form>
			</div>
		</div>
	);
}
