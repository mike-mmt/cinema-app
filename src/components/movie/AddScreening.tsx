import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

type Props = {
	movieId: string | undefined;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	initialDate?: Date;
	setScreeningsHaveChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddScreening({
	movieId,
	setShow,
	initialDate,
	setScreeningsHaveChanged,
}: Props) {
	const formik = useFormik({
		initialValues: {
			date: initialDate || new Date(),
			type: '2D',
			sound: 'subtitles',
		},
		validationSchema: Yup.object({
			date: Yup.date().required('Wymagane'),
		}),
		onSubmit: async (values) => {
			axios
				.post(import.meta.env.VITE_BACKEND_URL + '/screenings', {
					movieId,
					date: values.date,
					type: values.type,
					sound: values.sound,
				})
				.then((res) => {
					console.log(res);

					setScreeningsHaveChanged(true);
				});

			setShow(false);
		},
	});
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
				<h2 className='text-center text-lg'>Dodaj nowy seans</h2>
				<form
					onSubmit={formik.handleSubmit}
					className='w-4/5 flex flex-col items-center gap-4'
				>
					<DatePicker
						id='date'
						{...formik.getFieldProps('date')}
						selected={formik.values.date}
						onChange={(date: Date) =>
							formik.setFieldValue('date', date)
						}
						className='bg-transparent mt-4 p-3 w-full border rounded-md border-magnolia text-center text-xl font-semibold'
						calendarClassName='bg-slate-700 text-magnolia'
						dayClassName={() => 'text-magnolia'}
						timeClassName={() =>
							'bg-slate-700 text-magnolia hover:text-gunmetal hover:bg-magnolia'
						}
						dateFormat={'dd.MM.yyyy HH:mm'}
						showTimeSelect
						timeFormat='HH:mm'
						timeIntervals={5}
						timeCaption='Godzina'
						// timeClassName={() => "bg-slate-700 text-magnolia"}
						// dateFormat="dd.MM"
					/>
					<select
						id='type'
						{...formik.getFieldProps('type')}
						className='bg-outer-space-half text-magnolia px-2 py-1'
					>
						<option value='2D' label='2D'>
							2D
						</option>
						<option value='3D' label='3D'>
							3D
						</option>
					</select>
					<select
						id='sound'
						{...formik.getFieldProps('sound')}
						className='bg-outer-space-half text-magnolia px-2 py-1 *:text-black'
					>
						<option value='subtitles' label='subtitles'>
							subtitles
						</option>
						<option value='dubbing' label='dubbing'>
							dubbing
						</option>
						<option value='narrator' label='narrator'>
							narrator
						</option>
					</select>
					<button type='submit' className='form-button mt-4 w-fit'>
						Dodaj
					</button>
				</form>
			</div>
		</div>
	);
}
