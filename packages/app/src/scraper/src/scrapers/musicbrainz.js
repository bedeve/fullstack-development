export default {
  searchArtist: {
    url: ({name})=> `https://musicbrainz.org/search?query=${name}&type=artist&limit=25&method=indexed`,
    selector: "#content > table > tbody > tr:nth-child(1)",
    properties: {
      name: {
        selector: "bdi",
        type: "text"
      },
      artistUrl: {
        selector: "a",
        type: "href"
      },
      albums: {
        action: "getAlbums"
      }
    }
  },
  getAlbums: {
    url: ({artistUrl})=>artistUrl,
    selector: "#content > form > table > tbody > tr",
    properties: {
      year: {
        selector: "td:nth-child(1)",
        type: "text",
      },
      title: {
        selector: "td:nth-child(2) bdi",
        type: "text",
      },
      albumUrl: {
        selector: "td:nth-child(2) a",
        type: "href",
      },
      tracks: {
        action: "getTracks",
      }
    }
  },
  getTracks: {
    url: ({albumUrl})=>albumUrl,
    selector: "#content > form > table > tbody > tr:nth-child(2)",
    properties: {
      releaseUrl: {
        selector: "td a",
        type: "href"
      },
      tracks: {
        action: "_getTracks"
      }
    }
  },
  _getTracks: {
    url: ({releaseUrl})=>releaseUrl,
    selector: "#content > table > tbody > tr[id]",
    properties: {
      name: {
        selector: "td:nth-child(2) bdi",
        type: "text"
      },
      artistName: {
        selector: "td:nth-child(3) bdi",
        type: "text"
      },
      youtubeUrl: {
        action: "getYoutubeUrl"
      }
    }
  },
  getYoutubeUrl: {
    url: ({artistName, name})=>`https://www.youtube.com/results?search_query=${encodeURIComponent(`${artistName} ${name}`)}`,
    selector: "ytd-video-renderer:nth-child(1)",
    properties: {
      name: {
        selector: "#video-title",
        type: "text"
      },
      url: {
        selector: "#thumbnail",
        type: "href"
      }
    }
  }
}