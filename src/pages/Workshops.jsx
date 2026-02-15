import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import WorkshopCard from '../components/WorkshopCard';
import CreateWorkshopModal from '../components/CreateWorkshopModal';
import { AnimatePresence, motion } from 'framer-motion';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Workshops() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingWorkshop, setEditingWorkshop] = useState(null);
    const [workshops, setWorkshops] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "workshops"), (snapshot) => {
            const workshopsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkshops(workshopsData);
        });
        return () => unsubscribe();
    }, []);

    const handleCreate = async (data) => {
        try {
            if (editingWorkshop) {
                await updateDoc(doc(db, "workshops", editingWorkshop.id), data);
            } else {
                await addDoc(collection(db, "workshops"), {
                    ...data,
                    code: `W-${Math.floor(1000 + Math.random() * 9000)}`
                });
            }
            setEditingWorkshop(null);
        } catch (error) {
            console.error("Error saving workshop: ", error);
            alert("İşlem sırasında bir hata oluştu.");
        }
    };

    const handleEdit = (workshop) => {
        setEditingWorkshop(workshop);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu atölyeyi silmek istediğinize emin misiniz?')) {
            try {
                await deleteDoc(doc(db, "workshops", id));
            } catch (error) {
                console.error("Error deleting workshop: ", error);
                alert("Silme işlemi başarısız oldu.");
            }
        }
    };

    const openCreateModal = () => {
        setEditingWorkshop(null);
        setIsModalOpen(true);
    };

    const filteredWorkshops = workshops.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Atölye Yönetimi</h1>
                    <p className="text-gray-500 mt-1">İş ortaklarınız olan atölyeleri buradan yönetebilirsiniz.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary flex items-center shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Yeni Atölye Ekle
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="input pl-10 w-full"
                        placeholder="Atölye adı veya yetkili ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn btn-outline flex items-center text-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrele
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredWorkshops.map((workshop) => (
                        <WorkshopCard
                            key={workshop.id}
                            workshop={workshop}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </AnimatePresence>

                {filteredWorkshops.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        Aradığınız kriterlere uygun atölye bulunamadı.
                    </div>
                )}
            </div>

            <CreateWorkshopModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreate}
                initialData={editingWorkshop}
            />
        </div>
    );
}
