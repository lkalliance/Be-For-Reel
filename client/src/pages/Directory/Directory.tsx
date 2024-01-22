// This component renders a poll directory page

import "./Directory.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { userPollProps } from "../../utils/interfaces";
import { QUERY_ALL_POLLS, QUERY_GENRES } from "../../utils/queries";
import { PollListing, Select, InputText } from "../../components";

export function Directory() {
  const navigate = useNavigate();
  const Auth = new AuthService();
  const { votes } = Auth.getProfile();
  const { genre } = useParams();
  const [search, setSearch] = useState("");

  // get the relevant polls
  const getPolls = useQuery(QUERY_ALL_POLLS, {
    variables: { username: "", genre },
  });

  // get all genres
  const getGenres = useQuery(QUERY_GENRES, {
    variables: { username: "", genre },
  });

  const list = getPolls.data?.getPolls.polls || [];

  // generate list of sorted genre objects
  const genres: string[] = getGenres.loading
    ? ["loading"]
    : getGenres.data.getGenres.titles;
  const sortedGenres = ["all", ...genres.slice(1).sort(), "expired"];
  const genreObjs = sortedGenres.map((genre) => {
    return {
      value: genre,
      title: genre.charAt(0).toUpperCase() + genre.slice(1),
    };
  });

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    navigate(`/polls/${value}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  return (
    <section id="directory" className="container">
      <div className="row">
        <div id="filters" className="col col-12">
          {getGenres.loading ? (
            <div className="doesnt-exist list-member-20">Loading...</div>
          ) : (
            <Select
              id="genreSelect"
              options={genreObjs}
              val={genre}
              setValue={handleSelect}
            />
          )}
          <InputText
            id="pollSearch"
            type="text"
            classN="darker"
            placeholder="Filter polls"
            val={search}
            setValue={handleSearchChange}
          />
        </div>
        {list.length > 0
          ? list.map((poll: userPollProps, index: number) => {
              const searchFilter =
                search === "" ||
                poll.title.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
                poll.description.toLowerCase().indexOf(search.toLowerCase()) >
                  -1;
              return (
                searchFilter && (
                  <PollListing
                    key={index}
                    directory={{
                      poll: poll,
                      vote: votes[poll.poll_id] || "",
                    }}
                  />
                )
              );
            })
          : ""}
      </div>
    </section>
  );
}
