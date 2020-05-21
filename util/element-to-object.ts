// @ts-ignore
import unique from "unique-selector";
import { truncate } from "./string";

const elementToObject = (element: Element) => {
  if (!element.parentNode) return;
  try {
    const selector = unique(element);
    const textContent = truncate(element.textContent || "", 99);
    const tagName = element.tagName;
    if (!selector) return;
    return {
      selector,
      tagName,
      textContent,
    };
  } catch (error) {
    console.log(error);
    return;
  }
};

export { elementToObject };
