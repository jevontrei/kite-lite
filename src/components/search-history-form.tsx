"use client";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { searchHistoryAction } from "@/actions/search-weather-history-action";
import { useState } from "react";
import { toast } from "sonner";

// rfc
export default function SearchHistoryForm() {
  // isPending is useful because of disabled={isPending}
  const [isPending, setIsPending] = useState(false);
  const [weatherResults, setWeatherResults] = useState(null);

  // ------------------------------------------------
  // for debugging
  const currentDate = new Date();
  console.log(currentDate.toLocaleTimeString());
  console.log(">>>search-history-form.tsx");
  // ------------------------------------------------

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    // stop the browser's default behaviour, which is to reload(?)
    evt.preventDefault();

    setIsPending(true);

    try {
      toast.info("testing");
      const formData = new FormData(evt.target as HTMLFormElement);
      console.log("formData", formData);

      // this comment tells typescript to ignore the issue below
      // @ts-ignore
      const { error, data } = (await searchHistoryAction(formData)) as any;

      if (error) {
        toast.error(error);
        return;
      }

      // Only runs if no error
      toast.success("success msg here...");
      // no longer using router.push("/"); we are displaying the searched data on the page below the form... and using this state-setter will trigger a nice lil re-render!
      setWeatherResults(data);
      console.log("weatherResults:", weatherResults);
    } catch (err) {
      toast.error(`Network error: ${err}`);
    } finally {
      // ALWAYS re-enable button
      setIsPending(false);
    }
  }

  return (
    <>
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
              {/* there are SEEMING errors here because ts doesn't know the structure of weatherResults */}
              {weatherResults.time.map((time: string, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{new Date(time).toLocaleString()}</td>
                  <td className="p-2">
                    {weatherResults.temperature_2m[i]?.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full space-y-4 border-8 border-transparent"
      >
        {/* htmlFor should match the id of the <Input/> */}
        <Label htmlFor="latitude" className="mb-2">
          Latitude
        </Label>
        <Input type="text" id="latitude" name="latitude" placeholder="52.52" />

        <Label htmlFor="longitude" className="mb-2">
          Longitude
        </Label>
        <Input
          type="text"
          id="longitude"
          name="longitude"
          placeholder="13.41"
        />

        <Label htmlFor="start_date" className="mb-2">
          Start date
        </Label>
        <Input
          type="text"
          id="start_date"
          name="start_date"
          placeholder="2024-12-12"
        />

        <Label htmlFor="end_date" className="mb-2">
          End date
        </Label>
        <Input
          type="text"
          id="end_date"
          name="end_date"
          placeholder="2024-12-13"
        />

        <Label htmlFor="hourly" className="mb-2">
          Hourly
        </Label>
        <Input
          type="text"
          id="hourly"
          name="hourly"
          placeholder="temperature_2m"
        />

        <i>
          Just hit <b>Do It</b> to run a default API call
        </i>
        <Button type="submit" className="w-full" disabled={isPending}>
          Do it
        </Button>
      </form>
    </>
  );
}
