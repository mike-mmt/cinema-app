import StaticGradientBg from "../StaticGradientBg";
import AddMovieForm from "./AddMovieForm";

// type Props = {};

export default function AddMovie() {
  return (
    <StaticGradientBg>
      <div className="content-wrapper m-6 p-8 pb-12 bg-outer-space-half rounded-md flex flex-col items-center">
        <h1 className="font-redhat text-3xl ml-10">Dodaj nowy film</h1>
        <AddMovieForm />
      </div>
    </StaticGradientBg>
  );
}
