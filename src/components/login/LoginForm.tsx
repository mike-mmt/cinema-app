import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { setToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import { AdminContext } from "../../contexts/AdminContext";

interface valuesType {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [responseOutput, setResponseOutput] = useState("");
  const loginContext = useContext(LoginContext);
  const adminContext = useContext(AdminContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Not a valid email").required("Wymagane"),
      password: Yup.string()
        .required("Wymagane")
        .max(128, "Maksymalnie 128 znaków"),
    }),
    onSubmit: (values) => {
      logIn(values);
      formik.resetForm();
    },
  });

  async function logIn(values: valuesType) {
    try {
      console.log(values);

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/login",
        values
      );
      if (response.status === 200 && response.data.token) {
        setToken(response.data.token, response.data.isAdmin || false);
        loginContext?.setLoggedIn(true);
        adminContext?.setIsAdmin(response.data.isAdmin || false);
        // setTimeout(() => {
        navigate("/repertoire");

        // }, 200);
      }

      console.log(response.status, response.data);
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
    <div className="flex flex-col items-center gap-16 max-h-fit w-full">
      <form
        className="form flex gap-8 w-fit mt-8 ml-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="input-field flex flex-col">
          <label className="" htmlFor="email">
            E-mail
          </label>
          <input id="email" type="email" {...formik.getFieldProps("email")} />
          {formik.touched.email && formik.errors.email ? (
            <div className="formikError">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="input-field flex flex-col">
          <label htmlFor="password">Hasło</label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="formikError">{formik.errors.password}</div>
          ) : null}
        </div>
      </form>
      <button className="form-button w-fit" onClick={formik.submitForm}>
        Zaloguj się
      </button>
      <div className="response-output-wrapper self-center flex flex-grow flex-col gap-10 h-full justify-around items-center align-center w-2/5">
        <div className="p-5 min-w-8 min-h-4 rounded-md h-fit text-lg text-magnolia">
          {responseOutput !== "" && <p>{responseOutput}</p>}
        </div>
      </div>
    </div>
  );
}
