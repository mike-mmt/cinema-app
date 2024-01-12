export default function GradientBackground() {
  return (
    <>
      <div className="black-background absolute top-0 left-0 w-full -z-50"></div>
      <div className="gradient-first-layer top-0 left-0 w-full -z-40"></div>
      <div className="gradient-loop top-0 left-0 w-full -z-30"></div>
    </>
  );
}
