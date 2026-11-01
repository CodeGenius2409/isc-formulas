import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportBackup, importBackup, parseBackup } from '../practice/progress';
import { toast } from '../state/toast';

/** Saves progress to a file, and merges a file back in. */
export function BackupControls() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'good' | 'bad' } | null>(null);

  const onExport = () => {
    const blob = new Blob([JSON.stringify(exportBackup(), null, 1)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isc-formula-book-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('Backup saved');
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setMessage(null);
    const parsed = parseBackup(await file.text());
    if (!parsed.ok) {
      setMessage({ text: parsed.error, tone: 'bad' });
    } else {
      const added = importBackup(parsed.backup);
      setMessage({ text: `Backup merged: ${added.items} review items, ${added.mistakes} mistakes and ${added.favourites} saved formulas added. Nothing was removed.`, tone: 'good' });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <section className="today-section" aria-labelledby="backup-h">
      <h2 id="backup-h">Backup</h2>
      <p className="mt-2 text-ink-2">Your progress stays on this device. Save a file to keep it safe or move it to another device. Importing merges with what is here.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="btn btn-line" onClick={onExport}>
          <Download size={16} aria-hidden /> Save a backup
        </button>
        <button type="button" className="btn btn-line" onClick={() => fileRef.current?.click()}>
          <Upload size={16} aria-hidden /> Import a backup
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => void onImport(e.target.files?.[0])} />
      </div>
      {message && (
        <p className="notice" data-tone={message.tone} role={message.tone === 'bad' ? 'alert' : 'status'}>
          {message.text}
        </p>
      )}
    </section>
  );
}
