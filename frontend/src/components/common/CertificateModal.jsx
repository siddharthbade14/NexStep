import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { 
  ShieldCheck, 
  Award, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  QrCode, 
  FileCheck 
} from 'lucide-react';

export const CertificateModal = ({ isOpen, onClose, certificate }) => {
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/verify/certificate/${certificate.certificate_id || certificate.proof_hash || 'NX-PROOF'}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verifiable Digital Credential"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* CERTIFICATE CARD DESIGN */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-teal-500/40 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Watermark */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-sm">
                NX
              </div>
              <div>
                <div className="text-xs font-black tracking-widest uppercase text-teal-400">NexStep Registry</div>
                <div className="text-[10px] text-slate-400">National Skill Verification Protocol</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographically Valid</span>
            </div>
          </div>

          {/* MAIN CERTIFICATE BODY */}
          <div className="py-6 text-center space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#F4B942] font-semibold">
              Proof-of-Work Verification Certificate
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {certificate.student_name || 'Aarav Sharma'}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Has demonstrated rigorous, hands-on industry proficiency by successfully passing automated assertion suites in an isolated sandbox.
            </p>

            <div className="pt-2">
              <span className="inline-block px-4 py-2 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-sm sm:text-base font-bold shadow-inner">
                {certificate.skill_name || 'RESTful API Design & Implementation'}
              </span>
            </div>
          </div>

          {/* AUDIT METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400">Assertions</div>
              <div className="text-sm font-bold text-emerald-400">
                {certificate.test_cases_passed || 3} / {certificate.total_test_cases || 3} Passed
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400">Latency</div>
              <div className="text-sm font-bold text-white">
                {certificate.execution_time_ms || 12.5} ms
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400">Standard</div>
              <div className="text-sm font-bold text-[#F4B942]">
                Tier-1 Ready
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400">Algorithm</div>
              <div className="text-xs font-bold text-teal-300 font-mono mt-0.5">
                HMAC-SHA256
              </div>
            </div>
          </div>

          {/* TAMPER-PROOF FOOTER & HASH */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div>
              <span>ID: </span>
              <strong className="text-white">{certificate.certificate_id || 'NX-VERIFIED-PROOF-2026'}</strong>
            </div>
            <div className="truncate max-w-[280px] text-teal-400/80 text-[10px]">
              HASH: {certificate.proof_hash ? certificate.proof_hash.slice(0, 24) + '...' : '4bddb178ddf6827f...'}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share this verifiable credential with recruiters to prove hands-on code competence.
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="text-xs py-2 px-3 flex items-center gap-1.5 border-teal-500/40 text-teal-600 dark:text-teal-400"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
            </Button>

            <Button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-4"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
