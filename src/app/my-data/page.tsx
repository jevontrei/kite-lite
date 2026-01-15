"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table";
import { QueryDbAction } from "@/actions/query-db-action";
import { toast } from "sonner";
import { useState } from "react";

export default function MyData() {
  const [weatherResults, setWeatherResults] = useState();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    // do i need to prevent default here?

    setIsPending(true);

    try {
      toast.info("Attempting db query");
      const formData = new FormData(evt.target as HTMLFormElement);
      console.log("formData:", formData);

      const { error, data } = (await QueryDbAction(formData)) as any;

      if (error) {
        toast.error(error);
        return;
      }

      // only runs if no error
      toast.success("Success!");
      setWeatherResults(data);
    } catch (err) {
      toast.error(`Network error: ${err}`);
    } finally {
      // ALWAYS re-enable button
      setIsPending(false);
    }
  }

  return (
    <>
      <h2>See what&apos;s in the database</h2>
      <DataTable data={weatherResults} />
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full space-y-4 border-8 border-transparent"
      >
        <Button type="submit" className="w-full" disabled={isPending}>
          Do it
        </Button>
      </form>
    </>
  );
}
