import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import './ImageEditor.css';

interface ImageEditorProps {}

const ImageEditor: React.FC<ImageEditorProps> = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [textPosition, setTextPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) {
          setImageSrc(e.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Handle text drag within padding area
  const handleTextDrag = (e: DraggableEvent, data: DraggableData) => {
    const newPosition = { x: data.x, y: data.y };
    setTextPosition(newPosition);
  };
  

// Handle export
const handleExport = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        const img = new Image();
        img.src = imageSrc;
  
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
  
          ctx.drawImage(img, 0, 0);
  
          ctx.font = '24px Arial'; // Set the font size and style
          ctx.fillStyle = 'white'; // Set text color
          ctx.fillText(text, textPosition.x, textPosition.y);
  
          // You can add more text or drawings as needed
  
          // To export the image, you can convert the canvas to a data URL
          const exportedImageURL = canvas.toDataURL('image/jpeg'); // Change format as needed
          // Now, you can use `exportedImageURL` as the image source or save it as needed.
  
          // For example, open the image in a new window:
          const newWindow = window.open();
          newWindow?.document.write(`<img src="${exportedImageURL}" alt="Exported Image" />`);
        };
      }
    }
  };

  return (
    <div className="image-editor">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleExport}>Export</button>
      {imageSrc && (
        <div className="editor-container">
          <img src={imageSrc} alt="Uploaded" />
          <Draggable
            defaultPosition={textPosition}
            onDrag={handleTextDrag}
          >
            <div className="text-overlay">
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Add Text Here"
              />
            </div>
          </Draggable>
          <canvas ref={canvasRef} className="canvas"></canvas>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
