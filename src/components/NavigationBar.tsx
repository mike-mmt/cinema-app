import { Link } from "react-router-dom";
import Logo from "./navbar/Logo";
import LoginButton from "./navbar/LoginButton";

export default function NavigationBar() {
  return (
    <div className="navbar z-50 bg-black flex p-1 justify-between items-center w-full h-20">
      <div className="m-6 flex items-center gap-10">
        <Logo />
        <Link to={"/repertoire"} className="text-outer-space">
          Repertuar
        </Link>
      </div>
      <div className="m-6 flex items-center gap-6 font-medium tracking-wide">
        <LoginButton link="/login" text="Zaloguj się" />
        <LoginButton link="/register" text="Utwórz konto" />
      </div>
    </div>
  );
}
