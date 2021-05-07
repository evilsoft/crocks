/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, useCallback } from "react";
import classnames from "classnames";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
const Search = props => {
  const initialized = useRef(false);
  const searchBarRef = useRef(null);
  const history = useHistory();
  const { siteConfig = {} } = useDocusaurusContext();
  const { baseUrl } = siteConfig;
  const initAlgolia = (searchDocs, searchIndex, DocSearch) => {
      new DocSearch({
        searchDocs,
        searchIndex,
        inputSelector: "#search_input_react",
        // Override algolia's default selection event, allowing us to do client-side
        // navigation and avoiding a full page refresh.
        handleSelected: (_input, _event, suggestion) => {
          const url = baseUrl + suggestion.url;
          // Use an anchor tag to parse the absolute url into a relative url
          // Alternatively, we can use new URL(suggestion.url) but its not supported in IE
          const a = document.createElement("a");
          a.href = url;
          // Algolia use closest parent element id #__docusaurus when a h1 page title does not have an id
          // So, we can safely remove it. See https://github.com/facebook/docusaurus/issues/1828 for more details.

          history.push(url);
        }
      });
  };

  const getSearchDoc = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${baseUrl}search-doc.json`).then((content) => content.json())
      : Promise.resolve([]);

  const getLunrIndex = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${baseUrl}lunr-index.json`).then((content) => content.json())
      : Promise.resolve([]);

  const loadAlgolia = () => {
    if (!initialized.current) {
      Promise.all([
        getSearchDoc(),
        getLunrIndex(),
        import("./lib/DocSearch"),
        import("./algolia.css")
      ]).then(([searchDocs, searchIndex, { default: DocSearch }]) => {
        initAlgolia(searchDocs, searchIndex, DocSearch);
      });
      initialized.current = true;
    }
  };

  const toggleSearchIconClick = useCallback(
    e => {
      if (!searchBarRef.current.contains(e.target)) {
        searchBarRef.current.focus();
      }

      props.handleSearchBarToggle(!props.isSearchBarExpanded);
    },
    [props.isSearchBarExpanded]
  );

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={classnames("search-icon", {
          "search-icon-hidden": props.isSearchBarExpanded
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={classnames(
          "navbar__search-input",
          { "search-bar-expanded": props.isSearchBarExpanded },
          { "search-bar": !props.isSearchBarExpanded }
        )}
        onClick={loadAlgolia}
        onMouseOver={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />
    </div>
  );
};

export default Search;
