import React, { useState, useEffect } from 'react';
import { X, Home, Utensils, Bath, Bed, Sofa } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FloorPlan = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const updatedRooms = [
      {
        id: 'living-room',
        name: t('floorPlan.rooms.livingRoom'),
        icon: <Sofa className="w-6 h-6" />,
        image: '/images/livingareas.jpg',
        description: t('floorPlan.roomDescriptions.livingRoom'),
        services: t('floorPlan.services.livingRoom', { returnObjects: true }),
        area: t('floorPlan.roomAreas.livingRoom'),
        position: { top: '25%', left: '15%' },
        size: { width: '220px', height: '160px' }
      },
      {
        id: 'kitchen',
        name: t('floorPlan.rooms.kitchen'),
        icon: <Utensils className="w-6 h-6" />,
        image: '/images/kitchen.jpg',
        description: t('floorPlan.roomDescriptions.kitchen'),
        services: t('floorPlan.services.kitchen', { returnObjects: true }),
        area: t('floorPlan.roomAreas.kitchen'),
        position: { top: '15%', left: '35%' },
        size: { width: '200px', height: '140px' }
      },
      {
        id: 'bathroom',
        name: t('floorPlan.rooms.bathroom'),
        icon: <Bath className="w-6 h-6" />,
        image: '/images/bathroom.jpg',
        description: t('floorPlan.roomDescriptions.bathroom'),
        services: t('floorPlan.services.bathroom', { returnObjects: true }),
        area: t('floorPlan.roomAreas.bathroom'),
        position: { top: '50%', left: '40%' },
        size: { width: '130px', height: '110px' }
      },
      {
        id: 'bedroom-1',
        name: t('floorPlan.rooms.masterBedroom'),
        icon: <Bed className="w-6 h-6" />,
        image: '/images/master_bedroom.jpg',
        description: t('floorPlan.roomDescriptions.masterBedroom'),
        services: t('floorPlan.services.masterBedroom', { returnObjects: true }),
        area: t('floorPlan.roomAreas.masterBedroom'),
        position: { top: '25%', left: '65%' },
        size: { width: '170px', height: '150px' }
      },
      {
        id: 'bedroom-2',
        name: t('floorPlan.rooms.secondBedroom'),
        icon: <Bed className="w-6 h-6" />,
        image: '/images/bedroom.jpg',
        description: t('floorPlan.roomDescriptions.secondBedroom'),
        services: t('floorPlan.services.secondBedroom', { returnObjects: true }),
        area: t('floorPlan.roomAreas.secondBedroom'),
        position: { top: '55%', left: '65%' },
        size: { width: '170px', height: '150px' }
      }
    ];
    setRooms(updatedRooms);
  }, [t]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const closePopup = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Floor Plan Container */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {t('floorPlan.headline')}
        </h3>
        
        {/* Floor Plan Image Container */}
        <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border-2 border-gray-200 overflow-hidden">
          {/* Floor Plan Image */}
          <img 
            src="/images/floorplan.jpg" 
            alt="Apartment Floor Plan"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          
          {/* Fallback if image doesn't load */}
          <div className="hidden w-full h-full items-center justify-center text-center text-gray-500">
            <div>
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">{t('floorPlan.title')}</p>
              <p className="text-sm">{t('floorPlan.clickHint')}</p>
            </div>
          </div>

          {/* Interactive Room Areas - Always Visible Labels */}
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className="absolute group cursor-pointer transition-all duration-300 z-10"
              style={{
                top: room.position.top,
                left: room.position.left,
                width: room.size.width,
                height: room.size.height
              }}
            >
                             {/* Always visible room label */}
               <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                 <div className="text-center">
                   <div className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center mx-auto mb-1 shadow-md border border-gray-200 group-hover:bg-emerald-100 group-hover:border-emerald-300 transition-all duration-300">
                     <div className="group-hover:text-emerald-600 transition-colors duration-300">
                       {room.icon}
                     </div>
                   </div>
                   <span className="text-xs font-semibold text-gray-800 bg-white/95 px-2 py-1 rounded-full shadow-sm border border-gray-200 group-hover:bg-emerald-100 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-all duration-300">
                     {room.name}
                   </span>
                 </div>
               </div>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            {t('floorPlan.clickHint')}
          </p>
        </div>
      </div>

             {/* Room Details Popup */}
       {selectedRoom && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden">
             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                   {selectedRoom.icon}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900">{selectedRoom.name}</h3>
                   <p className="text-sm text-gray-500">{selectedRoom.area}</p>
                 </div>
               </div>
               <button
                 onClick={closePopup}
                 className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
               >
                 <X className="w-5 h-5 text-gray-600" />
               </button>
             </div>

             {/* Content - Split Layout */}
             <div className="flex flex-col lg:flex-row h-[calc(85vh-120px)]">
                               {/* Left Side - Room Image */}
                <div className="lg:w-1/2 p-6 flex items-center">
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={selectedRoom.image} 
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback if image doesn't load */}
                    <div className="hidden w-full h-full bg-gradient-to-br from-blue-50 to-emerald-50 items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                          {selectedRoom.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedRoom.name}</h4>
                        <p className="text-gray-600">{selectedRoom.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                               {/* Right Side - Services List */}
                <div className="lg:w-1/2 p-6 flex flex-col">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">{t('floorPlan.services.title')}</h4>
                  <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto pr-2">
                    {selectedRoom.services.map((service, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm leading-relaxed">{service}</span>
                      </div>
                    ))}
                  </div>

                                     {/* CTA Button */}
                   <button 
                     onClick={() => window.location.href = '/quote#quote-form'}
                     className="w-full mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                   >
                     {t('floorPlan.getQuoteButton')}
                   </button>
                </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default FloorPlan;
