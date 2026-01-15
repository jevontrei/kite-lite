import { GetStartedButton } from "@/components/get-started-button";

// rfc
export default function Page() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-4 flex-col items-center">
        <h1 className="text-5xl font-bold">Weather you like it or not</h1>
        <GetStartedButton />
        <h2 className="text-2xl font-bold mt-8">About</h2>
        <p>
          This is a simple web app that I made for the purpose of learning React
          and Next.js
        </p>
        <p className="mt-8">&copy; JVT</p>
      </div>
    </div>
  );
}
