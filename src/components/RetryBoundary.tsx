import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCw } from 'lucide-react';
import { forgetFailedImports } from '../lib/retry-import';

interface Props {
  children: ReactNode;
  /** What to say, in a calm sentence. The rest of the page carries on around it. */
  message: string;
}

/**
 * For one part of a page. The part fails on its own, and Retry starts it again without a reload, so
 * whatever has been typed elsewhere on the page stays.
 */
export class RetryBoundary extends Component<Props, { failed: boolean; attempts: number }> {
  state = { failed: false, attempts: 0 };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(error, info.componentStack);
  }

  private retry = () => {
    forgetFailedImports();
    this.setState((s) => ({ failed: false, attempts: s.attempts + 1 }));
  };

  render() {
    const { failed, attempts } = this.state;
    if (!failed) return <div key={attempts}>{this.props.children}</div>;
    return (
      <div className="notice" data-tone="bad" role="alert" style={{ display: 'block' }}>
        <p>{this.props.message}</p>
        {attempts > 0 && <p className="mt-1">If that doesn't help, the app may have just been updated. Reloading picks up the new version, and keeps what you've typed.</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn btn-solid" onClick={this.retry}>
            <RotateCw size={15} aria-hidden /> Retry
          </button>
          {attempts > 0 && (
            <button type="button" className="btn btn-line" onClick={() => window.location.reload()}>
              Reload the page
            </button>
          )}
        </div>
      </div>
    );
  }
}
