import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Check, Calendar, Weight, Edit3 } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

const productTypes = [
    { id: 'bilezik', name: 'Bilezik' },
    { id: 'yuzuk', name: 'Yüzük' },
    { id: 'kolye', name: 'Kolye' },
    { id: 'kupe', name: 'Küpe' },
    { id: 'ozel', name: 'Özel Sipariş' },
];

export default function Orders() {
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [orderType, setOrderType] = useState(productTypes[0]);
    const [orders, setOrders] = useState([]);
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        weight: '',
        quantity: 1,
        note: '',
        dueDate: ''
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "workshops"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkshops(data);
            if (data.length > 0 && !selectedWorkshop) {
                setSelectedWorkshop(data[0]);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedWorkshop) {
            alert('Lütfen bir atölye seçin.');
            return;
        }
        try {
            await addDoc(collection(db, "orders"), {
                ...formData,
                workshop: selectedWorkshop,
                orderType: orderType,
                createdAt: new Date(),
                createdBy: currentUser?.uid || 'anonymous',
                status: 'pending'
            });
            alert('Sipariş başarıyla oluşturuldu!');
            setFormData({ weight: '', quantity: 1, note: '', dueDate: '' });
        } catch (error) {
            console.error("Error creating order: ", error);
            alert("Sipariş oluşturulurken bir hata oluştu.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Yeni Sipariş Oluştur</h1>
                <p className="text-gray-500 mt-1">Seçili atölye için üretim siparişi oluşturun.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Summary / Visuals */}
                <div className="bg-primary p-8 text-white md:w-1/3 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-secondary blur-3xl" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-lg font-medium text-secondary">Sipariş Özeti</h3>
                        <div className="mt-6 space-y-4">
                            <div>
                                <span className="text-xs text-secondary-dark uppercase tracking-wider">Atölye</span>
                                <p className="font-semibold text-lg">{selectedWorkshop?.name || 'Seçiniz'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-secondary-dark uppercase tracking-wider">Ürün Tipi</span>
                                <p className="font-semibold text-lg">{orderType?.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-secondary-dark uppercase tracking-wider">Tahmini Teslim</span>
                                <p className="font-semibold text-lg">{formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('tr-TR') : '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                        <ShoppingBag className="h-24 w-24 text-white opacity-20 absolute -bottom-4 -right-4 transform rotate-12" />
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:w-2/3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Workshop Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Atölye Seçimi</label>
                            <Listbox value={selectedWorkshop} onChange={setSelectedWorkshop}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
                                        <span className="block truncate">{selectedWorkshop?.name || 'Atölye Seçiniz'}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as="div"
                                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options>
                                            {workshops.map((workshop) => (
                                                <Listbox.Option
                                                    key={workshop.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-light text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={workshop}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                {workshop.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                                                                    <Check className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                            {workshops.length === 0 && (
                                                <div className="py-2 px-4 text-gray-500">Kayıtlı atölye yok via 'Atölye Yönetimi'</div>
                                            )}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>

                        {/* Product Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Tipi</label>
                            <div className="grid grid-cols-3 gap-3">
                                {productTypes.map((type) => (
                                    <button
                                        type="button"
                                        key={type.id}
                                        onClick={() => setOrderType(type)}
                                        className={`
                      py-2 px-3 text-sm font-medium rounded-lg border transition-all
                      ${orderType.id === type.id
                                                ? 'bg-primary text-white border-primary shadow-md'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        {type.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="input-label flex items-center">
                                    <Weight className="h-4 w-4 mr-1" />
                                    Gramaj / Adet
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        name="weight"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="input rounded-r-none w-full"
                                    />
                                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                        gr
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="input-label">Adet</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="input w-full mt-1"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="input-label flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Teslim Tarihi
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="input w-full mt-1"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="input-label flex items-center">
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Sipariş Notu
                                </label>
                                <textarea
                                    name="note"
                                    rows={3}
                                    className="input w-full mt-1"
                                    placeholder="Özel işlem detayları..."
                                    value={formData.note}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full btn btn-primary py-3 text-lg shadow-lg hover:shadow-primary/30 transform transition-transform active:scale-95">
                                Siparişi Oluştur
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Recent Orders List */}
            {orders.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Son Oluşturulan Siparişler</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atölye</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detay</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.workshop?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderType?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.quantity} adet {order.weight && `(${order.weight}gr)`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
