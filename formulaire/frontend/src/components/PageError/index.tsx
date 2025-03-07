import { useRouteError } from "react-router-dom";

export default function PageError() {
  const error = useRouteError() as { message: string };
  console.error("an error has occured: " + error.message);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.message}</i>
      </p>
    </div>
  );
}
