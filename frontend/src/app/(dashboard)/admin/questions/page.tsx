'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, X, CheckCircle, Loader2, ChevronDown, Search, AlertCircle } from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';

interface Test {
    id: string;
    name: string;
    category: string;
}

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: string;
    test: string;
    question_text: string;
    question_type: 'mcq' | 'true_false' | 'wat';
    options: Option[];
    correct_answer: string;
    difficulty_level: 'easy' | 'medium' | 'hard';
    explanation: string;
    order: number;
    bank_order: number;
}

const emptyOptions: Option[] = [
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' },
    { id: 'e', text: '' },
];

const emptyForm = {
    test: '',
    question_text: '',
    question_type: 'mcq' as const,
    options: emptyOptions,
    correct_answer: 'a',
    difficulty_level: 'medium' as const,
    explanation: '',
    order: 0,
    bank_order: 0,
};

const DIFFICULTY_CONFIG = {
    easy: { label: 'Easy', color: 'text-green-600', bg: 'bg-green-50' },
    medium: { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    hard: { label: 'Hard', color: 'text-red-600', bg: 'bg-red-50' },
};

const TYPE_CONFIG = {
    mcq: 'Multiple Choice',
    true_false: 'True / False',
    wat: 'Word Association',
};

export default function AdminQuestionsPage() {
    const searchParams = useSearchParams();
    const [tests, setTests] = useState<Test[]>([]);
    const [selectedTest, setSelectedTest] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingTests, setLoadingTests] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => { fetchTests(); }, []);

    useEffect(() => {
        if (selectedTest) fetchQuestions(selectedTest);
        else setQuestions([]);
    }, [selectedTest]);

    useEffect(() => {
        const initialTest = searchParams.get('test_id') || searchParams.get('test');
        if (initialTest && tests.some(test => test.id === initialTest)) {
            setSelectedTest(initialTest);
        }
    }, [searchParams, tests]);

    const fetchTests = async () => {
        try {
            const res = await api.get('/tests/tests/');
            const data = res.data.results || res.data;
            setTests(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load tests');
        } finally {
            setLoadingTests(false);
        }
    };

    const fetchQuestions = async (testId: string) => {
        setLoading(true);
        try {
            const res = await api.get(`/questions/questions/?test_id=${testId}`);
            const data = res.data.results || res.data;
            setQuestions(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const updateOption = (idx: number, text: string) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => i === idx ? { ...opt, text } : opt)
        }));
    };

    const handleTypeChange = (type: 'mcq' | 'true_false' | 'wat') => {
        if (type === 'true_false') {
            setFormData(prev => ({ ...prev, question_type: type, options: [{ id: 'a', text: 'True' }, { id: 'b', text: 'False' }], correct_answer: 'a' }));
        } else if (type === 'wat') {
            setFormData(prev => ({ ...prev, question_type: type, options: [], correct_answer: '' }));
        } else {
            setFormData(prev => ({ ...prev, question_type: type, options: emptyOptions, correct_answer: 'a' }));
        }
    };

    const handleSubmit = async () => {
        if (!formData.test || !formData.question_text) {
            toast.error('Test and question text are required');
            return;
        }
        if (formData.question_type === 'mcq') {
            const filled = formData.options.filter(o => o.text.trim());
            if (filled.length < 2) {
                toast.error('At least 2 options are required');
                return;
            }
        }

        setSaving(true);
        try {
            // Filter empty options for MCQ
            const finalOptions = formData.question_type === 'mcq'
                ? formData.options.filter(o => o.text.trim())
                : formData.options;

            if (imageFile) {
                // Use FormData only when image is attached
                const form = new FormData();
                form.append('test', formData.test);
                form.append('question_text', formData.question_text);
                form.append('question_type', formData.question_type);
                form.append('options', JSON.stringify(finalOptions));
                form.append('correct_answer', formData.correct_answer || '');
                form.append('difficulty_level', formData.difficulty_level);
                form.append('explanation', formData.explanation || '');
                form.append('order', String(formData.order || 0));
                form.append('bank_order', String(formData.bank_order || 0));
                form.append('image', imageFile);

                const config = { headers: { 'Content-Type': 'multipart/form-data' } };

                if (editingId) {
                    const res = await api.patch(`/questions/questions/${editingId}/`, form, config);
                    setQuestions(prev => prev.map(q => q.id === editingId ? res.data : q));
                } else {
                    const res = await api.post('/questions/questions/', form, config);
                    setQuestions(prev => [...prev, res.data]);
                }
            } else {
                // Use JSON when no image
                const payload = {
                    test: formData.test,
                    question_text: formData.question_text,
                    question_type: formData.question_type,
                    options: finalOptions,
                    correct_answer: formData.correct_answer || '',
                    difficulty_level: formData.difficulty_level,
                    explanation: formData.explanation || '',
                    order: formData.order || 0,
                    bank_order: formData.bank_order || 0,
                };

                if (editingId) {
                    const res = await api.patch(`/questions/questions/${editingId}/`, payload);
                    setQuestions(prev => prev.map(q => q.id === editingId ? res.data : q));
                } else {
                    const res = await api.post('/questions/questions/', payload);
                    setQuestions(prev => [...prev, res.data]);
                }
            }

            toast.success(editingId ? 'Question updated!' : 'Question added!');
            handleCancel();
        } catch (err: any) {
            const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (q: Question) => {
        let options = Array.isArray(q.options) ? q.options : [];
        if (q.question_type === 'mcq' && options.length < 5) {
            const ids = ['a', 'b', 'c', 'd', 'e'];
            while (options.length < 5) {
                options = [...options, { id: ids[options.length], text: '' }];
            }
        }
        setFormData({
            test: q.test,
            question_text: q.question_text,
            question_type: q.question_type,
            options,
            correct_answer: q.correct_answer,
            difficulty_level: q.difficulty_level,
            explanation: q.explanation || '',
            order: q.order,
            bank_order: q.bank_order,
        });
        setEditingId(q.id);
        setImageFile(null);
        setImagePreview(null);
        setShowForm(true);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this question? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            await api.delete(`/questions/questions/${id}/`);
            setQuestions(prev => prev.filter(q => q.id !== id));
            toast.success('Question deleted');
        } catch {
            toast.error('Failed to delete question');
        } finally {
            setDeletingId(null);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ ...emptyForm, test: selectedTest });
        setImageFile(null);
        setImagePreview(null);
    };

    const filteredQuestions = questions.filter(q =>
        q.question_text.toLowerCase().includes(search.toLowerCase())
    );

    const selectedTestName = tests.find(t => t.id === selectedTest)?.name || '';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Question Management</h1>
                    <p className="text-slate-400 mt-1">Add, edit, or delete questions for each test.</p>
                </div>
                {selectedTest && (
                    <Button
                        onClick={() => { setFormData({ ...emptyForm, test: selectedTest }); setShowForm(true); setEditingId(null); }}
                        className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white border-0 gap-2 shadow-lg shadow-sky-500/20"
                    >
                        <Plus className="w-4 h-4" /> Add Question
                    </Button>
                )}
            </div>

            {/* Test selector */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg p-6">
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Select Test to Manage Questions</label>
                {loadingTests ? (
                    <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading tests...</div>
                ) : (
                    <select
                        value={selectedTest}
                        onChange={e => setSelectedTest(e.target.value)}
                        className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400 max-w-lg"
                    >
                        <option value="">— Select a test —</option>
                        {tests.map(test => (
                            <option key={test.id} value={test.id}>{test.name}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-slate-950/95 rounded-2xl border border-slate-800 shadow-2xl p-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">
                            {editingId ? '✏️ Edit Question' : '➕ Add New Question'}
                            {selectedTestName && <span className="text-sm font-normal text-slate-400 ml-2">— {selectedTestName}</span>}
                        </h2>
                        <button onClick={handleCancel} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Question Type */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-200">Question Type</label>
                            <div className="flex gap-3 flex-wrap">
                                {(['mcq', 'true_false', 'wat'] as const).map(type => (
                                    <button key={type} type="button" onClick={() => handleTypeChange(type)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${formData.question_type === type ? 'border-sky-400 bg-slate-800 text-white' : 'border-slate-700 text-slate-300 hover:border-sky-400 hover:text-white'}`}>
                                        {TYPE_CONFIG[type]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-200">Question Text *</label>
                            <textarea rows={3} placeholder="Enter the question here..."
                                value={formData.question_text}
                                onChange={e => setFormData(p => ({ ...p, question_text: e.target.value }))}
                                className="flex w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-400 resize-none" />
                        </div>

                        {/* MCQ Options */}
                        {formData.question_type === 'mcq' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Answer Options *</label>
                                <div className="space-y-2">
                                    {formData.options.map((opt, idx) => (
                                        <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${formData.correct_answer === opt.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900'}`}>
                                            <button type="button" onClick={() => setFormData(p => ({ ...p, correct_answer: opt.id }))}
                                                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${formData.correct_answer === opt.id ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600 text-slate-300 hover:border-emerald-400'}`}>
                                                {opt.id.toUpperCase()}
                                            </button>
                                            <input type="text" placeholder={`Option ${opt.id.toUpperCase()}`} value={opt.text}
                                                onChange={e => updateOption(idx, e.target.value)}
                                                className="flex-1 bg-transparent text-slate-100 text-sm outline-none placeholder:text-slate-500" />
                                            {formData.correct_answer === opt.id && (
                                                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Correct
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400">Click the letter button to set the correct answer</p>
                            </div>
                        )}

                        {/* True/False */}
                        {formData.question_type === 'true_false' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Correct Answer</label>
                                <div className="flex gap-3">
                                    {['a', 'b'].map((id, idx) => (
                                        <button key={id} type="button" onClick={() => setFormData(p => ({ ...p, correct_answer: id }))}
                                            className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${formData.correct_answer === id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200' : 'border-slate-700 text-slate-300 hover:border-emerald-400'}`}>
                                            {idx === 0 ? '✓ True' : '✗ False'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* WAT */}
                        {formData.question_type === 'wat' && (
                            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-sky-300 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-300">WAT questions don't have options. Students write a word association for the given word/phrase.</p>
                            </div>
                        )}

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Attach Image (optional)</label>
                            <input type="file" accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setImageFile(file);
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => setImagePreview(reader.result as string);
                                        reader.readAsDataURL(file);
                                    } else {
                                        setImagePreview(null);
                                    }
                                }}
                                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500/10 file:text-sky-300 hover:file:bg-sky-500/20" />
                            {imagePreview && (
                                <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900 p-3">
                                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                                </div>
                            )}
                        </div>

                        {/* Difficulty + Order */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-200">Difficulty</label>
                                <select value={formData.difficulty_level} onChange={e => setFormData(p => ({ ...p, difficulty_level: e.target.value as any }))}
                                    className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400">
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-200">Order</label>
                                <Input type="number" value={formData.order} onChange={e => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="bg-slate-950 text-slate-100 border-slate-700" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-200">Bank Order</label>
                                <Input type="number" value={formData.bank_order} onChange={e => setFormData(p => ({ ...p, bank_order: parseInt(e.target.value) || 0 }))} className="bg-slate-950 text-slate-100 border-slate-700" />
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-200">Explanation (optional)</label>
                            <textarea rows={2} placeholder="Explain why the correct answer is correct..."
                                value={formData.explanation}
                                onChange={e => setFormData(p => ({ ...p, explanation: e.target.value }))}
                                className="flex w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-400 resize-none" />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button onClick={handleSubmit} disabled={saving} className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white border-0 gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            {editingId ? 'Save Changes' : 'Add Question'}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="border-slate-700 text-slate-100 hover:bg-slate-800/70">Cancel</Button>
                    </div>
                </div>
            )}

            {/* Questions List */}
            {selectedTest && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h2 className="text-lg font-bold text-white">
                            Questions
                            <span className="ml-2 px-2.5 py-0.5 bg-slate-800 text-slate-100 text-sm rounded-full font-medium">{filteredQuestions.length}</span>
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-slate-700 rounded-xl bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-sky-400 w-64" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                        </div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/90 rounded-2xl border border-slate-700">
                            <Plus className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                            <p className="text-slate-300 font-medium">No questions yet</p>
                            <p className="text-slate-500 text-sm mt-1">Click "Add Question" to add your first question.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredQuestions.map((q, idx) => {
                                const diff = DIFFICULTY_CONFIG[q.difficulty_level];
                                const opts = Array.isArray(q.options) ? q.options : [];
                                return (
                                    <div key={q.id} className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-slate-800">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-100 mb-2 leading-relaxed">{q.question_text}</p>
                                                    {opts.length > 0 && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                                                            {opts.map(opt => (
                                                                <div key={opt.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${q.correct_answer === opt.id ? 'bg-emerald-500/10 text-emerald-300 font-medium' : 'bg-slate-800 text-slate-300'}`}>
                                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${q.correct_answer === opt.id ? 'bg-emerald-400 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>
                                                                        {opt.id.toUpperCase()}
                                                                    </span>
                                                                    {opt.text}
                                                                    {q.correct_answer === opt.id && <CheckCircle className="w-3.5 h-3.5 ml-auto text-emerald-300" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diff.bg} ${diff.color}`}>{diff.label}</span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-200">{TYPE_CONFIG[q.question_type]}</span>
                                                        <span className="text-xs text-slate-400">Order: {q.bank_order}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(q)} className="border-slate-700 text-slate-100 hover:bg-slate-800/80 gap-1.5">
                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(q.id)} disabled={deletingId === q.id} className="border-red-500/20 text-red-300 hover:bg-red-500/10 gap-1.5">
                                                    {deletingId === q.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {!selectedTest && !loadingTests && (
                <div className="text-center py-20 bg-slate-900/90 rounded-2xl border border-slate-700">
                    <ChevronDown className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-300 font-medium">Select a test above to manage its questions</p>
                </div>
            )}
        </div>
    );
}
