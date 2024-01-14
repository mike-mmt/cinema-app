import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { ScreeningType, screeningSoundMap } from "../utils/screeningsUtils";
import { useNavigate } from "react-router-dom";

type Props = {
  screenings: ScreeningType[] | undefined;
};

export default function ScreeningsList({ screenings }: Props) {
  const loginContext = useContext(LoginContext);
  const navigate = useNavigate();

  const handleScreeningClick = (
    event: React.MouseEvent,
    screeningId: string
  ) => {
    event.stopPropagation();
    if (loginContext?.loggedIn) {
      navigate(`/screening/${screeningId}`);
    }
  };

  return (
    <div className="screenings-wrapper flex flex-wrap gap-3 py-1 px-1">
      {screenings?.map((screening, index) => {
        const date = new Date(screening.date);
        return (
          <div
            key={index}
            onClick={(e) => handleScreeningClick(e, screening._id)}
            className="cursor-pointer bg-outer-space-quarter border border-magnolia hover:border-rosered hover:text-rosered hover:bg-transparent transition-colors duration-100 py-2 min-h-12 min-w-24 rounded-md text-lg text-center tracking-wider"
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
  );
}
