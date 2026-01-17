import SearchForecastForm from "@/components/search-forecast-form";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function Weather() {
  // get session
  const headersList = await headers();
  const session = await auth.api.getSession({
    // remember to pass in headers when you're on a server component (the server doesn't have access to cookies unless it has the headers)
    headers: headersList,
  });

  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>page.tsx");
  // ------------------------------------------------

  // if session, the getInvolvedLink takes you to profile, otherwise it takes you to auth page
  const { getInvolvedLink, getInvolvedLinkName } = session
    ? { getInvolvedLink: "/profile", getInvolvedLinkName: "Go to profile" }
    : {
        getInvolvedLink: "/auth/register",
        getInvolvedLinkName: "Go to signup/login",
      };

  return (
    <>
      <h1 className="text-3xl font-bold">Forecast data</h1>
      <p>Using the Open-Meteo API</p>
      <SearchForecastForm />
      <Link
        href={getInvolvedLink}
        className="text-sm italic text-muted-foreground hover:text-foreground"
      >
        {getInvolvedLinkName}
      </Link>
    </>
  );
}
