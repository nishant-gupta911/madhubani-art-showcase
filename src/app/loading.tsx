export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8" style={{ background: 'var(--ivory)' }}>
      <div className="w-10 h-10 border-2 border-vermilion/20 border-t-vermilion rounded-full animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">
        Loading Vernika Enterprises…
      </p>
    </div>
  );
}
