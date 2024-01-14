import { FormikProps } from 'formik';
import { valuesType } from './AddMovieForm';

type Props = {
	field: string;
	label: string;
	type: string;
	formik: FormikProps<valuesType>;
	attrs?: {
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	};
};

export default function FormField({
	field,
	label,
	type,
	formik,
	attrs,
}: Props) {
	return (
		<div className={'form-field flex flex-col'}>
			<label htmlFor={field}>{label}</label>
			<input
				id={field}
				type={type}
				{...formik.getFieldProps(field)}
				{...attrs}
			/>
			{formik.touched[field as keyof valuesType] &&
			formik.errors[field as keyof valuesType] ? (
				<div className='formikError'>
					{formik.errors[field as keyof valuesType]}
				</div>
			) : null}
		</div>
	);
}
