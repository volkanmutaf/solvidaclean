// src/components/ServiceCard.jsx (or wherever your ServiceCard component is)

export default function ServiceCard({ title, description, image, icon, additionalCharge }) {
  return (
    <div className="group rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 h-full flex flex-col hover:shadow-2xl hover:shadow-primary/20 cursor-pointer">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover transition-all duration-300 group-hover:brightness-110"
        loading="lazy"
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-2">
          {icon && <span className="text-2xl mr-2 group-hover:scale-110 transition-transform duration-300">{icon}</span>}
          <h3 className="text-xl font-semibold text-primary group-hover:text-highlight transition-colors duration-300">{title}</h3>
        </div>
        <p className="text-gray-700 text-sm flex-1 group-hover:text-gray-800 transition-colors duration-300">{description}</p>
        {additionalCharge && (
          <div className="mt-2 pt-2 border-t border-yellow-200">
            <p className="text-xs text-yellow-700 font-semibold">💰 Additional charges apply</p>
          </div>
        )}
      </div>
    </div>
  );
}