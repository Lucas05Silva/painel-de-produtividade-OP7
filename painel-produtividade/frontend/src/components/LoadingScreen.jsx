export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-light font-semibold">Carregando...</p>
      </div>
    </div>
  );
}
