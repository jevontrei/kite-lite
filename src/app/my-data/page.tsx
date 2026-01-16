"use client";

import { Button } from "@/components/ui/button";
import { QueryDbAction } from "@/actions/query-db-action";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function MyData() {
  const [weatherResults, setWeatherResults] = useState();
  const [isPending, setIsPending] = useState(false);

  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>my-data/page.tsx");
  // ------------------------------------------------

  // get session
  // this is a different way to get the session on the client
  // https://www.better-auth.com/docs/basic-usage#get-session
  // `data: session` is RENAMING, not casting (?)
  const { data: session, error: sessionError } = useSession();

  // this handling is prob not my best effort
  if (sessionError) {
    return <div>Error loading session</div>;
  }

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

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    // do i need to prevent default here? yes i think so, otherwise weird opaque shit happens
    evt.preventDefault();

    setIsPending(true);

    try {
      toast.info("Attempting db query");

      // the submit button just queries the whole db with no params... so no need to use FormData()
      const { error, data } = (await QueryDbAction()) as any;

      if (error) {
        console.log("error from data-table.tsx");
        toast.error(error);
        return;
      }

      // only runs if no error
      toast.success("Success!");
      setWeatherResults(data);
    } catch (err) {
      console.log("error from my-data/page.tsx:", err);
      toast.error(`Network error: ${err}`);
    } finally {
      // ALWAYS re-enable button
      setIsPending(false);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold mt-4 mb-4">My data</h1>

      {weatherResults && (
        <div className="mt-8 max-h-96 overflow-y-auto border rounded">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Temperature (°C)</th>
              </tr>
            </thead>
            <tbody>
              {weatherResults.map((_: object, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">
                    {new Date(weatherResults[i].timestamp).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {weatherResults[i].temperature_2m?.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <h2>See what&apos;s in the database</h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-sm w-full space-y-4 border-8 border-transparent"
        >
          <Button type="submit" className="w-full" disabled={isPending}>
            Do it
          </Button>
        </form>
      </div>

      <div className="mt-4">
        <Link
          href={getInvolvedLink}
          className="text-sm italic text-muted-foreground hover:text-foreground"
        >
          {getInvolvedLinkName}
        </Link>
      </div>
    </>
  );
}
