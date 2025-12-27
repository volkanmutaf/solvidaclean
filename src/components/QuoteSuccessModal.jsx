import React from "react";
import { createPortal } from "react-dom";
import { CheckCircle, Clock, Star, Shield } from "lucide-react";

export default function QuoteSuccessModal({ isOpen, onClose, quoteNumber }) {
  React.useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ zIndex: 999999 }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 100000 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-2xl p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Quote Submitted Successfully!
          </h2>
          <div className="bg-white/20 rounded-lg p-3 mt-3 border border-white/30">
            <p className="text-white/90 text-sm mb-1">Quote Number:</p>
            <p className="text-white font-bold text-lg tracking-wider">
              #{quoteNumber}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* 2 Hour Guarantee */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  2-Hour Response Guarantee
                </h3>
                <p className="text-blue-700 text-sm">
                  We guarantee to respond to your quote request within 2 hours during business hours.
                </p>
              </div>
            </div>

            {/* What happens next */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-lg">
                What happens next?
              </h3>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">1</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Our team will review your requirements and prepare a detailed quote
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <p className="text-gray-700 text-sm">
                  You'll receive a personalized quote via email within 2 hours
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-xs font-bold">3</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Schedule your cleaning service at your convenience
                </p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">100% Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
