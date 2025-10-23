import React, { useState } from 'react';
import { X, Phone, FileText, Mail, Link2, Calendar, DollarSign, Users, AlertCircle, Search } from 'lucide-react';

const PopupInfoPayroll = ({isOpen, setIsOpen, infoItems}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todo', icon: <Users size={18} /> },
    { id: 'general', name: 'General', icon: <Calendar size={18} /> },
    { id: 'actualiza', name: 'Actualización', icon: <FileText size={18} /> },
    { id: 'enrolamiento', name: 'Enrolamiento', icon: <Users size={18} /> },
    { id: 'contra', name: 'Contraseña', icon: <Calendar size={18} /> },
    { id: 'credito', name: 'Solicitud crédito', icon: <DollarSign size={18} /> },
    { id: 'bloqueos', name: 'Bloqueos', icon: <AlertCircle size={18} /> },
  ];

  const tickets = [
    {
      type: 'afiliados',
      message: 'Se intentó generar comunicación con el afiliado en varias ocasiones y se va a buzón de voz.',
      action: 'Por favor comunicarse a la línea 6012193096 para validar su solicitud.'
    },
    {
      type: 'operador',
      message: 'Se intentó generar comunicación con el Operador en varias ocasiones y se va a buzón de voz.',
      action: 'Por favor comunicarse a la línea 6012193096 para validar su solicitud.'
    }
  ];

  const normalizeText = (text) => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const filteredItems = infoItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    if (searchTerm === '') return matchesCategory;
    
    const searchNormalized = normalizeText(searchTerm);
    const matchesSearch = 
      normalizeText(item.title).includes(searchNormalized) ||
      (item.description && normalizeText(item.description).includes(searchNormalized)) ||
      (item.action && normalizeText(item.action).includes(searchNormalized)) ||
      normalizeText(item.category).includes(searchNormalized) ||
      (item.items && item.items.some(subItem => normalizeText(subItem).includes(searchNormalized))) ||
      (item.contact && item.contact.some(c => normalizeText(c.value).includes(searchNormalized))) ||
      (item.sections && item.sections.some(section => 
        normalizeText(section.subtitle).includes(searchNormalized) ||
        normalizeText(section.description).includes(searchNormalized) ||
        (section.contact && section.contact.some(c => normalizeText(c.value).includes(searchNormalized)))
      ));
    
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border"
        style={{
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="flex bg-purple-light p-3">
          {/* Search Bar */}
          <div className="w-full m-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar información..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-md border border-white/50 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center -m-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-purple-light text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-200'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-4 bg-gray-50" style={{ maxHeight: 'calc(95vh - 200px)' }}>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-400 transition-all duration-300 hover:shadow-lg"
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-purple-600">
                  {categories.find(c => c.id === item.category)?.icon}
                </span>
                {item.title}
              </h3>
              
              {item.description && (
                <p className="text-gray-600 mb-2">{item.description}</p>
              )}
              
              {item.action && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r mb-3">
                  <p className="text-blue-800 text-sm font-medium">
                    ✓ {item.action}
                  </p>
                </div>
              )}
              
              {item.items && (
                <ul className="space-y-2">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-500 mt-1 font-bold">▸</span>
                      <span>{subItem}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Secciones múltiples */}
              {item.sections && (
                <div className="space-y-4 mt-3">
                  {item.sections.map((section, secIndex) => (
                    <div key={secIndex} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-700 mb-2 text-lg">{section.subtitle}</h4>
                      <p className="text-gray-700 mb-3">{section.description}</p>
                      
                      {section.contact && (
                        <div className="flex flex-wrap gap-2">
                          {section.contact.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-purple-200">
                              {c.type === 'email' ? <Mail size={16} className="text-blue-600" /> : <Phone size={16} className="text-green-600" />}
                              <span className="text-gray-700 text-sm font-mono">{c.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {item.contact && !item.sections && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {item.contact.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                      {c.type === 'email' ? <Mail size={16} className="text-blue-600" /> : <Phone size={16} className="text-green-600" />}
                      <span className="text-gray-700 text-sm font-mono">{c.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Tickets Section */}
          <div className="mt-6 pt-6 border-t border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-amber-500" size={24} />
              Tickets de Seguimiento
            </h3>
            <div className="space-y-3">
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <AlertCircle className="text-amber-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800 mb-2 uppercase text-sm">
                        {ticket.type}
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">{ticket.message}</p>
                      <p className="text-amber-700 text-sm font-medium">{ticket.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PopupInfoPayroll;