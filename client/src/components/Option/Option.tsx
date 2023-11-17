// This component renders a voting option

/* REQUIRED PROPS:
opt: an object with all properties of this option (movie info, id, number of votes...)
voted: a string (or undefined) indicating if the user voted on this poll
votes: a number (or undefined) indicating the number of votes on this option
loggedIn: a boolean indicating if the user is logged in
selected: an object with all the information needed for a vote on this option:
  -- userName: the username of the current user
  -- movie: the movie represented by this option
  -- poll_id: the _id of the current poll
  -- option_id: the _id of this option
  -- imdb_id: this option's movie's IMDb id
  -- comment: the value of any added comment by the user
select: a callback setting the poll's state indicating the selected option
comment: a callback setting the value of the comment text area
handleVote: a callback for the casting of a vote for this option
  (this will be used only if the UI addes the voting action directly to the options) */

import "./Option.css";
import Accordion from "react-bootstrap/Accordion";
import { useState, useRef } from "react";
import { optionProps } from "../../utils/interfaces";

interface voteProps {
  userName: string;
  movie: string;
  poll_id: string;
  option_id: string;
  imdb_id: string;
  comment: string;
}

interface optProps {
  winner: boolean;
  opt: optionProps;
  voted: string | undefined;
  votes: number | undefined;
  expired: boolean | null;
  loggedIn: boolean;
  selected: voteProps;
  select: (e: React.SetStateAction<voteProps>) => void;
  comment: (e: React.SetStateAction<string>) => void;
  handleVote: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Option({
  winner,
  opt,
  voted,
  votes,
  loggedIn,
  expired,
  selected,
  select,
  comment,
}: optProps) {
  const [details, setDetails] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const handleSelect = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    // const { tagName } = e.target as HTMLElement;
    const { className } = e.currentTarget as HTMLElement;
    const voteObj = {
      ...selected,
      movie: opt.movie,
      option_id: className.indexOf("sel") === -1 ? opt._id : "",
      imdb_id: opt.imdb_id,
    };
    select(voteObj);
    comment("");
  };

  const handleShowHide = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (infoRef.current !== null) {
      console.log(infoRef.current);
      setDetails(!details);
      const closed = infoRef.current.style.maxHeight === "0px";
      infoRef.current.style.maxHeight = closed ? "220px" : "0";
    }
  };

  return (
    <div
      className={`container option${
        selected.option_id === opt._id ? " selected" : ""
      }${!loggedIn || voted ? " nohover" : ""}`}
    >
      <div className="row container">
        <div className="title row col">
          <h3 className="col title-text">
            {opt.movie} <span className="year">({opt.year})</span>
          </h3>
          <a
            href={window.location.toString()}
            className="col show-hide"
            onClick={handleShowHide}
          >
            {details ? "hide details" : "show details"}
          </a>
          <div className="optinfo" ref={infoRef} style={{ maxHeight: "0px" }}>
            <img src={opt.image} alt={opt.movie} />
            <div>
              <strong className="stars">{opt.stars}</strong>
              {opt.plot}
              <div className="info-links">
                <a
                  href={`https://www.imdb.com/title/${opt.imdb_id}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  IMDb
                </a>
                <a href={opt.wikipedia} target="_blank" rel="noreferrer">
                  Wikipedia
                </a>
                <a href={opt.trailer} target="_blank" rel="noreferrer">
                  Trailer
                </a>
              </div>
            </div>
          </div>
        </div>
        {loggedIn ? (
          // user is logged in: show a vote button or the vote total
          voted || expired ? (
            // user has voted or the poll is expired: show the vote total for this option
            <div className={`tab col${expired && winner ? " winner" : ""}`}>
              {votes}
            </div>
          ) : (
            // user has not voted: indicate to select
            <button
              className={`btn col${
                selected.option_id === opt._id ? " sel" : ""
              }`}
              onClick={handleSelect}
            >
              select
            </button>
          )
        ) : (
          // user is not logged in, show neither vote total nor button
          <div></div>
        )}
      </div>
    </div>
  );
}
