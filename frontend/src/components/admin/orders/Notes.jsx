export default function Notes({ isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-medium">Nota</p>
      </div>
      {isPending ? (
        <NotesSkeleton />
      ) : (
        <div className="py-4">
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
            voluptate ex quos quisquam, rem sequi magni libero saepe, quo dolore
            quae illum dolorem ipsam recusandae temporibus deserunt modi,
            tempora autem!
          </p>
        </div>
      )}
    </div>
  );
}

function NotesSkeleton() {
  return (
    <div className="py-4 space-y-2 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div className="h-4 w-full bg-gray-50 rounded" key={index}></div>
      ))}
    </div>
  );
}
