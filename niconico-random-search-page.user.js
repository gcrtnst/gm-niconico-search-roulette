// ==UserScript==
// @name            Nicovideo Search Roulette
// @name:ja         ニコニコ動画検索結果ページガチャ
// @description     Open a random page from the current search results.
// @description:ja  検索結果のページ送りからランダムなページを開きます。
// @namespace       https://github.com/gcrtnst/
// @version         0.1.0
// @author          gcrtnst
// @license         Unlicense
// @homepageURL     https://github.com/gcrtnst/gm-niconico-search-roulette
// @match           https://www.nicovideo.jp/search/*
// @noframes
// @grant           GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";

  const ja = navigator.language.startsWith("ja");
  const label = ja
    ? "検索結果のランダムなページを開く"
    : "Open a random search results page";

  function atoi(s) {
    if (s === null || !/^\d+$/.test(s)) {
      return null;
    }

    const x = Number(s);
    return Number.isSafeInteger(x) ? x : null;
  }

  function openRandomSearchPage() {
    const currentUrl = new URL(location.href);
    const currentUrlBase = new URL(currentUrl.href);
    currentUrlBase.search = "";
    currentUrlBase.hash = "";

    const currentPage = atoi(currentUrl.searchParams.get("page")) ?? 1;
    const pageNumbers = new Set([currentPage]);
    for (const link of document.querySelectorAll("a[href]")) {
      const linkUrl = URL.parse(link.href, currentUrl.href);
      if (linkUrl === null) {
        continue;
      }

      const linkUrlBase = new URL(linkUrl.href);
      linkUrlBase.search = "";
      linkUrlBase.hash = "";

      if (currentUrlBase.href !== linkUrlBase.href) {
        continue;
      }

      const linkPage = atoi(linkUrl.searchParams.get("page"));
      if (linkPage !== null) {
        pageNumbers.add(linkPage);
      }
    }

    const lastPage = Math.max(...pageNumbers);
    const targetPage = Math.floor(Math.random() * lastPage) + 1;

    currentUrl.searchParams.set("page", String(targetPage));
    location.assign(currentUrl.href);
  }

  GM_registerMenuCommand(label, openRandomSearchPage);
})();
