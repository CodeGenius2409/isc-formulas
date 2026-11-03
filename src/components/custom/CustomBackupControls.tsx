import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { customBackupStore, customStore, exportCustom, importCustom, parseCustomBackup, unsavedCount } from '../../custom/store';
import { useStore } from '../../lib/store';
import { toast } from '../../state/toast';

/** Saves your formulas to a file, and reads them back. Browser storage can be cleared, so this matters. */
export function CustomBackupControls() {
  const custom = useStore(customStore);
  const backedUp = useStore(customBackupStore);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'good' | 'bad' } | null>(null);
  const unsaved = unsavedCount(custom.formulas.length, backedUp);

  const onExport = () => {
    const blob = new Blob([JSON.stringify(exportCustom(), null, 1)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isc-my-formulas-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    customBackupStore.set(custom.formulas.length);
    toast('Your formulas are saved to a file');
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setMessage(null);
    const parsed = parseCustomBackup(await file.text());
    if (!parsed.ok) {
      setMessage({ text: parsed.error, tone: 'bad' });
    } else {
      const plan = await importCustom(parsed.formulas);
      const parts = [`${plan.add.length} added`, `${plan.replace.length} updated`, `${plan.duplicates} already here`];
      if (parsed.skipped) parts.push(`${parsed.skipped} skipped because they weren't valid`);
      setMessage({ text: `Formulas imported: ${parts.join(', ')}.`, tone: 'good' });
      customBackupStore.set(customStore.get().formulas.length);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <section className="today-section" aria-labelledby="custom-backup-h">
      <h2 id="custom-backup-h">Back up your formulas</h2>
      <p className="mt-2 text-ink-2">They live only in this browser, which can clear its storage. Save a file to keep them safe or move them to another device.</p>
      {unsaved > 0 && (
        <p className="mt-2 font-semibold" data-testid="custom-reminder">
          {unsaved} of your formulas {unsaved === 1 ? 'has' : 'have'} no backup yet.
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="btn btn-line" disabled={!custom.formulas.length} onClick={onExport}>
          <Download size={16} aria-hidden /> Save my formulas
        </button>
        <button type="button" className="btn btn-line" onClick={() => fileRef.current?.click()}>
          <Upload size={16} aria-hidden /> Import my formulas
        </button>
        <input ref={fileRef} type="file" data-testid="custom-import" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-label="Formulas file to import" onChange={(e) => void onImport(e.target.files?.[0])} />
      </div>
      {message && (
        <p className="notice" data-tone={message.tone} role={message.tone === 'bad' ? 'alert' : 'status'}>
          {message.text}
        </p>
      )}
    </section>
  );
}
