import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for now
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white border border-gray-200 rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-2">Ocorreu um erro</h2>
            <p className="text-sm text-gray-600 mb-4">Houve um problema ao renderizar a aplicação.</p>
            <pre className="text-xs text-red-600 whitespace-pre-wrap">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
