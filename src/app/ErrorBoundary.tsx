import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Last line of defence: a render crash anywhere below this shows a message
 * instead of a blank white page. Class component because React has no hook
 * equivalent of componentDidCatch.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error", error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="grid min-h-screen place-items-center px-4 py-10">
        <div className="w-full max-w-[440px] rounded-md border border-dashed border-line bg-card p-6 text-center">
          <b className="mb-1 block text-ui-md text-ink">Something went wrong</b>
          <p className="text-ui-sm text-ink-soft">
            The page couldn't be drawn. Reloading usually clears it.
          </p>
          <pre className="mt-3 max-h-32 overflow-auto rounded border border-line-soft bg-paper p-2 text-left font-mono text-ui-2xs text-ink-soft">
            {error.message}
          </pre>
          <Button variant="teal" className="mt-4 px-5 py-2.5" onClick={() => location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    );
  }
}
