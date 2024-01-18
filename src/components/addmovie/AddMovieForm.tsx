import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from './FormField';
import axios from 'axios';
import { FormEvent, useState } from 'react';

// type Props = {};
export interface valuesType {
	title: string;
	year: number;
	genres: string;
	director: string;
	actors: string;
	image: File | null;
	photoUrl: string;
}

export default function AddMovieForm() {
	const [responseOutput, setResponseOutput] = useState('');

	const formik = useFormik({
		initialValues: {
			title: '',
			year: 2000,
			genres: '',
			director: '',
			actors: '',
			image: null,
			photoUrl: '',
		},
		validationSchema: Yup.object({
			title: Yup.string().trim().required('Wymagane'),
			year: Yup.number().required('Wymagane'),
			genres: Yup.string().trim().required('Wymagane'),
			director: Yup.string().trim().required('Wymagane'),
			actors: Yup.string().trim().required('Wymagane'),
			image: Yup.mixed().notRequired(),
			photoUrl: Yup.string(),
		}),
		onSubmit: (values: valuesType) => {
			sendMovieData(values);
		},
	});

	async function sendMovieData(values: valuesType) {
		try {
			const genres = values.genres
				.split(',')
				.map((genre) => genre.trim());
			const actors = values.actors
				.split(',')
				.map((actor) => actor.trim());

			const formData = new FormData();
			formData.append('title', values.title);
			formData.append('year', values.year.toString());
			formData.append('director', values.director);
			formData.append('genres', JSON.stringify(genres));
			formData.append('actors', JSON.stringify(actors));
			console.log(values.image);

			if (values.image) {
				formData.append('image', values.image);
			}
			if (values.photoUrl) {
				formData.append('photoUrl', values.photoUrl);
			}

			const response = await axios.post(
				import.meta.env.VITE_BACKEND_URL + '/movie',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);
			console.log(response.status, response.data);

			if (response.status === 201) {
				setResponseOutput('Film dodany.');
				formik.resetForm();
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response) {
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
					setResponseOutput(`Błąd: Niepoprawne dane`);
				} else if (error.request) {
					console.log(error.request);
					setResponseOutput('Błąd: Brak odpowiedzi serwera.');
				} else {
					console.log('Error', error.message);
					setResponseOutput('Nieoczekiwany błąd');
				}
			} else {
				// handle non-axios errors here
				console.log('Error', error);
				setResponseOutput(`Error: ${error}`);
			}
		}
	}

	return (
		// <div className="form-wrapper w- ">
		<form
			onSubmit={formik.handleSubmit}
			className='form flex flex-col items-center gap-5 mt-5 w-4/5 *:w-3/5'
		>
			{/* <label for="file">File upload</label>
      <input
        id="file"
        name="file"
        type="file"
        
        className="form-control"
      /> */}
			<FormField
				field='title'
				label='Tytuł'
				type='text'
				formik={formik}
			/>
			<div className='flex gap-12 *:w-full'>
				<FormField
					field='year'
					label='Rok'
					type='number'
					formik={formik}
					// styles="w-full"
				/>
				<FormField
					field='director'
					label='Reżyser'
					type='text'
					formik={formik}
					// styles="w-full"
				/>
			</div>
			<FormField
				field='genres'
				label='Gatunki oddzielone przecinkami'
				type='text'
				formik={formik}
			/>
			<FormField
				field='actors'
				label='Aktorzy oddzieleni przecinkami'
				type='text'
				formik={formik}
			/>
			<div className='flex flex-col items-center mt-8 gap-6 *:w-4/5'>
				<p className='text-center'>
					Link do plakatu filmu lub plik plakatu:
				</p>
				<FormField
					field='photoUrl'
					label='URL do zdjęcia'
					type='text'
					formik={formik}
				/>
				<input
					id='image'
					name='image'
					type='file'
					accept='image/*'
					onChange={(event: FormEvent) => {
						formik.setFieldValue(
							'image',
							(event.currentTarget as HTMLInputElement)
								.files?.[0] || null,
						);
						formik.setFieldValue('photoUrl', '');
					}}
				/>
			</div>
			<button className='form-button mt-8 max-w-fit' type='submit'>
				Dodaj film
			</button>
			<div className='my-6 p-2'>
				{responseOutput && <p>{responseOutput}</p>}
			</div>
		</form>
		// </div>
	);
}
