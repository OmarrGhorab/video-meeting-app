import React from 'react';
import { useParticipantViewContext } from '@stream-io/video-react-sdk';
import { generateGradient } from './generateGradient';

const CustomVideoPlaceholder = () => {
  const { participant } = useParticipantViewContext();
  const name = participant.name || 'Anonymous';
  const userId = participant.userId || 'default';
  const image = participant.image;  
  const gradient = generateGradient(userId); 

  return (
    <div
      className="w-full h-full flex items-center justify-center text-white font-semibold text-xl"
      style={{
        background: gradient,
        borderRadius: '12px',
      }}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-[120px] h-[120px] object-cover rounded-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlaceholder;