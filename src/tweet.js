import "./tweet.css";

/**
 * @typedef {{userName: string, userHandle: string}} TweetUserData
 * @typedef {{userData: TweetUserData, tweetText: string}} TweetData
 */

/**
 * @param {TweetData} tweetData
 * @returns {HTMLDivElement}
 */
const makeTweetElement = tweetData => {
  const tweetBodyEl = makeTweetBody(tweetData.userData, tweetData.tweetText);
  const tweetContainerEl = document.createElement("li");
  tweetContainerEl.classList.add("tweet-container");
  tweetContainerEl.appendChild(tweetBodyEl);

  return tweetContainerEl;
};

/**
 * @param {userData}
 * @param {string} bodyText
 */
const makeTweetBody = ({ userName, userHandle }, bodyText) => {
  const tweetBodyEl = document.createElement("div");
  tweetBodyEl.classList.add("tweet-body");

  tweetBodyEl.innerHTML = `
    <div class="tweet-body-header">
      <b>${userName}</b>: <i>@${userHandle}</i>
    </div>
    ${bodyText}
  `;

  return tweetBodyEl;
};

const makeTweetComposeButton = () => {
  const fragment = document.createDocumentFragment();
  const tweetComposeButton = document.createElement("button");
  tweetComposeButton.innerText = "Tweet";
  tweetComposeButton.classList.add("tweet-compose-button");

  fragment.appendChild(tweetComposeButton);
  return fragment;
};

export { makeTweetElement, makeTweetComposeButton };
