import { gql } from "@apollo/client";

export const QUERY_SINGLE_USER = gql`
  query GetUser($lookupname: String!) {
    getUser(lookupname: $lookupname) {
      created
      polls {
        poll_id
        title
        urlTitle
        votes
        comments
      }
      userName
      lookupName
      votes {
        poll_id
        option_id
        movie
      }
      comments {
        movie
        poll_id
        text
        title
        urlTitle
      }
    }
  }
`;

export const QUERY_SINGLE_POLL = gql`
  query GetPoll($lookupname: String!, $pollname: String!) {
    getPoll(lookupname: $lookupname, pollname: $pollname) {
      _id
      title
      description
      username
      options {
        _id
        companies
        contentRating
        directors
        genres
        image
        imdb_id
        year
        movie
        plot
        ratings {
          rottenTomatoes
          imDb
        }
        stars
        trailer
        wikipedia
        votes
      }
      comments {
        text
        username
        movie
      }
      votes
      voters
      created_on
      expires_on
    }
  }
`;

export const QUERY_ALL_POLLS = gql`
  query GetPolls($username: String, $genre: String) {
    getPolls(username: $username, genre: $genre) {
      polls {
        poll_id
        title
        urlTitle
        username
        votes
        comments
        expires_on
      }
    }
  }
`;

export const QUERY_HOME_POLLS = gql`
  query GetHomePolls {
    getHomePolls {
      polls {
        _id
        title
        urlTitle
        username
        description
        options {
          image
        }
        votes
        created_on
      }
    }
  }
`;

export const QUERY_GENRES = gql`
  query GetGenres {
    getGenres {
      titles
    }
  }
`;
