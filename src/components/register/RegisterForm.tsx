import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import LoginButton from "../navbar/LoginButton";

interface valuesType {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default function RegisterForm() {
  const [responseOutput, setResponseOutput] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Not a valid email").required("Required"),
      firstName: Yup.string()
        .required("Required")
        .max(32, "Maksymalnie 32 znaki"),
      lastName: Yup.string()
        .required("Required")
        .max(32, "Maksymalnie 32 znaki"),
      password: Yup.string()
        .required("Required")
        .max(128, "Maksymalnie 128 znaków"),
    }),
    onSubmit: (values) => {
      sendRegisterData(values);
      formik.resetForm();
    },
  });

  async function sendRegisterData(values: valuesType) {
    try {
      const response = await axios.post(
        //import.meta.env.BACKEND_URL
        "http://localhost:5000" + "/register",
        values
      );
      console.log(response.status, response.data);

      if (response.status === 201) {
        setResponseOutput("Konto utworzone.");
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
          setResponseOutput("Błąd: Brak odpowiedzi serwera.");
        } else {
          console.log("Error", error.message);
          setResponseOutput("Nieoczekiwany błąd");
        }
      } else {
        // handle non-axios errors here
        console.log("Error", error);
        setResponseOutput(`Error: ${error}`);
      }
    }
  }

  return (
    <div className="flex flex-row justify-between max-h-fit">
      <form
        className="register-form flex flex-col gap-2 w-2/5 mt-8 ml-4"
        onSubmit={formik.handleSubmit}
      >
        <label className="" htmlFor="email">
          E-mail
        </label>
        <input id="email" type="email" {...formik.getFieldProps("email")} />
        {formik.touched.email && formik.errors.email ? (
          <div className="formikError">{formik.errors.email}</div>
        ) : null}
        <label htmlFor="firstName">Imię</label>
        <input
          id="firstName"
          type="text"
          {...formik.getFieldProps("firstName")}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <div className="formikError">{formik.errors.firstName}</div>
        ) : null}
        <label htmlFor="lastName">Nazwisko</label>
        <input
          id="lastName"
          type="text"
          {...formik.getFieldProps("lastName")}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <div className="formikError">{formik.errors.lastName}</div>
        ) : null}
        <label htmlFor="password">Hasło</label>
        <input
          id="password"
          type="password"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="formikError">{formik.errors.password}</div>
        ) : null}
        <button className="mt-4" type="submit">
          Utwórz konto
        </button>
      </form>
      <div className="response-output-wrapper self-center flex flex-grow flex-col gap-10 h-full justify-around items-center align-center w-2/5">
        <div className="p-5 min-w-8 min-h-4 rounded-md h-fit text-lg text-magnolia">
          {responseOutput !== "" && <p>{responseOutput}</p>}
        </div>
        <LoginButton
          link="/login"
          text="Zaloguj się"
          styles="bg-outer-space-quarter border border-magnolia text-lg min-w-40 min-h-14"
        ></LoginButton>
      </div>
    </div>
  );
}
