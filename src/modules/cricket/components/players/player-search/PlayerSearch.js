import React, { useState } from "react";
import algoliasearch from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  Configure,
  useHits,
} from "react-instantsearch-hooks-web";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import PlayerDetails from "./player-details/PlayerDetails";
import "./PlayerSearch.scss";

// const index = searchClient.initIndex(clientIndex);

export default function PlayerSearch() {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchClient = algoliasearch(
    "ADZFKKIHC2",
    "dc899ca40a49a5eda4bf14f2a7c00930"
  );

  const client = JSON.parse(sessionStorage.getItem("client"));

  const clientIndex = client ? client.algoliaIndex : "common_players";

  const CustomHits = () => {
    const { hits, results } = useHits();
    const { processingTimeMS = 0 } = results || {};
    const list = hits
      .filter(
        (elem, index, self) =>
          self.findIndex((t) => {
            return t.id === elem.id;
          }) === index
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    return list.length > 0 && processingTimeMS > 0 ? (
      list.map((hit, index) => (
        <PlayerDetails
          key={hit.id}
          player={hit}
          records={hits.filter((h) => h.id === hit.id)}
          selectedIndex={selectedIndex}
          currentIndex={index}
          handleChange={(val) => setSelectedIndex(val)}
          renderingTime={processingTimeMS}
        />
      ))
    ) : (
      <>
        {processingTimeMS > 0 ? (
          <Alert sx={{ justifyContent: "center" }} severity="warning">
            No Players Available!
          </Alert>
        ) : (
          <p>
            <CircularProgress />
          </p>
        )}
      </>
    );
  };

  return (
    <div className="algolia-search-wrapper">
      <InstantSearch
        searchClient={searchClient}
        indexName={clientIndex}
        insights
      >
        <Configure hitsPerPage={10000} />
        <SearchBox />
        <div className="search-results">
          <CustomHits />
        </div>
      </InstantSearch>
    </div>
  );
}
