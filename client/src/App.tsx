import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { Home, Profile, Poll, Create, Directory, Login } from "./pages";
import { Header } from "./components";
import { samplePolls } from "./utils/fakedata";

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
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header />
        <Routes>
          {/* defaulting to the "About" tab */}
          <Route path="/" element={<Home polls={samplePolls} />} />
          {/* <Route index element={<Navigate to="/" />} /> */}

          <Route path="/login" element={<Login />} />
          <Route path="/poll/:pollId" element={<Poll />} />
          <Route path="/user/:userId" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/polls" element={<Directory />} />
          <Route path="*" element={<Home polls={samplePolls} />} />
        </Routes>
      </div>
    </ApolloProvider>
  );
}

export default App;
