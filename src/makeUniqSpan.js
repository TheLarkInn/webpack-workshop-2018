import {uniq} from "lodash-es";

export default (spanText) => {
    const spanEl = document.createElement("span");
    const uniqSpanText = uniq(spanText.split("")).join("");
    spanEl.innerText = uniqSpanText;
    
    return spanEl;
}