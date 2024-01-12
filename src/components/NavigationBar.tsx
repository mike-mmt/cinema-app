import { Link } from "react-router-dom";
import Logo from "./navbar/Logo";
import LoginButton from "./navbar/LoginButton";
import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";

export default function NavigationBar() {
  const loginContext = useContext(LoginContext);

  return (
    <div className="navbar z-50 bg-black flex p-1 justify-between items-center w-full h-20">
      <div className="m-6 flex items-center gap-10">
        <Logo />
        <Link to={"/repertoire"} className="text-outer-space">
          Repertuar
        </Link>
      </div>
      {loginContext?.loginState.isLoggedIn ? null : ( // null bedzie przyciskiem "konto"
        <div className="m-6 flex items-center gap-6 font-medium tracking-wide">
          <LoginButton link="/login" text="Zaloguj się" />
          <LoginButton link="/register" text="Utwórz konto" />
        </div>
      )}
    </div>
  );
}
