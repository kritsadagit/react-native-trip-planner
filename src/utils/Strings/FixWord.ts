export const removeNewLine = (text: string | number | undefined) => {
  if (text) {
    text = text.toString();
    return text.replace(/\n/g, "");
  }
};

export const capitalizeFirstLetter = (text: string | undefined) => {
  if (!text) {
    return text; // Return the original sentence if it's empty or undefined
  }

  // Capitalize the first letter and concatenate the rest of the sentence
  return text.charAt(0).toUpperCase() + text.slice(1);
};
