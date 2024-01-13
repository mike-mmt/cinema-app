import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import MovieCard from "./MovieCard";
import { AdminContext } from "../../contexts/AdminContext";
import LinkButton from "../LinkButton";
import StaticGradientBg from "../StaticGradientBg";

interface SeatType {
  row: string,
  number: number,
  class: string,
  taken: boolean,
}
interface ScreeningType {
  _id: string,
  date: Date,
    type: string,
    sound: string,
    seats: SeatType[]
}

export interface MovieType {
  _id: string,
  title: string,
  year: string,
  genres: string[],
  director: string,
  actors: string[],
  screenings: ScreeningType[],
  photoUrl: string,
  galleryPhotoUrls: string[],
}
interface ActionType {
  type: string,
  payload: any,
}


function reducer(state: MovieType[], action: ActionType) {
  switch (action.type) {
    case 'set':
      return action.payload;
    // case 'sort':
      // return state;
    default:
      throw new Error();
  }
}

export default function Repertoire() {
  const [state, dispatch] = useReducer(reducer, []);
  const adminContext = useContext(AdminContext);

  useEffect(() => {
    axios.get(import.meta.env.VITE_BACKEND_URL + "/movies")
    .then((response) => {
      dispatch({
        type: 'set',
        payload: response.data
      })
    })
    // return () => {
    //   second
    // }
  }, [])
  

  return <StaticGradientBg styles="flex justify-center bg-fixed">
     {/* <div className="background-all h-screen "> */}
      <div className="movies-wrapper w-11/12 flex flex-col items-center mt-8">
        {adminContext?.isAdmin && <LinkButton link="/addmovie" text="Dodaj nowy film" styles="mb-5"/>}
      <h1 className="text-4xl font-semibold w-full text-center pb-4 border-b-2 border-b-outer-space-half">Repertuar</h1>
        <div className="movies-grid grid grid-cols-2 w-full mt-8 gap-x-8 gap-y-10 px-2">
        {state.map((movie: MovieType, index: number) => (
        <MovieCard key={index} movie={movie}/> 
        ))}
        </div>
      </div>
    </StaticGradientBg>
}
