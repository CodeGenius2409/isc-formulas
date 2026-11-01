import { useStore } from '../../lib/store';
import { toastStore } from '../../state/toast';

export function Toast() {
  const { message, show } = useStore(toastStore);
  return (
    <div className="toast" role="status" aria-live="polite" data-show={show}>
      {message}
    </div>
  );
}
