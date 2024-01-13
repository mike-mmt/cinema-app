import { useContext } from "react";
import { MovieType } from "./Repertoire";
import { LoginContext } from "../../contexts/LoginContext";
import { useNavigate } from "react-router";

type Props = { movie: MovieType };

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  type ScreeningSoundMap = {
    [key: string]: string;
  };

  const screeningSoundMap: ScreeningSoundMap = {
    subtitles: "Napisy",
    narrator: "Lektor",
    dubbing: "Dubbing",
  };

  const handleScreeningClick = (
    event: React.MouseEvent,
    screeningId: string
  ) => {
    event.stopPropagation();
    if (loginContext?.loggedIn) {
      navigate(`/screening/${screeningId}`);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  return (
    <div
      className="grid-item flex items-center bg-outer-space-quarter hover:bg-outer-space-8th transition-colors duration-200 rounded-md p-2"
      onClick={handleCardClick}
    >
      <img src={movie.photoUrl} className="m-4 w-4/12"></img>
      <div className="info flex flex-col w-full">
        <div className="title-genres-wrapper border-b-2 pb-4 border-b-outer-space-quarter">
          <h2 className="break-normal text-xl font-semibold text-center ">
            {movie.title}
          </h2>
        </div>
        <div className="screenings-wrapper flex flex-wrap gap-3 py-5 px-3">
          {movie.screenings.map((screening, index) => {
            const date = new Date(screening.date);
            return (
              <div
                key={index}
                onClick={(e) => handleScreeningClick(e, screening._id)}
                className="bg-outer-space-quarter border border-magnolia hover:border-rosered hover:text-rosered hover:bg-transparent transition-colors duration-100 py-2 min-h-12 min-w-24 rounded-md text-lg text-center tracking-wider"
              >
                <p className="text-xl">
                  {date.getHours() + ":" + date.getMinutes()}
                </p>
                <p className="text-xs">{`${screening.type}, ${
                  screeningSoundMap[screening.sound]
                }`}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
