import { Icon } from './SvgIcons';

export interface ToastItem {
  id: string;
  title: string;
  body: string;
  icon?: string;
}

interface ToastsProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function Toasts({ toasts, onDismiss }: ToastsProps) {
  if (!toasts.length) return null;

  return (
    <div id="toasts">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <Icon name={t.icon || 'bell'} />
          <div>
            <div className="toast-t">{t.title}</div>
            <div className="toast-b">{t.body}</div>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="toast-x"
            title="Kapat"
          >
            <Icon name="x" style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      ))}
    </div>
  );
}
