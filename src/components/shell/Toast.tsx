import { useStore } from '../../lib/store';
import { toastStore } from '../../state/toast';

export function Toast() {
  const { message, show, action } = useStore(toastStore);
  return (
    <div className="toast" role="status" aria-live="polite" data-show={show}>
      {message}
      {action && show && (
        <button type="button" className="toast-action" onClick={action.run}>
          {action.label}
        </button>
      )}
    </div>
  );
}
