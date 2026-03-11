import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Ocurrió un error inesperado.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.operationType && parsed.error) {
            isFirestoreError = true;
            if (parsed.error.includes("Missing or insufficient permissions")) {
              errorMessage = "No tienes permisos suficientes para realizar esta acción. Por favor, verifica tu sesión o contacta a soporte.";
            } else {
              errorMessage = `Error de base de datos: ${parsed.error}`;
            }
          }
        }
      } catch (e) {
        // Not a JSON error message, use default
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 font-sans text-zinc-200 relative z-10">
          <div className="bg-noise"></div>
          <div className="fixed inset-0 bg-grid pointer-events-none z-0"></div>
          <div className="bg-zinc-900/40 backdrop-blur-md brutal-border p-8 max-w-md w-full text-center relative z-10">
            <div className="w-16 h-16 bg-red-900/30 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-4 uppercase">Algo salió mal</h2>
            <p className="text-zinc-400 mb-8 font-light">
              {errorMessage}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-zinc-100 text-zinc-950 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 brutal-shadow text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
