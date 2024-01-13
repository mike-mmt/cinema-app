import { useContext } from "react"
import { MovieType } from "./Repertoire"
import { LoginContext } from "../../contexts/LoginContext"
import { useNavigate } from "react-router"

type Props = { movie: MovieType }

export default function MovieCard({movie}: Props) {
    const navigate = useNavigate()
    const loginContext = useContext(LoginContext)
    // const screeningProps = {
    //     onClick: navigate()
    // }
    type ScreeningSoundMap = {
        [key: string]: string;
    }

    const screeningSoundMap: ScreeningSoundMap = {
        subtitles: "Napisy",
        narrator: "Lektor",
        dubbing: "Dubbing",
    }

  return (
    <div className="grid-item flex items-center bg-outer-space-quarter rounded-md p-2" onClick={() => navigate(`/movie/${movie._id}`)}>
          <img src={movie.photoUrl} className="m-4 w-4/12"></img>
          <div className="info flex flex-col w-full">
            <div className="title-genres-wrapper border-b-2 pb-4 border-b-outer-space-quarter">
                <h2 className="break-normal text-xl font-semibold text-center ">{movie.title}</h2>

            </div>
            <div className="screenings-wrapper flex flex-wrap gap-3 py-5 px-3">
                {movie.screenings.map((screening, index) =>  { 
                    const date = new Date(screening.date)
                    return (
                    <div key={index} 
                    onClick={() => { if(loginContext?.loggedIn) {navigate(`/screening/${screening._id}`)}}} 
                    className="bg-outer-space-quarter border border-magnolia hover:border-rosered hover:text-rosered hover:bg-transparent transition-colors duration-100 py-2 min-h-14 min-w-28 rounded-md text-lg text-center tracking-wider">
                        <p className="text-2xl">{date.getHours() + ":" + date.getMinutes()}</p>
                        <p className="text-sm">{`${screening.type}, ${screeningSoundMap[screening.sound]}`}</p>
                    </div>
                )})}
            </div>
          </div>
        </div>
  )
}