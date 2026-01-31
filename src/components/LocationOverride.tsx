'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { MapPin, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LocationOverride() {
  const { userContext, setUserContext } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState({
    city: '',
    region: '',
    country: '',
  });

  const handleEdit = () => {
    if (userContext) {
      setEditedLocation({
        city: userContext.location.city,
        region: userContext.location.region,
        country: userContext.location.country,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!userContext) return;

    const newLocation = {
      ...userContext.location,
      city: editedLocation.city,
      region: editedLocation.region,
      country: editedLocation.country,
      isOverridden: true,
    };

    // Update local state
    setUserContext({
      ...userContext,
      location: newLocation,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!userContext) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
      userContext.location.isOverridden 
        ? "bg-amber-50 text-amber-900 border border-amber-200"
        : "bg-gray-50 text-gray-700 border border-gray-200"
    )}>
      <MapPin className="w-4 h-4 flex-shrink-0" />
      
      {!isEditing ? (
        <>
          <span className="flex-1">
            {userContext.location.city}, {userContext.location.region}, {userContext.location.country}
            {userContext.location.isOverridden && (
              <span className="ml-2 text-xs text-amber-600">(Custom)</span>
            )}
          </span>
          <button
            onClick={handleEdit}
            className="p-1 hover:bg-white rounded transition-colors"
            title="Edit location"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editedLocation.city}
            onChange={(e) => setEditedLocation({ ...editedLocation, city: e.target.value })}
            placeholder="City"
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            value={editedLocation.region}
            onChange={(e) => setEditedLocation({ ...editedLocation, region: e.target.value })}
            placeholder="Region"
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            value={editedLocation.country}
            onChange={(e) => setEditedLocation({ ...editedLocation, country: e.target.value })}
            placeholder="Country"
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleSave}
            className="p-1 hover:bg-green-100 text-green-600 rounded transition-colors"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
