import { Check, Copy, Download, FileCode2, FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Language } from '../types/tourism';
import { tourismApi } from '../utils/api';
import { TRANSLATIONS } from '../i18n/translations';

interface DeliverablesViewProps {
  language: Language;
}

export function DeliverablesView({ language }: DeliverablesViewProps) {
  const t = TRANSLATIONS[language];
  const [files, setFiles] = useState<Array<{ path: string; size: number }>>([]);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    tourismApi
      .listDeliverables()
      .then((res) => {
        setFiles(res.files);
        const defaultFile =
          res.files.find((f) => f.path === 'README.md')?.path ??
          res.files[0]?.path ??
          '';
        setSelectedPath(defaultFile);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedPath) return;
    tourismApi.getDeliverableFile(selectedPath).then((res) => {
      setContent(res.content);
    });
  }, [selectedPath]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedPath.split('/').pop() || 'source.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#17211C]">{t.deliverables.title}</h1>
        <p className="text-sm text-[#5A655F] mt-1">{t.deliverables.subtitle}</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-8 text-sm text-[#5A655F]">
          {t.common.loading}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Tree */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E0D8] p-3 max-h-[640px] overflow-y-auto space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-[#5A655F] flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#0D5C46]" aria-hidden="true" />
              <span>/deliverables ({files.length} files)</span>
            </div>
            {files.map((file) => {
              const active = file.path === selectedPath;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedPath(file.path)}
                  className={`w-full min-h-[40px] px-3 py-2 rounded-xl text-left text-xs font-mono flex items-center justify-between gap-2 transition-colors ${
                    active
                      ? 'bg-[#0D5C46] text-white'
                      : 'text-[#17211C] hover:bg-[#F8F7F4]'
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <FileCode2 className="w-3.5 h-3.5 shrink-0 opacity-80" aria-hidden="true" />
                    <span className="truncate">{file.path}</span>
                  </span>
                  <span className="text-[10px] opacity-75 shrink-0 tabular-nums">
                    {(file.size / 1024).toFixed(1)}KB
                  </span>
                </button>
              );
            })}
          </div>

          {/* File Content Viewer */}
          <div className="lg:col-span-8 bg-[#17211C] text-[#EFECE6] rounded-2xl border border-[#2D3832] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2D3832] flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs text-[#D8B454] truncate">{selectedPath}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium inline-flex items-center gap-1.5"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#6EE7B7]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{copied ? t.deliverables.copied : t.deliverables.copyCode}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#0D5C46] hover:bg-[#0A4A38] text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.deliverables.downloadFile}</span>
                </button>
              </div>
            </div>
            <pre className="p-5 text-xs font-mono overflow-x-auto max-h-[580px] overflow-y-auto leading-relaxed">
              <code>{content}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
