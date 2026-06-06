export default function Notes({ isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-bold">Nota Interna</p>
      </div>
      {isPending ? (
        <NotesSkeleton />
      ) : (
        <div className="py-4">
          <p className="text-sm text-gray-600 italic bg-[#f5f0e6]/40 p-3 rounded-lg border border-[#3f6b4c]/10">
            "El cliente solicitó empaque especial de regalo y envío por las
            mañanas. Se incluyó dedicatoria personalizada solicitada por
            correo."
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
