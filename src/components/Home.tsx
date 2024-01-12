import GradientBackground from "./GradientBackground";
import LoginButton from "./navbar/LoginButton";

export default function Home() {
  return (
    // <div className="bg-black">
    <div className="main-home flex justify-center w-full h-screen">
      <GradientBackground />
      <div className="content-wrapper top-0 left-0 w-full h-fit z-0 flex flex-col items-center">
        <div className="flex flex-col items-center home-box w-1/2 min-h-24 mt-24 text-5xl font-righteous">
          <p>OmniKino.</p>
          <p>Jedyne w swoim rodzaju.</p>
        </div>
        <div className="flex gap-10 mt-20 justify-between items-center font-bold tracking-wider">
          <LoginButton
            link="/login"
            text="Zaloguj się"
            styles="min-h-16 min-w-44 text-xl"
          />
          <LoginButton
            link="/register"
            text="Zarejestruj się"
            styles="min-h-16 min-w-44 text-xl"
          />
        </div>
      </div>
    </div>
  );
}
