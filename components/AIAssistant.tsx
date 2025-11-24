import React, { useState } from 'react';
import { Sparkles, X, Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface AIAssistantProps {
  title: string;
  onClose: () => void;
  onAccept: (content: string) => void;
  generatorFn: () => Promise<string>;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ title, onClose, onAccept, generatorFn }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generatorFn();
    setContent(result);
    setLoading(false);
    setGenerated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-brand-50 to-white">
          <div className="flex items-center gap-2 text-brand-700 font-semibold">
            <Sparkles className="w-5 h-5" />
            {title}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!generated ? (
            <div className="text-center py-12 space-y-4">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Let AI do the heavy lifting</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Gemini will analyze the context and generate professional content for you in seconds.
              </p>
              <Button onClick={handleGenerate} isLoading={loading} size="lg" className="mt-4">
                Start Generation
              </Button>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <textarea
                className="w-full h-64 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none font-mono text-sm bg-slate-50"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          )}
        </div>

        {generated && (
          <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
            <Button variant="outline" onClick={() => setGenerated(false)}>Try Again</Button>
            <Button onClick={() => onAccept(content)} icon={<Check className="w-4 h-4"/>}>
              Use Content
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
