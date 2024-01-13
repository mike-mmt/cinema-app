import { Link } from "react-router-dom";

type Props = {
  styles?: string;
  link: string;
  text: string;
};
export default function LinkButton({ styles, link, text }: Props) {
  return (
    <Link
      to={link}
      className={`bg-outer-space text-magnolia min-h-10 min-w-32 rounded flex justify-center items-center align-middle${
        styles ? " " + styles : ""
      }`}
    >
      {text}
    </Link>
  );
}
