import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

type Props = {
	movieId: string | undefined;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

interface ValuesType {
	trailerUrl: string;
}

export default function AddTrailer({ movieId, setShow }: Props) {
	const formik = useFormik({
		initialValues: {
			trailerUrl: '',
		},
		validationSchema: Yup.object({
			trailerUrl: Yup.string().trim().required(),
		}),
		onSubmit: (values: ValuesType) => {
			sendTrailer(values);
			setShow(false);
		},
	});

	async function sendTrailer(values: ValuesType) {
		const body = {
			...values,
		};

		const response = await axios.patch(import.meta.env.VITE_BACKEND_URL + '/movie/' + movieId, body);
		console.log(response);
	}

	return (
		<div className='fixed inset-0 flex items-start justify-center z-50'>
			<div className='absolute inset-0 bg-black opacity-50'></div>
			<div className='bg-gunmetal mt-16 px-6 pt-3 pb-8 rounded shadow-lg z-10 flex flex-col items-center w-3/5'>
				<p
					onClick={() => setShow(false)}
					className='self-end text-lg border rounded-lg border-magnolia px-3 text-center align-middle duration-100 hover:border-rosered hover:text-rosered'
				>
					x
				</p>
				<h2 className='text-center text-lg'>Dodaj trailer</h2>
				<form onSubmit={formik.handleSubmit} className='w-4/5 flex flex-col items-center gap-4'>
					<label htmlFor='trailerUrl'>Link do YouTube</label>
					<input
						id='trailerUrl'
						type='text'
						{...formik.getFieldProps('trailerUrl')}
						className='bg-gunmetal text-magnolia border-b-2 border-magnolia w-full'
					/>
					{formik.touched.trailerUrl && formik.errors.trailerUrl ? (
						<div className='formikError'>{formik.errors.trailerUrl}</div>
					) : null}
					<button type='submit' className='form-button mt-4 w-fit text-magnolia'>
						Dodaj
					</button>
				</form>
			</div>
		</div>
	);
}
