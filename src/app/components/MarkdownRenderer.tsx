import React from 'react';

type PartType = 
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'multiline'; lines: string[] }
  | { type: 'list'; items: (TextPart | ListItemPart)[] };

type TextPart = { type: 'text'; content: string };
type ListItemPart = { type: 'listItem'; number: string; content: string };

// Fonction pour convertir le Markdown en JSX
const MarkdownRenderer = ({ text }: { text: string }) => {
  if (!text) return null;

  // Convertir les éléments en gras
  const boldRegex = /\*\*(.*?)\*\*/g;
  let parts: PartType[] = [];
  let lastIndex = 0;
  let match;

  // Traiter le texte pour les éléments en gras
  while ((match = boldRegex.exec(text)) !== null) {
    // Ajouter le texte avant le match
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }

    // Ajouter le texte en gras
    parts.push({
      type: 'bold',
      content: match[1]
    });

    lastIndex = match.index + match[0].length;
  }

  // Ajouter le reste du texte
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }

  // Traiter les listes numérotées (comme dans l'exemple donné)
  const processListItems = (part: PartType): PartType => {
    if (part.type !== 'text') return part;

    // Utiliser regex mode d compatible avec TS
    const listItemRegex = /^(\d+)\.\s+(.*?)(?=\n\d+\.|$)/gm;
    const content = part.content;
    
    if (!listItemRegex.test(content)) return part;
    
    // Réinitialiser le regex
    listItemRegex.lastIndex = 0;
    
    const listItems: (TextPart | ListItemPart)[] = [];
    let listMatch;
    let listLastIndex = 0;
    
    while ((listMatch = listItemRegex.exec(content)) !== null) {
      // Ajouter le texte avant la liste si nécessaire
      if (listMatch.index > listLastIndex) {
        listItems.push({
          type: 'text',
          content: content.substring(listLastIndex, listMatch.index)
        });
      }
      
      // Ajouter l'élément de liste
      listItems.push({
        type: 'listItem',
        number: listMatch[1],
        content: listMatch[2]
      });
      
      listLastIndex = listMatch.index + listMatch[0].length;
    }
    
    // Ajouter le reste du texte
    if (listLastIndex < content.length) {
      listItems.push({
        type: 'text',
        content: content.substring(listLastIndex)
      });
    }
    
    return {
      type: 'list',
      items: listItems
    };
  };

  // Traiter les sauts de ligne
  const processLineBreaks = (parts: PartType[]): PartType[] => {
    return parts.map(part => {
      if (part.type === 'text') {
        // Pour les parties de type 'text', remplacer les sauts de ligne par des éléments <br />
        const lines = part.content.split('\n');
        if (lines.length === 1) return part;
        
        return {
          type: 'multiline',
          lines
        };
      }
      return part;
    });
  };

  // Appliquer les traitements
  parts = parts.map(processListItems);
  parts = processLineBreaks(parts);

  // Rendu final avec tous les éléments
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === 'bold') {
          return <strong key={index} className="font-bold">{part.content}</strong>;
        } else if (part.type === 'multiline') {
          return (
            <span key={index}>
              {part.lines.map((line: string, lineIndex: number) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < part.lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          );
        } else if (part.type === 'list') {
          return (
            <div key={index} className="mt-1">
              {part.items.map((item: any, itemIndex: number) => {
                if (item.type === 'text') {
                  return <span key={itemIndex}>{item.content}</span>;
                } else if (item.type === 'listItem') {
                  return (
                    <div key={itemIndex} className="ml-4 mb-1 flex">
                      <span className="mr-2 font-medium">{item.number}.</span>
                      <span>{item.content}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default MarkdownRenderer;
