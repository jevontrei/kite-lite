import { GetStartedButton } from "@/components/get-started-button";

// rfc
export default function Page() {
  return (
    <>
      <GetStartedButton />
      <h2 className="text-2xl font-bold mt-8">About</h2>
      <p>
        This is a simple web app that I made for the purpose of learning React
        and Next.js
      </p>
    </>
  );
}
