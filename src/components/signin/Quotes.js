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
      {
        text: "You’re definitely a 44 because I’m the 1 you need",
        source: "Andrinhaa",
        link: "https://www.reddit.com/r/IBO/comments/10tk37o/comment/j77sest",
      },
      {
        text: "Are you practicing your Individual Oral? Because you can practice it on me ;)",
        source: "[deleted]",
        link: "https://www.reddit.com/r/IBO/comments/10tk37o/comment/j77tv1m",
      },
      {
        text: "10? you’re definitely a 45",
        source: "MacaroonTop2612",
        link: "https://www.reddit.com/r/IBO/comments/10tk37o/comment/j77o75p",
      },
      {
        text: "i’m done revising graphs, lemme study your curves instead",
        source: "bkat_112",
        link: "https://www.reddit.com/r/IBO/comments/10tk37o/comment/j7a6nqi",
      },
      {
        text: "Your 23 and my 22 were not good enough but together we add up to perfection",
        source: "Icy-Yoghurt-3347",
        link: "https://www.reddit.com/r/IBO/comments/10tk37o/comment/j79wasa",
      },
      {
        text: "choosing the right topic for an IA is hard, but you know what’s harder?",
        source: "East_Company_7185",
        link: "https://www.reddit.com/r/IBO/comments/10tk37o/comment/j7h47u8",
      },
      {
        text: "can’t spell ibuprofen without ib",
        source: "SquillTheSquid9",
        link: "https://www.reddit.com/r/IBO/comments/yf9zvq/comment/iu7c6mo",
      },
      {
        text: "One blind leads the other.",
        source: "Ramya ma'am",
        link: "",
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
