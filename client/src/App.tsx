import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { AuthService } from "./utils/auth";
import {
  Home,
  Profile,
  Poll,
  Create,
  Directory,
  Login,
  UserDir,
  TopMovies,
  FAQ,
  SearchResults,
  ResetPassword,
} from "./pages";
import { Header, Footer } from "./pageComponents";
import { userData, userPollProps } from "./utils";

const httpLink = createHttpLink({ uri: "/graphql" });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  uri: "http://:3001/graphql",
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

function App() {
  const Auth = new AuthService();
  const [loggedIn, setLoggedIn] = useState(Auth.loggedIn());
  const userInfo: userData = Auth.getProfile();

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/email/:eToken" element={<Home />} />
          <Route path="/pwd/:eToken" element={<ResetPassword />} />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" replace={true} />
              ) : (
                <Login setLogIn={setLoggedIn} />
              )
            }
          />
          <Route path="/polls/:genre" element={<Directory />} />
          <Route path="/polls" element={<Directory />} />
          <Route path="/users" element={<UserDir />} />
          <Route path="/top-films" element={<TopMovies />} />
          <Route path="/search/:term" element={<SearchResults />} />
          <Route
            path="/:lookupname/:pollname"
            element={<Poll loggedin={loggedIn} currUser={userInfo.userName} />}
          />
          <Route
            path="/create"
            element={
              !loggedIn ? <Navigate to="/" replace={true} /> : <Create />
            }
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/Faq" element={<FAQ />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
