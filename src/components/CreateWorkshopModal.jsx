import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Save } from 'lucide-react';

export default function CreateWorkshopModal({ isOpen, onClose, onSave, initialData = null }) {
    const [formData, setFormData] = useState({
        name: '',
        owner: '',
        phone: '',
        address: '',
        isActive: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                owner: '',
                phone: '',
                address: '',
                isActive: true
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {initialData ? 'Atölye Düzenle' : 'Yeni Atölye Ekle'}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="input-label">Atölye Adı</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input w-full mt-1"
                                            placeholder="Örn: Altınbaş Atölyesi"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Yetkili Kişi</label>
                                        <input
                                            type="text"
                                            name="owner"
                                            required
                                            value={formData.owner}
                                            onChange={handleChange}
                                            className="input w-full mt-1"
                                            placeholder="Örn: Ahmet Yılmaz"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Telefon</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input w-full mt-1"
                                            placeholder="0555 555 55 55"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Adres</label>
                                        <textarea
                                            name="address"
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="input w-full mt-1"
                                            placeholder="Atölye adresi..."
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                            Aktif Durumda
                                        </label>
                                    </div>

                                    <div className="mt-8 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="btn btn-outline"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex items-center"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Kaydet
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
