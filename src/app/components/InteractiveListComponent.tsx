import React, { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ListItem {
  id: string;
  title: string;
  description?: string;
}

interface InteractiveListProps {
  messageId: string;
  contentIndex: number;
  text?: string;
  listItems: ListItem[];
  selector: "unique" | "multiple";
  onConfirm: (
    messageId: string,
    contentIndex: number,
    selectedItems: ListItem[]
  ) => void;
  isLoading?: boolean;
}

const InteractiveListComponent = ({
  messageId,
  contentIndex,
  text,
  listItems,
  selector,
  onConfirm,
  isLoading = false,
}: InteractiveListProps) => {
  // Pour une sélection unique, on stocke l'id de l'élément sélectionné
  // Pour une sélection multiple, on stocke un tableau d'ids
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);

  const handleItemClick = (item: ListItem) => {
    if (isLoading) return; // Prevent interaction when loading

    if (selector === "unique") {
      // Pour sélection unique, on remplace l'élément sélectionné
      setSelectedItems([item]);
    } else {
      // Pour sélection multiple, on bascule l'élément dans la sélection
      const isSelected = selectedItems.some(
        (selected) => selected.id === item.id
      );

      if (isSelected) {
        setSelectedItems(
          selectedItems.filter((selected) => selected.id !== item.id)
        );
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const handleConfirm = () => {
    if (isLoading) return; // Prevent interaction when loading

    if (selectedItems.length > 0) {
      onConfirm(messageId, contentIndex, selectedItems);
    }
  };

  const isItemSelected = (item: ListItem) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

  return (
    <div className={`relative my-2 p-3 bg-black/20 rounded-lg overflow-hidden ${isLoading ? 'opacity-70' : ''}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}

      {/* Afficher le texte explicatif formaté en markdown */}
      {text && (
        <div className="mb-3 text-gray-100">
          <MarkdownRenderer text={text} />
        </div>
      )}

      <div className="divide-y divide-gray-700/50">
        {listItems.map((item) => (
          <div
            key={item.id}
            className={`py-3 px-2 transition-colors ${!isLoading ? 'hover:bg-black/20 cursor-pointer' : ''} ${isItemSelected(item) ? "bg-gray-700/30" : ""}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center gap-3">
              {/* Élément de sélection (radio ou checkbox) */}
              <div className="flex-shrink-0">
                {selector === "unique" ? (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isItemSelected(item)
                      ? "border-red-500 bg-red-500/20"
                      : "border-gray-500"
                      }`}
                  >
                    {isItemSelected(item) && (
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${isItemSelected(item)
                      ? "border-red-500 bg-red-500/20"
                      : "border-gray-500"
                      }`}
                  >
                    {isItemSelected(item) && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {/* Contenu de l'élément */}
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-gray-400 mt-1">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton de confirmation */}
      {selectedItems.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
              }`}
          >
            {selector === "unique"
              ? "Confirmer la sélection"
              : `Confirmer la sélection (${selectedItems.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveListComponent;
