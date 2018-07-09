const reverseArray = array => array.reverse();
const reverseString = string => {
  return string
    .split("")
    .reverse()
    .join("");
};

export { reverseString, reverseArray };
