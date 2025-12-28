"use client";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { searchWeatherAction } from "@/actions/search-weather-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// rfc
export default function SearchForm() {
  // isPending is useful because of disabled={isPending}
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    // stop the browser's default behaviour, which is to reload(?)
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);

    // figure this out / if it's necessary
    // const { error } = await searchWeatherAction(formData);
    // if (error) {
    //   toast.error(error);
    //   setIsPending(false);
    // } else {
    //   toast.success("success msg here...");
    //   router.push("/");
    // }
  }

  return (
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
      <Input type="text" id="longitude" name="longitude" placeholder="13.41" />

      <Label htmlFor="startDate" className="mb-2">
        Start date
      </Label>
      <Input
        type="text"
        id="startDate"
        name="startDate"
        placeholder="2025-12-12"
      />

      <Label htmlFor="endDate" className="mb-2">
        End date
      </Label>
      <Input type="text" id="endDate" name="endDate" placeholder="2025-12-23" />

      <Label htmlFor="hourly" className="mb-2">
        Hourly
      </Label>
      <Input
        type="text"
        id="hourly"
        name="hourly"
        placeholder="temperature_2m"
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        Do it
      </Button>
    </form>
  );
}
