export default function ShopLoading() {
  return (
    <div className="bg-transparent noise min-h-screen pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-16 md:mb-24 animate-pulse">
          <div className="h-4 w-24 bg-muted mb-6" />
          <div className="h-16 md:h-24 w-2/3 max-w-lg bg-muted" />
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group flex cursor-wait flex-col animate-pulse">
              <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden bg-muted" />
              <div className="flex flex-col items-center text-center">
                <div className="h-6 w-32 bg-muted mb-2" />
                <div className="h-3 w-48 bg-muted mb-4" />
                <div className="h-4 w-16 bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
