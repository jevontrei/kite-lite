import SearchForecastForm from "@/components/search-forecast-form";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function Weather() {
  // get session
  const headersList = await headers();
  const session = await auth.api.getSession({
    // remember to pass in headers when you're on a server component
    headers: headersList,
  });

  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>page.tsx");
  // ------------------------------------------------

  // if session, the getInvolvedLink takes you to profile, otherwise it takes you to auth page
  let getInvolvedLink;
  let getInvolvedLinkName;
  if (session) {
    getInvolvedLink = "/profile";
    getInvolvedLinkName = "Go to profile";
  } else {
    getInvolvedLink = "/auth/register";
    getInvolvedLinkName = "Go to signup/login";
  }

  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1 className="text-5xl font-bold">Weather you like it or not</h1>
        <h2 className="text-2xl font-bold">Forecast data</h2>
        <SearchForecastForm />
        <Link
          href={getInvolvedLink}
          className="text-sm italic text-muted-foreground hover:text-foreground"
        >
          {getInvolvedLinkName}
        </Link>
        <p>&copy; JVT</p>
      </div>
    </div>
  );
}
