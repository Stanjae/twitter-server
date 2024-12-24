// utils/nlp.js
const stopwords = ['the', 'is', 'and', 'a', 'to', 'in', 'of', 'for', 'on', 'with', 'at']; // Extend this list

// Extract hashtags
export const extractHashtags = (text) => {
  const regex = /#[\w]+/g;
  return text.match(regex) || [];
};

// Extract phrases (simple tokenization + stopword removal)
export const extractPhrases = (text) => {
  const words = text.split(/\s+/).map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return words.filter((word) => !stopwords.includes(word) && word.length > 2); // Filter short/stopwords
};


