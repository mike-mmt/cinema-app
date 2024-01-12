import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to={"/"} className="flex justify-center items-center gap-2">
      <img src="omnikino-logo.svg" alt="logo OmniKino" className="h-14" />
      <img src="src/assets/omnikino.svg" alt="OmniKino" className="h-7" />
      {/* <p className="text-crimson font-sans font-bold text-3xl">OmniKino</p>; */}
    </Link>
  );
}
