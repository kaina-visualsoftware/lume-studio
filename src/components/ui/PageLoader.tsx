import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
        <p className="text-dark-500 text-sm">Carregando página...</p>
      </div>
    </div>
  );
};