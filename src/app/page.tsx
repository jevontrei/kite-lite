import SearchForm from "@/components/search-form";

// rfc
export default function Page() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1 className="text-5xl font-bold">Weather you like it or not</h1>
        <SearchForm></SearchForm>
        <p>&copy; JVT</p>
      </div>
    </div>
  );
}
