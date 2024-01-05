function validateRegisterData(data) {
  const { email, firstName, lastName, password } = data;
  email = email.toLowerCase();

  // /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = /^[a-z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-z0-9.-]+$/.test(
    email
  );
  const isValidFirstName = firstName.length > 0 && firstName.length < 32;
  const isValidLastName = lastName.length > 0 && lastName.length < 32;
  const isValidPassword = password.length > 0 && password.length < 128; // to be changed ?

  if (
    !isValidEmail ||
    !isValidFirstName ||
    !isValidLastName ||
    !isValidPassword
  ) {
    return false;
  } else {
    return true;
  }
}

function validateMovieData(data) {
  const { title, year, genres, director, actors } = data;

  const isValidTitle = title.length > 0 && title.length < 128;
  const isValidYear = year > 1900 && year < 2100;
  const isValidGenres =
    genres.length > 0 && genres.every((genre) => typeof genre === "string");
  const isValidDirector = director.length > 0 && director.length < 64;
  const isValidActors =
    genres.length > 0 && actors.every((actor) => typeof actor === "string");

  if (
    !isValidTitle ||
    !isValidYear ||
    !isValidGenres ||
    !isValidDirector ||
    !isValidActors
  ) {
    return false;
  }
  return true;
}

module.exports = { validateRegisterData, validateMovieData };
