import React, { useState, useEffect } from "react";

const Quotes = () => {
  const quotes = React.useMemo(
    () => [
      {
        text: "To what extent did I benefit from this?",
        source: "Steff_5",
        link: "https://www.reddit.com/r/IBO/comments/nv3bjg/comment/h111umv",
      },
      {
        text: "I hope this counts for cas.",
        source: "Highborn0298",
        link: "https://www.reddit.com/r/IBO/comments/nv3bjg/comment/h11gldh",
      },
      {
        text: "You went to high school, I went to school high.",
        source: "[deleted]",
        link: "https://www.reddit.com/r/IBO/comments/nv3bjg/comment/h11c6ww",
      },
      {
        text: "Call me when I can leave the meet cause I’m going to bed.",
        source: "Sphinxy04",
        link: "https://www.reddit.com/r/IBO/comments/nv3bjg/comment/h121edl",
      },
      {
        text: "I can now say I have something in common with Ke$ha, Justin Trudeau and Kim Jong-Un.",
        source: "GirlOnFire07",
        link: "https://www.reddit.com/r/IBO/comments/nv3bjg/comment/h1402g7",
      },
      {
        text: "Roses are red, violets are blue, do good explanations have to be true? (M19 TOK Essay Prompt)",
        source: "Velocifized",
        link: "https://www.reddit.com/r/IBO/comments/nv3bjg",
      },
      {
        text: "does writing this quote count as cas?",
        source: "indiewreck",
        link: "https://www.reddit.com/r/IBO/comments/nv3bjg/comment/h13ik7l",
      },
      {
        text: "extended essay, shortened life.",
        source: "sssniper-wolff",
        link: "https://www.reddit.com/r/IBO/comments/11yxti9/help_me_with_my_ib_yearbook_quote",
      },
      {
        text: "I used to like the IB, but now I prefer consensual.",
        source: "axolotlrye",
        link: "https://www.reddit.com/r/IBO/comments/11yxti9/comment/jdbovwt",
      },
      {
        text: "Still don't know how to spell International Baccalluareate.",
        source: "[deleted]",
        link: "https://www.reddit.com/r/IBO/comments/11yxti9/comment/jdc8bn4",
      },
    ],
    []
  );

  const [quote, setQuote] = useState({});

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, [quotes]);

  return (
    <div className="quote-container">
      <div className="quote-box">
        <div className="quote-line"></div>
        <div className="quote-text">
          <p>"{quote.text}"</p>
          <p className="quote-source">
            —{" "}
            <a href={quote.link} target="_blank" rel="noopener noreferrer">
              {quote.source}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
