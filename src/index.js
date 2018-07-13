import { makeTweetElement, makeTweetComposeButton } from "./tweet";
import makeTweetCompose from "./compose";
import tweetData from "./tweetData";

const tweetList = document.createDocumentFragment();
const tweetListContainer = document.createElement("ul");
const tweetHeader = document.createElement("header");
const tweetButton = makeTweetComposeButton();

tweetButton.childNodes[0].addEventListener("click", () => {
  const tweetcompose = makeTweetCompose(tweetData, document.body, newTweetData => {
    const newElement = makeTweetElement(newTweetData);
    tweetListContainer.appendChild(newElement);
  });
});

tweetHeader.classList.add("tweet-header");
tweetHeader.appendChild(tweetButton);

tweetData.map(makeTweetElement).forEach((tweetEl, idx) => {
  tweetEl.classList.add(`index-${idx}`);
  tweetList.appendChild(tweetEl);
});

tweetListContainer.classList.add("tweet-list-container");
tweetListContainer.appendChild(tweetList);

document.body.appendChild(tweetHeader);
document.body.appendChild(tweetListContainer);
