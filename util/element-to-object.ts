const unique = require("unique-selector");
import { truncate } from "./string";

const elementToObject = (element: Element) => {
  if (!element.parentNode) return;
  try {
    const selector = unique(element);
    const innerHTML = truncate(element.innerHTML, 99);
    const textContent = truncate(element.textContent || "", 99);
    const tagName = element.tagName;
    if (!selector) return;
    return {
      selector,
      tagName,
      textContent,
      innerHTML,
    };
  } catch (error) {
    return;
  }
};

export { elementToObject };
