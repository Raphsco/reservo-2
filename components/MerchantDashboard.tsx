import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, Users, Calendar, DollarSign, Plus, Move, CheckCircle, Save, QrCode, BarChart3, Menu as MenuIcon, Search, Phone, Mail, X, ScanLine, LogOut, ChevronRight, Layers, User, Briefcase, UserPlus, Palette, Trash2, AtSign } from 'lucide-react';
import { PricingType } from '../types';

// Mock Data for CRM
const MOCK_CRM_CLIENTS = [
  { id: 1, name: 'Martin Dupont', visits: 12, lastVisit: '10 Oct', status: 'Gold', points: 1250, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { id: 2, name: 'Sophie Lemaire', visits: 3, lastVisit: '22 Sept', status: 'New', points: 120, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { id: 3, name: 'Thomas Bernard', visits: 8, lastVisit: 'Hier', status: 'Silver', points: 450, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { id: 4, name: 'Julie Dubois', visits: 1, lastVisit: '05 Août', status: 'Lost', points: 50, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
];

// Initial Mock Data for Staff
const INITIAL_STAFF = [
    { id: 'all', name: 'Vue d\'ensemble', avatar: null, color: 'bg-gray-800', role: 'System' },
    { id: '1', name: 'Alex', role: 'Senior', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: '2', name: 'Sarah', role: 'Junior', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: '3', name: 'Marc', role: 'Apprenti', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80', color: 'bg-amber-100 text-amber-800 border-amber-200' },
];

// Mock Data for Appointments
const MOCK_APPOINTMENTS = [
    { id: 101, staffId: '1', client: 'M. Dupont', service: 'Vidange', time: '09:00', durationHours: 1, top: 60 }, // 60px from top approx
    { id: 102, staffId: '2', client: 'Léa Z.', service: 'Coupe', time: '10:00', durationHours: 0.75, top: 120 },
    { id: 103, staffId: '1', client: 'Taxi 5', service: 'Révision', time: '11:00', durationHours: 1.5, top: 180 },
    { id: 104, staffId: '3', client: 'Mme. Martin', service: 'Pneus', time: '14:00', durationHours: 1, top: 360 },
    { id: 105, staffId: '2', client: 'Julie D.', service: 'Coloration', time: '15:30', durationHours: 2, top: 450 },
];

const chartData = [
  { name: 'Lun', visits: 12 },
  { name: 'Mar', visits: 19 },
  { name: 'Mer', visits: 15 },
  { name: 'Jeu', visits: 22 },
  { name: 'Ven', visits: 30 },
  { name: 'Sam', visits: 45 },
  { name: 'Dim', visits: 10 },
];

export const MerchantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'AGENDA' | 'CLIENTS' | 'STATS' | 'SERVICES'>('AGENDA');
  const [configSubTab, setConfigSubTab] = useState<'OFFER' | 'TEAM'>('OFFER');
  
  // Staff State
  const [staffMembers, setStaffMembers] = useState(INITIAL_STAFF);
  const [selectedStaffId, setSelectedStaffId] = useState('all');

  // Staff Form State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffJob, setNewStaffJob] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Employé');
  const [newStaffColor, setNewStaffColor] = useState('blue');

  const [newServiceType, setNewServiceType] = useState<PricingType>(PricingType.FIXED);
  const [showAutoSave, setShowAutoSave] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Filter Appointments
  const visibleAppointments = useMemo(() => {
      if (selectedStaffId === 'all') return MOCK_APPOINTMENTS;
      return MOCK_APPOINTMENTS.filter(appt => appt.staffId === selectedStaffId);
  }, [selectedStaffId, staffMembers]); // Add staffMembers dependency although appointments are mock

  // Simulate Auto Save on form change
  const handleFormChange = () => {
    setShowAutoSave(true);
    setTimeout(() => setShowAutoSave(false), 2000);
  };

  const handleScan = () => {
      // Simulation of a successful scan
      setTimeout(() => {
          alert("Scan réussi ! Client identifié : Martin Dupont. +1 Visite ajoutée.");
          setShowScanner(false);
      }, 1500);
  };

  const handleAddStaff = () => {
      if (!newStaffName || !newStaffEmail) {
          alert("Veuillez remplir au moins le nom et l'email.");
          return;
      }

      // Map simple color to tailwind classes for the UI consistency
      const colorMap: Record<string, string> = {
          'blue': 'bg-blue-100 text-blue-800 border-blue-200',
          'green': 'bg-green-100 text-green-800 border-green-200',
          'purple': 'bg-purple-100 text-purple-800 border-purple-200',
          'amber': 'bg-amber-100 text-amber-800 border-amber-200',
          'red': 'bg-red-100 text-red-800 border-red-200',
      };

      const newMember = {
          id: Date.now().toString(),
          name: newStaffName,
          role: newStaffJob || newStaffRole, // Use Job title if present, otherwise generic role
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newStaffName)}&background=random`,
          color: colorMap[newStaffColor] || colorMap['blue']
      };

      setStaffMembers(prev => [...prev, newMember]);
      
      // Reset form
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffJob('');
      setShowAutoSave(true);
      setTimeout(() => setShowAutoSave(false), 2000);
      alert(`Invitation envoyée à ${newStaffEmail}`);
  };

  const handleDeleteStaff = (id: string) => {
      if(confirm("Supprimer ce collaborateur ?")) {
          setStaffMembers(prev => prev.filter(s => s.id !== id));
      }
  };

  return (
    // ROOT CONTAINER: Absolute + Flex Column to ensure correct scrolling within App layout
    <div className="absolute inset-0 flex flex-col bg-gray-50 overflow-hidden font-sans">
      
      {/* Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
            <button onClick={() => setShowScanner(false)} className="absolute top-8 right-8 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-8 h-8" />
            </button>
            <div className="relative w-72 h-72 border-2 border-[#1E90FF] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(30,144,255,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E90FF]/20 to-transparent animate-scan"></div>
                {/* Camera simulation */}
                <div className="w-full h-full flex items-center justify-center">
                    <ScanLine className="w-16 h-16 text-white/50 animate-pulse" />
                </div>
                {/* Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
            </div>
            <p className="text-white mt-8 font-medium animate-pulse">Recherche de QR Code...</p>
            <p className="text-white/40 text-sm mt-2">Placez le code client dans le cadre</p>
            <button onClick={handleScan} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                Simuler un Scan
            </button>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-none z-20 shadow-sm flex justify-between items-center h-16">
        <div>
           <h1 className="text-lg font-bold text-gray-900 leading-tight">Garage Auto-Tech</h1>
           <p className="text-xs text-[#1E90FF] font-medium">
             {activeTab === 'AGENDA' && "📅 Planning"}
             {activeTab === 'CLIENTS' && "👥 Fichier Client"}
             {activeTab === 'STATS' && "📊 Performances"}
             {activeTab === 'SERVICES' && "⚙️ Gestion"}
           </p>
        </div>
        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 font-bold text-xs shadow-sm">
            GA
        </div>
      </header>

      {/* CONTENT AREA - SCROLLABLE */}
      {/* flex-1 and overflow-y-auto ensures this section takes available space and scrolls */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-4 md:p-6">
        
        {/* AGENDA VIEW */}
        {activeTab === 'AGENDA' && (
           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-[700px] flex flex-col animate-in slide-in-from-right duration-300">
              
              {/* Date Header */}
              <div className="flex justify-between items-center mb-4">
                 <div className="flex gap-2 items-baseline">
                     <span className="font-bold text-xl text-gray-800">Aujourd'hui</span>
                     <span className="text-sm text-gray-400">12 Oct</span>
                 </div>
                 <button className="text-xs bg-[#1E90FF] text-white px-3 py-2 rounded-lg flex items-center gap-2 font-medium shadow-md shadow-blue-500/20 active:scale-95 transition-transform hover:bg-blue-600">
                    <Plus className="w-3.5 h-3.5"/> Nouveau RDV
                 </button>
              </div>

              {/* STAFF FILTER (Total vs Collaborators) */}
              <div className="flex gap-3 mb-4 overflow-x-auto pb-2 no-scrollbar">
                  {staffMembers.map(staff => {
                      const isActive = selectedStaffId === staff.id;
                      return (
                          <button
                            key={staff.id}
                            onClick={() => setSelectedStaffId(staff.id)}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap
                                ${isActive 
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }
                            `}
                          >
                             {staff.id === 'all' ? (
                                <Layers className="w-4 h-4" />
                             ) : (
                                <img src={staff.avatar!} className="w-5 h-5 rounded-full border border-white" alt={staff.name} />
                             )}
                             <span className="text-xs font-bold">{staff.name}</span>
                          </button>
                      )
                  })}
              </div>

              {/* Simulated Calendar Grid */}
              <div className="flex-1 border-t border-gray-100 relative bg-[url('https://www.transparenttextures.com/patterns/grid.png')] overflow-hidden rounded-lg bg-gray-50/50">
                 {/* Time Labels */}
                 <div className="absolute top-0 left-0 w-12 h-full border-r border-gray-100 bg-white text-[10px] text-gray-400 py-2 flex flex-col justify-between font-medium z-10">
                    {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map(t => <div key={t} className="px-1 text-center">{t}</div>)}
                 </div>
                 
                 {/* Events Render */}
                 {visibleAppointments.map(appt => {
                     const staff = staffMembers.find(s => s.id === appt.staffId);
                     // Dynamic style for mock
                     const colorClass = staff?.color || 'bg-gray-100 border-gray-300 text-gray-700';
                     const height = appt.durationHours * 60; // Approx 60px per hour for this demo grid

                     return (
                        <div 
                            key={appt.id}
                            className={`absolute left-14 right-2 md:w-56 border-l-4 p-2 rounded text-xs cursor-move hover:shadow-lg transition-all group active:scale-95 active:cursor-grabbing z-10 ${colorClass}`}
                            style={{ 
                                top: `${appt.top}px`, 
                                height: `${height}px`,
                                // Simple offset logic for 'All' view to avoid complete overlap in this simple mock
                                left: selectedStaffId === 'all' ? `${14 + (parseInt(appt.staffId) * 15)}%` : '3.5rem',
                                width: selectedStaffId === 'all' ? '40%' : 'auto',
                                right: selectedStaffId === 'all' ? 'auto' : '0.5rem'
                            }}
                        >
                            <div className="font-bold flex justify-between items-center opacity-90">
                            {appt.client}
                            <Move className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                            </div>
                            <div className="mt-1 opacity-75 truncate">{appt.service} • {appt.time}</div>
                            {selectedStaffId === 'all' && (
                                <div className="absolute -top-2 -right-2">
                                    <img src={staff?.avatar!} className="w-5 h-5 rounded-full border border-white shadow-sm" alt="" />
                                </div>
                            )}
                        </div>
                     )
                 })}

                 {/* Current Time Line */}
                 <div className="absolute top-40 left-12 right-0 border-t-2 border-red-400 z-0 opacity-50 pointer-events-none">
                    <div className="absolute -top-1.5 -left-1 w-3 h-3 bg-red-400 rounded-full"></div>
                 </div>
              </div>
           </div>
        )}

        {/* CLIENTS VIEW */}
        {activeTab === 'CLIENTS' && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Rechercher un client..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] outline-none transition-all bg-white" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {MOCK_CRM_CLIENTS.map((client, index) => (
                        <div key={client.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${index !== MOCK_CRM_CLIENTS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{client.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full font-medium ${client.status === 'Gold' ? 'bg-yellow-100 text-yellow-700' : client.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {client.status}
                                    </span>
                                    <span>• {client.visits} visites</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-[#1E90FF] hover:bg-blue-50 rounded-full transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-center pt-4">
                    <button className="text-sm text-[#1E90FF] font-medium hover:underline">Voir tout l'historique</button>
                </div>
            </div>
        )}

        {/* STATS VIEW */}
        {activeTab === 'STATS' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                   <DollarSign className="w-4 h-4" /> <span className="text-xs font-medium uppercase">CA Jour</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">1,240 €</div>
                <div className="text-xs text-green-600 mt-1 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded">▲ +12%</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                   <Calendar className="w-4 h-4" /> <span className="text-xs font-medium uppercase">RDV</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-xs text-gray-400 mt-1">2 en attente</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#1E90FF]" /> Activité Semaine
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#F3F4F6'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Bar dataKey="visits" fill="#1E90FF" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES & TEAM VIEW (Previously MENU) */}
        {activeTab === 'SERVICES' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-in slide-in-from-right duration-300 relative">
             {showAutoSave && (
                <div className="absolute top-4 right-4 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pulse z-10">
                   <Save className="w-3 h-3" /> Sauvegardé
                </div>
             )}

             <div className="flex flex-col gap-6">
                 {/* Header & Tabs */}
                 <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                     <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {configSubTab === 'OFFER' ? <Briefcase className="w-5 h-5 text-[#1E90FF]" /> : <Users className="w-5 h-5 text-[#1E90FF]" />}
                        {configSubTab === 'OFFER' ? 'Mes Prestations' : 'Mon Équipe'}
                     </h2>
                     <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                          onClick={() => setConfigSubTab('OFFER')}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${configSubTab === 'OFFER' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                           Services
                        </button>
                        <button 
                          onClick={() => setConfigSubTab('TEAM')}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${configSubTab === 'TEAM' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                           Équipe
                        </button>
                     </div>
                 </div>

                 {/* OFFER CONFIGURATION */}
                 {configSubTab === 'OFFER' && (
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 transition-colors focus-within:bg-white focus-within:border-[#1E90FF] animate-in fade-in slide-in-from-left-2 duration-300">
                        <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                           <Plus className="w-3 h-3" /> Ajouter un service
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
                                <input onChange={handleFormChange} type="text" className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] outline-none transition-all text-sm" placeholder="Ex: Vidange, Consultation..." />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de Tarification</label>
                                <select 
                                value={newServiceType}
                                onChange={(e) => { setNewServiceType(e.target.value as PricingType); handleFormChange(); }}
                                className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border bg-white focus:ring-2 focus:ring-[#1E90FF]/20 outline-none text-sm"
                                >
                                <option value={PricingType.FIXED}>Forfait (Prix Fixe)</option>
                                <option value={PricingType.HOURLY}>Taux Horaire</option>
                                <option value={PricingType.QUOTE}>Sur Devis (Artisans)</option>
                                </select>
                            </div>

                            {/* Dynamic Fields based on Type */}
                            {newServiceType === PricingType.FIXED && (
                                <div className="animate-in slide-in-from-left-2 duration-300 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                                    <div className="relative">
                                        <input onChange={handleFormChange} type="number" className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 pl-8 border focus:ring-2 focus:ring-[#1E90FF]/20 outline-none text-sm" placeholder="0.00" />
                                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">€</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                                    <select className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border bg-white focus:ring-2 focus:ring-[#1E90FF]/20 outline-none text-sm">
                                        <option>15 min</option>
                                        <option>30 min</option>
                                        <option>45 min</option>
                                        <option>1 h</option>
                                    </select>
                                </div>
                                </div>
                            )}

                            {newServiceType === PricingType.HOURLY && (
                                <div className="animate-in slide-in-from-left-2 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix par heure (€/h)</label>
                                    <input onChange={handleFormChange} type="number" className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-2 focus:ring-[#1E90FF]/20 outline-none text-sm" placeholder="60.00" />
                                </div>
                                <div className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                                    ℹ️ Le client réservera un créneau estimatif.
                                </div>
                                </div>
                            )}

                            {newServiceType === PricingType.QUOTE && (
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 animate-in slide-in-from-left-2 duration-300">
                                    <p className="text-sm text-orange-800 font-medium">Mode "Sur Devis"</p>
                                    <p className="text-xs text-orange-600 mt-1">Prix masqué. Créneau de visite technique uniquement.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button className="bg-[#1E90FF] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 active:scale-95">
                                <CheckCircle className="w-4 h-4" />
                                Enregistrer
                            </button>
                        </div>
                    </div>
                 )}

                 {/* TEAM CONFIGURATION */}
                 {configSubTab === 'TEAM' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                         {/* Add Staff Form */}
                         <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                             <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <UserPlus className="w-3 h-3" /> Ajouter un collaborateur
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                    <input 
                                        type="text" 
                                        value={newStaffName}
                                        onChange={(e) => setNewStaffName(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] outline-none" 
                                        placeholder="Ex: Thomas" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="email" 
                                            value={newStaffEmail}
                                            onChange={(e) => setNewStaffEmail(e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 pl-9 border text-sm focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] outline-none" 
                                            placeholder="thomas@exemple.com" 
                                        />
                                    </div>
                                </div>

                                {/* Job Title / Métier */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Métier / Spécialité</label>
                                    <input 
                                        type="text" 
                                        value={newStaffJob}
                                        onChange={(e) => setNewStaffJob(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] outline-none" 
                                        placeholder="Ex: Coiffeur, Mécanicien..." 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle (Permissions)</label>
                                    <select 
                                        value={newStaffRole}
                                        onChange={(e) => setNewStaffRole(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border bg-white text-sm"
                                    >
                                        <option>Employé (Accès standard)</option>
                                        <option>Manager (Accès total)</option>
                                        <option>Apprenti (Lecture seule)</option>
                                    </select>
                                </div>
                                <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-2">Couleur d'agenda</label>
                                     <div className="flex gap-3">
                                         {['blue', 'green', 'purple', 'amber', 'red'].map(c => {
                                             const bg = `bg-${c}-500`;
                                             return (
                                                <button 
                                                    key={c} 
                                                    onClick={() => setNewStaffColor(c)}
                                                    className={`w-9 h-9 rounded-full ${bg} border-2 border-white shadow-sm ring-1 ring-gray-200 hover:scale-110 transition-transform ${newStaffColor === c ? 'ring-2 ring-gray-400 scale-110' : ''}`}
                                                ></button>
                                             );
                                         })}
                                     </div>
                                </div>
                             </div>
                             <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={handleAddStaff}
                                    className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-black transition-colors shadow-lg shadow-gray-900/20 active:scale-95"
                                >
                                    <UserPlus className="w-4 h-4" /> Ajouter ce collaborateur
                                </button>
                             </div>
                         </div>

                         {/* Staff List */}
                         <div>
                             <h3 className="text-sm font-bold text-gray-900 mb-3">Membres de l'équipe ({staffMembers.length - 1})</h3>
                             <div className="space-y-3">
                                 {staffMembers.filter(s => s.id !== 'all').map(staff => (
                                     <div key={staff.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                                         <div className="flex items-center gap-3">
                                             <img src={staff.avatar!} alt="" className="w-10 h-10 rounded-full border border-gray-100" />
                                             <div>
                                                 <div className="font-bold text-sm text-gray-900">{staff.name}</div>
                                                 <div className="text-xs text-gray-500">{(staff as any).role || 'Employé'}</div>
                                             </div>
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <div className={`w-3 h-3 rounded-full ${staff.color.split(' ')[0].replace('100', '400')}`}></div>
                                             <button 
                                                onClick={() => handleDeleteStaff(staff.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                             >
                                                 <Trash2 className="w-4 h-4" />
                                             </button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>
                 )}
             </div>

             <div className="mt-8 pt-8 border-t border-gray-100">
                 <button className="flex items-center gap-2 text-red-500 font-medium text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-colors w-full">
                    <LogOut className="w-4 h-4" /> Fermer la session Pro
                 </button>
             </div>
          </div>
        )}
      </div>

      {/* PRO BOTTOM NAVIGATION */}
      <nav className="flex-none bg-white border-t border-gray-200 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="flex justify-around items-end h-20 pb-3 max-w-lg mx-auto">
              <NavButton 
                 active={activeTab === 'AGENDA'} 
                 onClick={() => setActiveTab('AGENDA')} 
                 icon={Calendar} 
                 label="Agenda" 
              />
              <NavButton 
                 active={activeTab === 'CLIENTS'} 
                 onClick={() => setActiveTab('CLIENTS')} 
                 icon={Users} 
                 label="Clients" 
              />
              
              {/* Central Scanner Button */}
              <button 
                onClick={() => setShowScanner(true)}
                className="relative -top-6 bg-[#1E90FF] text-white p-4 rounded-2xl shadow-xl shadow-blue-500/40 border-4 border-gray-50 transform transition-transform hover:scale-105 active:scale-95 group z-50 flex flex-col items-center justify-center"
              >
                 <QrCode className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
              </button>
              
              <NavButton 
                 active={activeTab === 'STATS'} 
                 onClick={() => setActiveTab('STATS')} 
                 icon={BarChart3} 
                 label="Stats" 
              />
              <NavButton 
                 active={activeTab === 'SERVICES'} 
                 onClick={() => setActiveTab('SERVICES')} 
                 icon={Briefcase} 
                 label="Services" 
              />
           </div>
        </nav>
    </div>
  );
};

// Helper Component for Nav Button
const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center gap-1.5 w-16 mb-2 transition-colors ${active ? 'text-[#1E90FF]' : 'text-gray-400 hover:text-gray-600'}`}
    >
       <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 2.5 : 2} />
       <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </button>
);