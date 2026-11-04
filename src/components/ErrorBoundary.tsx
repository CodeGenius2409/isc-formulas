import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCw } from 'lucide-react';
import { forgetFailedImports } from '../lib/retry-import';

interface Props {
  children: ReactNode;
  /** When this changes the boundary tries again, so moving to another page recovers. */
  resetKey?: string;
  /** What failed, as the student would name it: "This page", "The working area". */
  label?: string;
}

/**
 * Without this, a page whose code fails to load leaves a blank white screen. The usual
 * cause is the connection dropping before the app was saved for offline use.
 */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  componentDidUpdate(previous: Props) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      forgetFailedImports();
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page-pad" role="alert">
        <h2 className="text-step-1">{this.props.label ?? 'This page'} could not open</h2>
        <p className="mt-1 text-ink-2">{navigator.onLine ? 'Something went wrong while loading it. Reloading usually fixes this.' : 'You are offline, and it had not been saved to this device yet. Reload once you have a connection.'}</p>
        <button type="button" className="btn btn-solid mt-3" onClick={() => window.location.reload()}>
          <RotateCw size={16} aria-hidden="true" />
          Reload
        </button>
      </div>
    );
  }
}
