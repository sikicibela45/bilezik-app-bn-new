import { useState, useEffect } from 'react';
import { Send, Plus, Trash2, Smartphone, Save } from 'lucide-react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const variables = [
    { key: '{{yetkili}}', label: 'Yetkili Adı' },
    { key: '{{atolye}}', label: 'Atölye Adı' },
    { key: '{{siparis_no}}', label: 'Sipariş No' },
    { key: '{{urun_tipi}}', label: 'Ürün Tipi' },
    { key: '{{tarih}}', label: 'Tarih' },
];

export default function Templates() {
    const [templates, setTemplates] = useState([]);
    const [activeTemplate, setActiveTemplate] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "templates"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTemplates(data);
            if (data.length > 0 && !activeTemplate) {
                // Only set default if none selected, but beware of overwriting user work if they are editing a doc that gets updated externally. 
                // For simplicity in this local-first-ish feel, we won't auto-select if something is selected, UNLESS the selected one was deleted.
                // Actually initial load:
            }
        });
        return () => unsubscribe();
    }, []);

    // Effect to set initial active template
    useEffect(() => {
        if (templates.length > 0 && !activeTemplate) {
            setActiveTemplate(templates[0]);
        }
    }, [templates, activeTemplate]);

    const handleContentChange = (e) => {
        setActiveTemplate({ ...activeTemplate, content: e.target.value });
    };

    const handleSave = async () => {
        if (!activeTemplate) return;
        try {
            const templateRef = doc(db, "templates", activeTemplate.id);
            await updateDoc(templateRef, {
                content: activeTemplate.content,
                name: activeTemplate.name
            });
            alert("Şablon kaydedildi.");
        } catch (error) {
            console.error("Error saving template: ", error);
            alert("Kaydetme hatası.");
        }
    };

    const insertVariable = (variable) => {
        if (!activeTemplate) return;
        const newContent = (activeTemplate.content || '') + ' ' + variable;
        setActiveTemplate({ ...activeTemplate, content: newContent });
    };

    const addNewTemplate = async () => {
        try {
            const newTemplate = {
                name: 'Yeni Şablon',
                content: 'Merhaba {{yetkili}}, ...'
            };
            const docRef = await addDoc(collection(db, "templates"), newTemplate);
            setActiveTemplate({ id: docRef.id, ...newTemplate });
        } catch (error) {
            console.error("Error adding template: ", error);
        }
    };

    const deleteTemplate = async (id) => {
        if (window.confirm('Bu şablonu silmek istediğinize emin misiniz?')) {
            try {
                await deleteDoc(doc(db, "templates", id));
                if (activeTemplate?.id === id) {
                    setActiveTemplate(null);
                }
            } catch (error) {
                console.error("Error deleting template: ", error);
            }
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
            {/* Sidebar List */}
            <div className="md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-semibold text-gray-700">Şablonlarım</h2>
                    <button
                        onClick={addNewTemplate}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <Plus className="h-5 w-5 text-primary" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {templates.map(template => (
                        <div
                            key={template.id}
                            onClick={() => setActiveTemplate(template)}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${activeTemplate?.id === template.id
                                ? 'bg-primary-light/10 border-primary text-primary'
                                : 'hover:bg-gray-50 border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-center group">
                                <span className="font-medium truncate">{template.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-500 rounded transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-1">{template.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor & Preview */}
            <div className="md:w-2/3 flex flex-col gap-6">
                {/* Editor */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label className="input-label">Şablon İçeriği</label>
                        <button
                            onClick={handleSave}
                            className="flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors px-3 py-1 rounded-md hover:bg-primary-light/10"
                        >
                            <Save className="h-4 w-4 mr-1" />
                            Kaydet
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {variables.map(v => (
                            <button
                                key={v.key}
                                onClick={() => insertVariable(v.key)}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none font-mono text-sm"
                        value={activeTemplate?.content || ''}
                        onChange={handleContentChange}
                        placeholder="Mesaj içeriğini buraya yazın..."
                    />
                </div>

                {/* WhatsApp Preview */}
                <div className="bg-[#e5ddd5] rounded-xl shadow-inner border border-gray-200 p-4 relative overflow-hidden h-64 md:h-auto md:flex-1">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-10 pointer-events-none">
                        <Smartphone className="h-64 w-64" />
                    </div>

                    <div className="max-w-md mx-auto bg-white rounded-lg p-3 shadow-sm relative mr-auto ml-0 rounded-bl-none animate-fade-in-up">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {activeTemplate?.content.replace(/{{.*?}}/g, (match) => {
                                // Replace variables with mock data for preview
                                const mockData = {
                                    '{{yetkili}}': 'Ahmet Bey',
                                    '{{atolye}}': 'Altınbaş Atölye',
                                    '{{siparis_no}}': '12345',
                                    '{{urun_tipi}}': '22 Ayar Bilezik',
                                    '{{tarih}}': '15.02.2026'
                                };
                                return mockData[match] || match;
                            })}
                        </p>
                        <div className="text-[10px] text-gray-400 text-right mt-1 flex justify-end items-center">
                            14:30 <span className="ml-1 text-blue-400">✓✓</span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        <button className="flex items-center px-4 py-2 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-colors font-medium">
                            <Send className="h-4 w-4 mr-2" />
                            Test Gönder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
