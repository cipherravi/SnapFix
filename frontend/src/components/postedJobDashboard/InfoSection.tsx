import { useState } from "react";
import MapDisplay from "../../components/map/MapDisplay";
import { formatTime } from "../../utils/formatTime";

interface InfoSectionProps {
  budget: number;
  createdAt: string;
  description: string;
  status: string;
  title: string;
  workerId: number;
  address: string;
  lat: string;
  lng: string;
  worker: {
    name: string;
    gender: string;
    profilePicUrl: string;
  };
}

const InfoSection = ({
  title,
  budget,
  address,
  status,
  description,
  workerId,
  lat,
  lng,
  createdAt,
  worker,
}: InfoSectionProps) => {
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Title + Apply */}
      <div className="flex justify-between items-start gap-4">
        <h1
          className={`text-2xl poppins-semibold flex-1 cursor-pointer ${
            isTitleExpanded ? "whitespace-normal" : "truncate"
          }`}
          onClick={() => setIsTitleExpanded((prev) => !prev)}
          title="Click to expand/collapse"
        >
          {title}
        </h1>
      </div>

      {/* Budget & Date */}
      <div className="flex justify-between gap-2 text-gray-700 text-[16px]">
        <div>
          <p>
            <strong>Budget:</strong> ₹{budget}
          </p>
          <p>
            <strong>Posted:</strong> {formatTime(createdAt)}
          </p>
        </div>
        <div>
          <p>
            <strong>Status:</strong> {status}
          </p>
          {workerId ? (
            <p>
              <strong>Worker:</strong> {worker?.name}
            </p>
          ) : (
            <p>
              <strong>Worker:</strong> not assigned
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div
        className={`text-gray-800 text-sm leading-relaxed cursor-pointer ${
          isDescExpanded ? "max-h-none whitespace-pre-wrap" : "line-clamp-4"
        }`}
        onClick={() => setIsDescExpanded((prev) => !prev)}
        title="Click to expand/collapse"
      >
        {description}
      </div>

      {/* Address */}
      <div className="text-gray-700 text-sm">
        <strong>Address:</strong> {address}
      </div>
      {lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng)) && (
        <>
          <MapDisplay location={[Number(lat), Number(lng)]} />
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            // href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Track on Google Maps
          </a>
        </>
      )}
    </div>
  );
};

export default InfoSection;
