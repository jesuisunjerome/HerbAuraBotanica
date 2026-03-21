import { Link } from "react-router";

// Helper component to render text with special formatting
export const RichText = ({ paragraph }) => {
  const { text, highlights } = paragraph;

  // Parse text and replace markers with formatted elements
  let processedText = text;
  const elements = [];
  let lastIndex = 0;
  let key = 0;

  // Helper function to build marker based on type
  const buildMarker = (highlight) => {
    switch (highlight.type) {
      case "email":
        return `{email:${highlight.email}:${highlight.text}}`;
      case "phone":
        return `{phone:${highlight.phone}:${highlight.text}}`;
      case "link":
        return `{link:${highlight.href}:${highlight.text}}`;
      default:
        return `{${highlight.type}:${highlight.text}}`;
    }
  };

  // Sort highlights by their position in the text using the correct marker format
  const sortedHighlights = [...highlights].sort((a, b) => {
    const aMarker = buildMarker(a);
    const bMarker = buildMarker(b);
    const aPos = text.indexOf(aMarker);
    const bPos = text.indexOf(bMarker);
    return aPos - bPos;
  });

  sortedHighlights.forEach((highlight) => {
    const marker = buildMarker(highlight);
    const markerIndex = processedText.indexOf(marker, lastIndex);

    if (markerIndex !== -1) {
      // Add text before the marker
      if (markerIndex > lastIndex) {
        elements.push(
          <span key={`text-${key++}`}>
            {processedText.substring(lastIndex, markerIndex)}
          </span>,
        );
      }

      // Add formatted element based on type
      switch (highlight.type) {
        case "keyword":
          elements.push(
            <span key={`keyword-${key++}`} className="font-semibold">
              {highlight.text}
            </span>,
          );
          break;
        case "email":
          elements.push(
            <a
              key={`email-${key++}`}
              href={`mailto:${highlight.email}`}
              className="text-amber-600 hover:text-amber-700 underline font-medium"
            >
              {highlight.text}
            </a>,
          );
          break;
        case "phone":
          elements.push(
            <a
              key={`phone-${key++}`}
              href={`tel:${highlight.phone.replace(/\s/g, "")}`}
              className="text-amber-600 hover:text-amber-700 underline font-medium"
            >
              {highlight.text}
            </a>,
          );
          break;
        case "link":
          elements.push(
            <Link
              key={`link-${key++}`}
              to={highlight.href}
              className="text-amber-600 hover:text-amber-700 underline font-medium"
            >
              {highlight.text}
            </Link>,
          );
          break;
        default:
          elements.push(<span key={`default-${key++}`}>{highlight.text}</span>);
      }

      lastIndex = markerIndex + marker.length;
    }
  });

  // Add remaining text
  if (lastIndex < processedText.length) {
    elements.push(
      <span key={`text-${key++}`}>{processedText.substring(lastIndex)}</span>,
    );
  }

  return <>{elements}</>;
};
