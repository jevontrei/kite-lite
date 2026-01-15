"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table";
import { QueryDbAction } from "@/actions/query-db-action";
import { toast } from "sonner";
import { useState } from "react";

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
      {weatherResults && <DataTable weatherResults={weatherResults} />}

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
    </>
  );
}
