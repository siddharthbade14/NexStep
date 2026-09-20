import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { triggerConfetti } from '../components/common/Confetti';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Layers,
  Code2,
  Check,
  Zap,
  HelpCircle,
  Bug
} from 'lucide-react';
import { api } from '../services/api';

const AVAILABLE_CHALLENGES = [
  // Software Developer
  { id: 'skill-rest-apis', label: 'RESTful APIs & FastAPI (Software Dev)', role: 'Software Developer' },
  { id: 'skill-docker', label: 'Docker & Containerization (DevOps)', role: 'Software Developer' },
  { id: 'skill-react', label: 'React State & Reducer (Frontend)', role: 'Software Developer' },
  { id: 'skill-git', label: 'Git & Linear Commit Graphs (Tooling)', role: 'Software Developer' },
  { id: 'skill-dsa', label: 'Data Structures (Two-Sum HashMap)', role: 'Software Developer' },
  { id: 'skill-sql-adv', label: 'Production Database SQL Join (Database)', role: 'Software Developer' },
  { id: 'skill-sys-design', label: 'Token Bucket Rate Limiter (Architecture)', role: 'Software Developer' },
  { id: 'skill-cicd', label: 'CI/CD Pipeline Coverage Evaluator (QA)', role: 'Software Developer' },

  // Data Analyst
  { id: 'skill-sql-da', label: 'SQL Window Functions & Rank (Data Transformation)', role: 'Data Analyst' },
  { id: 'skill-pandas', label: 'Pandas Transaction Metrics (Data Wrangling)', role: 'Data Analyst' },
  { id: 'skill-bi-dashboards', label: 'BI KPI Summary Formatter (Visualization)', role: 'Data Analyst' },
  { id: 'skill-stats', label: 'A/B Testing Significance (Quantitative)', role: 'Data Analyst' },
  { id: 'skill-eda', label: 'IQR Outlier Detection (Data Science)', role: 'Data Analyst' },
  { id: 'skill-business-metrics', label: 'SaaS MRR & Churn Rate (Business Analytics)', role: 'Data Analyst' },

  // Embedded Systems Engineer
  { id: 'skill-embedded-c', label: 'Microcontroller Bitmask Registers (Firmware)', role: 'Embedded Systems Engineer' },
  { id: 'skill-protocols', label: 'I2C & UART Checksum Validator (Hardware)', role: 'Embedded Systems Engineer' },
  { id: 'skill-arm-cortex', label: 'ARM NVIC Interrupt Priority Arbiter (Platform)', role: 'Embedded Systems Engineer' },
  { id: 'skill-rtos', label: 'FreeRTOS Priority Scheduler (RTOS)', role: 'Embedded Systems Engineer' },
  { id: 'skill-hw-debug', label: 'Logic Analyzer Frequency Decoder (Debugging)', role: 'Embedded Systems Engineer' },
  { id: 'skill-pcb-basics', label: 'PCB Trace Width Estimator (Hardware Design)', role: 'Embedded Systems Engineer' }
];

const SOLUTION_TEMPLATES = {
  'skill-rest-apis': `import math

def build_api_response(records, page, page_size):
    completed = [r for r in records if r.get('status') == 'completed']
    total_completed = len(completed)
    total_amount = round(sum(r.get('amount', 0.0) for r in completed), 2)
    total_pages = max(1, math.ceil(total_completed / page_size)) if page_size > 0 else 1
    
    if page < 1 or (page > total_pages and total_completed > 0):
        return {'status': 'error', 'data': [], 'meta': {'total_completed': total_completed, 'current_page': page, 'total_pages': total_pages, 'total_amount': total_amount}}
        
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_data = completed[start_idx:end_idx]
    
    return {
        'status': 'success',
        'data': page_data,
        'meta': {
            'total_completed': total_completed,
            'current_page': page,
            'total_pages': total_pages,
            'total_amount': total_amount
        }
    }`,

  'skill-docker': `def validate_dockerfile(instructions):
    clean = [i.strip() for i in instructions if i.strip()]
    has_base = len(clean) > 0 and clean[0].startswith('FROM ')
    has_user = any(i.startswith('USER ') for i in clean)
    
    dep_copy_idx = -1
    all_copy_idx = -1
    for idx, inst in enumerate(clean):
        if inst.startswith('COPY ') and ('requirements' in inst or 'package.json' in inst):
            dep_copy_idx = idx
        elif inst.startswith('COPY .') or inst.startswith('COPY /.'):
            all_copy_idx = idx
            
    cached = dep_copy_idx != -1 and all_copy_idx != -1 and dep_copy_idx < all_copy_idx
    
    return {
        'has_base_image': has_base,
        'is_cached_efficiently': cached,
        'has_non_root_user': has_user,
        'is_production_ready': has_base and cached and has_user
    }`,

  'skill-react': `def cart_reducer(state, action):
    import copy
    new_state = copy.deepcopy(state)
    items = new_state.get('items', [])
    discount = new_state.get('discount', 0.0)
    
    act_type = action.get('type')
    if act_type == 'ADD_ITEM':
        item = action['item']
        found = False
        for it in items:
            if it['id'] == item['id']:
                it['qty'] += 1
                found = True
                break
        if not found:
            new_item = dict(item)
            new_item['qty'] = 1
            items.append(new_item)
    elif act_type == 'REMOVE_ITEM':
        target_id = action['id']
        for it in list(items):
            if it['id'] == target_id:
                it['qty'] -= 1
                if it['qty'] <= 0:
                    items.remove(it)
                break
    elif act_type == 'APPLY_DISCOUNT':
        discount = action.get('percent', 0.0)
        
    raw_total = sum(i['price'] * i['qty'] for i in items)
    final_total = round(raw_total * (1.0 - discount / 100.0), 2)
    
    return {
        'items': items,
        'discount': discount,
        'total': final_total
    }`,

  'skill-git': `def inspect_git_branch(commits, base_branch):
    main_commits = [c for c in commits if c.get('branch') == base_branch]
    feature_commits = [c for c in commits if c.get('branch') != base_branch]
    
    if not feature_commits:
        return {'total_branch_commits': 0, 'has_direct_merge_conflict': False, 'ready_for_fast_forward': True}
        
    main_files = set()
    for c in main_commits:
        main_files.update(c.get('files_changed', []))
        
    feature_files = set()
    for c in feature_commits:
        feature_files.update(c.get('files_changed', []))
        
    conflict = bool(main_files.intersection(feature_files))
    head_main = main_commits[-1]['hash'] if main_commits else None
    first_feature_parent = feature_commits[0].get('parent')
    ready_ff = (first_feature_parent == head_main) and (not conflict)
    
    return {
        'total_branch_commits': len(feature_commits),
        'has_direct_merge_conflict': conflict,
        'ready_for_fast_forward': ready_ff
    }`,

  'skill-dsa': `def two_sum(nums, target):
    seen = {}
    for idx, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            return (seen[comp], idx)
        seen[n] = idx
    return None`,

  'skill-sql-adv': `def simulate_sql_join(users, orders):
    user_map = {u['user_id']: u['name'] for u in users}
    agg = {}
    for o in orders:
        uid = o['user_id']
        if uid in user_map:
            if uid not in agg:
                agg[uid] = {'count': 0, 'total': 0.0}
            agg[uid]['count'] += 1
            agg[uid]['total'] += o['total']
    res = []
    for uid, data in agg.items():
        res.append({'user_id': uid, 'name': user_map[uid], 'order_count': data['count'], 'spent_total': round(data['total'], 2)})
    res.sort(key=lambda x: x['spent_total'], reverse=True)
    return res`,

  'skill-sys-design': `def is_request_allowed(current_tokens, refill_rate, capacity, elapsed_seconds):
    tokens = min(capacity, current_tokens + (elapsed_seconds * refill_rate))
    if tokens >= 1.0:
        return {'allowed': True, 'remaining_tokens': round(tokens - 1.0, 2)}
    else:
        return {'allowed': False, 'remaining_tokens': round(tokens, 2)}`,

  'skill-cicd': `def evaluate_ci_pipeline(test_runs, min_coverage):
    tot_tests = sum(r['passed'] + r['failed'] for r in test_runs)
    tot_failed = sum(r['failed'] for r in test_runs)
    avg_cov = round(sum(r['coverage_pct'] for r in test_runs) / len(test_runs), 1) if test_runs else 0.0
    status = 'PASS' if tot_failed == 0 and avg_cov >= min_coverage else 'FAIL'
    return {'status': status, 'total_tests': tot_tests, 'avg_coverage': avg_cov}`,

  'skill-sql-da': `def calculate_window_metrics(sales_rows):
    sorted_rows = sorted(sales_rows, key=lambda x: x['revenue'], reverse=True)
    rank = 1
    prev_rev = None
    run_tot = 0.0
    res = []
    for row in sorted_rows:
        rev = row['revenue']
        if prev_rev is not None and rev < prev_rev:
            rank += 1
        run_tot += rev
        res.append({'rep': row['rep'], 'revenue': rev, 'dense_rank': rank, 'running_total': round(run_tot, 2)})
        prev_rev = rev
    return res`,

  'skill-pandas': `def analyze_transactions(orders):
    categories = {}
    for o in orders:
        cat = o['category']
        if cat not in categories:
            categories[cat] = {'orders': [], 'customers': set()}
        net = o['amount'] * (1.0 - o.get('discount_pct', 0.0) / 100.0)
        categories[cat]['orders'].append(net)
        categories[cat]['customers'].add(o['customer_id'])
        
    results = {}
    for cat, data in categories.items():
        tot = round(sum(data['orders']), 2)
        cnt = len(data['orders'])
        results[cat] = {
            'total_net_revenue': tot,
            'order_count': cnt,
            'unique_customers': len(data['customers']),
            'avg_order_value': round(tot / cnt, 2) if cnt > 0 else 0.0
        }
    return results`,

  'skill-bi-dashboards': `def compute_kpi_summary(actual, target):
    var = round(((actual - target) / target) * 100.0, 1) if target != 0 else 0.0
    return {'actual': float(actual), 'target': float(target), 'variance_pct': var, 'status': 'ON_TRACK' if var >= 0 else 'NEEDS_ATTENTION'}`,

  'skill-stats': `def calculate_ab_test(control_conv, control_total, variant_conv, variant_total):
    c_rate = round(control_conv / control_total, 4)
    v_rate = round(variant_conv / variant_total, 4)
    lift = round(((v_rate - c_rate) / c_rate) * 100, 2)
    return {'control_rate': c_rate, 'variant_rate': v_rate, 'relative_lift_pct': lift, 'is_winner': lift >= 10.0}`,

  'skill-eda': `def detect_iqr_outliers(values):
    if len(values) < 4: return []
    s = sorted(values)
    n = len(s)
    q1 = s[n // 4]
    q3 = s[(3 * n) // 4]
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return sorted([x for x in values if x < lower or x > upper])`,

  'skill-business-metrics': `def compute_saas_metrics(start_mrr, added_mrr, churned_mrr, total_customers, churned_customers):
    net = start_mrr + added_mrr - churned_mrr
    churn = round((churned_customers / total_customers) * 100, 2) if total_customers > 0 else 0.0
    return {'net_mrr': net, 'churn_rate_pct': churn, 'is_healthy': churn <= 5.0}`,

  'skill-embedded-c': `def configure_control_register(initial_val, enable_peripheral, clock_div, interrupt_mode):
    preserved = (initial_val & 0xFFC0) & 0xFFFF
    bit_en = 1 if enable_peripheral else 0
    bit_clk = (clock_div & 0x07) << 1
    bit_irq = (interrupt_mode & 0x03) << 4
    result = preserved | bit_en | bit_clk | bit_irq
    return {'hex': f'0x{result:04x}', 'value': result}`,

  'skill-protocols': `def validate_packet(address, register, data_bytes, checksum):
    calc = address ^ register
    for b in data_bytes:
        calc ^= b
    return calc == checksum`,

  'skill-arm-cortex': `def schedule_nvic_interrupts(pending_irqs):
    sorted_irqs = sorted(pending_irqs, key=lambda x: x['priority'])
    return [x['irq_id'] for x in sorted_irqs]`,

  'skill-rtos': `def select_next_task(ready_tasks):
    ready = [t for t in ready_tasks if t.get('state') == 'READY']
    if not ready: return None
    return max(ready, key=lambda x: x['priority'])['task_id']`,

  'skill-hw-debug': `def calculate_clock_freq_khz(edge_timestamps_us):
    if len(edge_timestamps_us) < 2: return 0.0
    period = (edge_timestamps_us[-1] - edge_timestamps_us[0]) / (len(edge_timestamps_us) - 1)
    return round(1000.0 / period, 1) if period > 0 else 0.0`,

  'skill-pcb-basics': `def estimate_trace_mils(current_amps, temp_rise_c):
    return round((current_amps * 30.0) / (temp_rise_c ** 0.3), 1)`
};

export const VerificationPage = ({ initialSkillId }) => {
  const { student, addVerifiedSkill, setActiveTab } = useStudent();
  const [selectedSkillId, setSelectedSkillId] = useState(
    initialSkillId || 'skill-rest-apis'
  );
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [showConfettiEffect, setShowConfettiEffect] = useState(false);

  // Update selected skill if prop changes
  useEffect(() => {
    if (initialSkillId) {
      setSelectedSkillId(initialSkillId);
    }
  }, [initialSkillId]);

  // Load challenge details
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const data = await api.getChallenge(selectedSkillId);
        setChallenge(data);
        setCode(data.starter_code || 'def solution(data):\n    pass\n');
        setExecutionResult(null);
        setShowConfettiEffect(false);
      } catch (err) {
        console.warn('Failed to fetch challenge', err);
      }
    };
    loadChallenge();
  }, [selectedSkillId]);

  const handleRunCode = async () => {
    setRunning(true);
    setExecutionResult(null);
    try {
      const res = await api.submitCode({
        studentId: student.id,
        skillId: selectedSkillId,
        code: code,
        language: challenge?.language || 'python'
      });
      setExecutionResult(res);

      if (res.all_passed) {
        addVerifiedSkill(selectedSkillId);
        setShowConfettiEffect(true);
        triggerConfetti();
      } else {
        setShowConfettiEffect(false);
      }
    } catch (e) {
      console.error('Submission error', e);
      setExecutionResult({
        all_passed: false,
        passed_count: 0,
        total_count: challenge?.test_cases?.length || 3,
        message: 'Sandbox evaluation error: ' + (e.message || 'Execution failed'),
        results: []
      });
      setShowConfettiEffect(false);
    } finally {
      setRunning(false);
    }
  };

  const handleAutoSolve = () => {
    if (SOLUTION_TEMPLATES[selectedSkillId]) {
      setCode(SOLUTION_TEMPLATES[selectedSkillId]);
      setExecutionResult(null);
    } else {
      setCode(challenge?.starter_code || 'def solution(data):\n    return sum(data)\n');
      setExecutionResult(null);
    }
  };

  const handleInsertWrongAnswer = () => {
    // Helper to let tester see the test runner correctly detect and reject wrong code
    setCode(`# Intentionally incorrect code for testing assertion failure
def ${challenge?.starter_code?.split('def ')[1]?.split('(')[0] || 'solution'}(*args, **kwargs):
    # This returns an incorrect dummy answer to verify failure handling
    return "wrong_output_test_value"
`);
    setExecutionResult(null);
  };

  const isVerified = student.verified_skills?.includes(selectedSkillId);

  return (
    <div className="space-y-6 py-2 sm:py-4">
      
      {/* HEADER & SKILL SELECTOR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="icon-3d icon-3d-navy w-11 h-11 rounded-2xl flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                Live Verification IDE
              </Badge>
              {isVerified ? (
                <Badge variant="verified" size="sm">
                  Skill Verified
                </Badge>
              ) : (
                <Badge variant="gap" size="sm">
                  Ready for Evaluation
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {challenge?.title || 'Interactive Coding Challenge'}
            </h1>
          </div>
        </div>

        {/* Skill Challenge Selector */}
        <div className="w-full sm:w-auto">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Select Challenge</label>
          <div className="relative">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full sm:w-88 px-3.5 py-2.5 rounded-xl border border-slate-300/90 text-xs font-semibold text-slate-800 bg-white/95 shadow-sm focus:ring-2 focus:ring-[#1F4E5F] focus:border-transparent transition-all cursor-pointer hover:border-slate-400"
            >
              {AVAILABLE_CHALLENGES.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.label} {student.verified_skills?.includes(ch.id) ? '✓ (Verified)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SUCCESS CONFETTI NOTIFICATION BANNER */}
      {showConfettiEffect && executionResult?.all_passed && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20 border border-emerald-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3.5">
            <div className="icon-3d icon-3d-emerald w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black tracking-tight">Skill Verified Successfully!</h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                All test assertions succeeded. Your readiness score and personalized roadmap have been updated.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="accent"
              size="sm"
              onClick={() => setActiveTab('roadmap')}
              className="text-xs font-bold text-slate-950 shadow-md"
            >
              See Roadmap
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('opportunities')}
              className="text-xs font-semibold bg-white/20 text-white hover:bg-white/30 border-white/20"
            >
              See Internships
            </Button>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN IDE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Problem Description & Requirements (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="default" className="p-5 sm:p-6 space-y-4 bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1F4E5F] to-teal-400"></div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="icon-3d icon-3d-navy w-7 h-7 rounded-lg flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-teal-300" />
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Challenge Spec
                </span>
              </div>
              <Badge variant="accent" size="sm" icon={false}>
                {challenge?.difficulty || 'Intermediate'}
              </Badge>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
              {challenge?.description || 'Loading challenge description...'}
            </div>

            {/* Test Cases Preview */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-600" />
                Target Test Case Expectations:
              </span>
              <div className="space-y-2">
                {challenge?.test_cases?.map((tc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 text-[11px] font-mono hover:border-teal-300 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">Case {idx + 1}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 font-sans">Required</span>
                    </div>
                    <span className="text-slate-600 block truncate">Input: {tc.input}</span>
                    <span className="text-teal-700 font-semibold block mt-1">
                      &rarr; Expected: {tc.expected}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strict Sandboxed Test Assertion Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50/80 to-emerald-50/80 border border-teal-200/80 text-[11px] text-teal-900 space-y-1 shadow-xs">
              <div className="font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-700" />
                <span>Automated Test Assertion Engine</span>
              </div>
              <p className="text-teal-800 leading-relaxed text-[11px]">
                Submissions are executed in an isolated Python 3 sandbox. All assertions must evaluate strictly to verify your skill.
              </p>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Code Editor & Output Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-2xl code-glow-ide flex flex-col transition-all">
            
            {/* macOS Window Chrome & Editor Top Bar */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Window Controls & File Tab */}
              <div className="flex items-center gap-3">
                {/* macOS traffic light window dots */}
                <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block shadow-xs"></span>
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block shadow-xs"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] inline-block shadow-xs"></span>
                </div>

                {/* Active Tab */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 text-slate-200 font-mono font-semibold text-[11px]">
                  <Code2 className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>solution.py</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>

                <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Python 3.10 Sandboxed
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoSolve}
                  title="Load reference solution"
                  className="px-2.5 py-1 text-[11px] font-bold bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 rounded-lg border border-amber-400/40 transition-all hover:scale-105 active:scale-95 shadow-xs flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Demo Solution</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertWrongAnswer}
                  title="Test wrong code to verify failure rejection"
                  className="px-2.5 py-1 text-[11px] font-semibold bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 rounded-lg border border-rose-400/30 transition-all hover:scale-105 active:scale-95 shadow-xs flex items-center gap-1"
                >
                  <Bug className="w-3 h-3" />
                  <span>Test Wrong Answer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCode(challenge?.starter_code || '')}
                  title="Reset to starter code"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Input Area with line backdrop */}
            <div className="relative bg-slate-950 flex">
              <div className="hidden sm:flex flex-col py-4 pl-3 pr-2 text-slate-600 font-mono text-xs select-none border-r border-slate-900/80 text-right w-10 shrink-0">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="leading-relaxed text-[11px]">{i + 1}</span>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full p-4 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none border-none selection:bg-[#1F4E5F] selection:text-white placeholder-slate-600"
              />
            </div>

            {/* Action Bar */}
            <div className="px-4 py-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-teal-400" />
                Judge0 Isolated Python Sandbox
              </span>

              <Button
                variant="accent"
                size="sm"
                onClick={handleRunCode}
                loading={running}
                iconLeft={Play}
                className="text-xs font-bold text-slate-950 shadow-accent px-5 hover:scale-105 active:scale-95 transition-transform"
              >
                Run & Verify Code
              </Button>
            </div>
          </div>

          {/* EXECUTION RESULTS / TEST CASES PANEL */}
          {executionResult && (
            <Card variant="default" className="p-5 bg-white border border-slate-200/90 shadow-lg space-y-3 animate-in fade-in duration-200 rounded-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`icon-3d ${executionResult.all_passed ? 'icon-3d-emerald' : 'icon-3d-rose'} w-8 h-8 rounded-xl flex items-center justify-center`}>
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      Evaluation Output
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {executionResult.passed_count} of {executionResult.total_count} test cases passed
                    </span>
                  </div>
                </div>
                {executionResult.all_passed ? (
                  <Badge variant="verified" size="sm">
                    Passed (All Cases Succeeded)
                  </Badge>
                ) : (
                  <Badge variant="gap" size="sm">
                    Failed (Assertion Mismatch)
                  </Badge>
                )}
              </div>

              <div className={`p-3.5 rounded-xl text-xs font-medium border ${
                executionResult.all_passed
                  ? 'bg-teal-50/80 border-teal-200 text-teal-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}>
                {executionResult.message}
              </div>

              {/* Individual Test Cases List */}
              <div className="space-y-2 pt-1">
                {executionResult.results?.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs font-mono transition-all hover:shadow-xs ${
                      res.passed
                        ? 'bg-teal-50/40 border-teal-200/80 text-teal-900'
                        : 'bg-rose-50/40 border-rose-200/80 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        {res.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>Test Case {res.test_case_index}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-sans px-2 py-0.5 rounded bg-white/70 border border-slate-200">
                        {res.execution_time_ms} ms
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] space-y-1">
                      <div className="text-slate-600 truncate">Input: {res.input_str}</div>
                      <div>Expected: <span className="font-semibold text-slate-800">{res.expected_str}</span></div>
                      <div>Actual: <span className={res.passed ? 'font-semibold text-teal-700' : 'font-semibold text-rose-700'}>{res.actual_str}</span></div>
                      {res.error_message && (
                        <div className="text-rose-600 font-sans mt-1 text-[11px] font-semibold bg-rose-100/60 p-2 rounded-lg">
                          Assertion: {res.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
};
