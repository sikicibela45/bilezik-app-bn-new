import { MapPin, Phone, User, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkshopCard({ workshop, onEdit, onDelete }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card group hover:shadow-md transition-shadow duration-300"
        >
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {workshop.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{workshop.code || 'Kod yok'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${workshop.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {workshop.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2 text-primary/70" />
                        {workshop.owner}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-primary/70" />
                        {workshop.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="truncate">{workshop.address}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => onEdit(workshop)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(workshop.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
