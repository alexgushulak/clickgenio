import React, { useState } from 'react';

interface TextElementProps {
    text: string;
    position: { x: number; y: number };
    fontSize: string;
    fontColor: string;
    isEditing: boolean;
    onEdit: (newText: string) => void;
    onDelete: () => void;
    onResize: (dx: number, dy: number) => void;
    onDrag: (dx: number, dy: number) => void;
  }
  
  const TextElement: React.FC<TextElementProps> = ({
    text,
    position,
    fontSize,
    fontColor,
    isEditing,
    onEdit,
    onDelete,
    onResize,
    onDrag,
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
  
    const handleDoubleClick = () => {
      if (!isEditing) {
        onEdit(text);
      }
    };
  
    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 0) {
        if (e.shiftKey) {
          setResizing(true);
        } else {
          setIsDragging(true);
        }
      }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
      setResizing(false);
    };
  
    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
        onDrag(e.movementX, e.movementY);
      } else if (resizing) {
        onResize(e.movementX, e.movementY);
      }
    };
  
    return (
      <div
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x,
          fontSize: fontSize,
          color: fontColor,
          userSelect: isEditing ? 'text' : 'none',
          cursor: resizing ? 'nwse-resize' : isEditing ? 'text' : 'grab',
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={(e) => onEdit(e.target.value)}
            onBlur={() => onEdit(text)}
            autoFocus
          />
        ) : (
          text
        )}
        <button onClick={onDelete}>Delete</button>
      </div>
    );
  };

const ImageEditor: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<any>([]);
  const [newText, setNewText] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const addText = () => {
    setTextElements([
        {text: newText,
        position: { x: 10, y: 10 },
        fontSize: '16px',
        fontColor: 'black',
        isEditing: true,}
    ]);
    setNewText('');
  };

  const handleEdit = (index: number, newText: string) => {
    const updatedTextElements = [...textElements];
    updatedTextElements[index].text = newText;
    updatedTextElements[index].isEditing = false;
    setTextElements(updatedTextElements);
  };

  const handleDelete = (index: number) => {
    const updatedTextElements = [...textElements];
    updatedTextElements.splice(index, 1);
    setTextElements(updatedTextElements);
  };

  const handleResize = (index: number, dx: number, dy: number) => {
    const updatedTextElements = [...textElements];
    updatedTextElements[index].fontSize = `${parseInt(updatedTextElements[index].fontSize) + dx}px`;
    setTextElements(updatedTextElements);
  };

  const handleDrag = (index: number, dx: number, dy: number) => {
    const updatedTextElements = [...textElements];
    updatedTextElements[index].position.x += dx;
    updatedTextElements[index].position.y += dy;
    setTextElements(updatedTextElements);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageUrl && (
        <div>
          {/* Render the Canvas component here */}
          <div>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <button onClick={addText}>Add Text</button>
          </div>
          {textElements.map((textElement: any, index: number) => (
            <TextElement
              key={index}
              {...textElement}
              onEdit={(newText) => handleEdit(index, newText)}
              onDelete={() => handleDelete(index)}
              onResize={(dx, dy) => handleResize(index, dx, dy)}
              onDrag={(dx, dy) => handleDrag(index, dx, dy)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
