// type Props = {};

import RegisterForm from "./RegisterForm";

export default function Register() {
  return (
    <div className="background-all w-full h-screen">
      <div className="content-wrapper m-6 p-8 pb-12 bg-outer-space-half rounded-md">
        <h1 className="font-redhat text-3xl ml-10">Dołącz do OmniKina</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
