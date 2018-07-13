import "./compose.css";

/** @typedef {import("./tweet").TweetData} TweetData */

/**
 *
 * @param {TweetData} existingTweetData
 * @param {Element} attachToElement
 */
const makeCompose = (existingTweetData, attachToElement, callback) => {
  const frag = document.createDocumentFragment();
  const tweetComposeEl = document.createElement("div");
  tweetComposeEl.classList.add("tweet-compose");

  tweetComposeEl.innerHTML = `
    <form>
        <input class="tweet-compose-input" type="text" value="">
        <button type="submit" onclick="event.preventDefault()" class="tweet-compose-submit">Tweet it now!</button>
    </form>
  `;

  frag.appendChild(tweetComposeEl);
  attachToElement.appendChild(frag);

  document.querySelector(".tweet-compose-submit").addEventListener("click", submitTweet);
  document.querySelector(".tweet-compose-submit").addEventListener("submit", submitTweet);

  function submitTweet() {
    const tweetText = document.querySelector(".tweet-compose-input").value;

    const newTweetData = {
      userData: {
        userHandle: "OriginalJohnHenry",
        userName: "John Henry Plumbing"
      },
      tweetText
    };

    attachToElement.removeChild(tweetComposeEl);

    callback(newTweetData);
  }
};

export default makeCompose;
