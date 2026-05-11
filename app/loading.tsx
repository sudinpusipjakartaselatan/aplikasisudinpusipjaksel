import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background w-full">
      <LoadingSpinner text="Mempersiapkan Halaman..." />
    </div>
  );
}
