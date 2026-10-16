
import { useEffect, useState } from "react";

type Track = {
  id: string;
  attributes: {
    title: string;
    lyrics?: string | null;
    attachments: {
      url: string;
    }[];
  };
}; 

export function App() {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[] | null>(null);

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("effect");

    fetch("https://musicfun.it-incubator.app/api/1.0/playlists/tracks", {
      headers: {
        "api-key": "8c45d645-4e8d-4f9d-aca4-d832ebd84746",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка загрузки треков");
        }
        return res.json();
      })
      .then((json) => setTracks(json.data))
      .catch((err) => setError(err.message));
  }, []);


  useEffect(() => {
    if (!selectedTrackId) {
      return;
    }
    fetch("https://musicfun.it-incubator.app/api/1.0/playlists/tracks/" + selectedTrackId, {
      headers: {
        "api-key": "8c45d645-4e8d-4f9d-aca4-d832ebd84746",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка загрузки треков");
        }
        return res.json();
      })
      .then((json) => setSelectedTrack(json.data))
  }, [selectedTrackId])

  if (error) {
    return <div>{error}</div>;
  }

  if (tracks === null) {
    return (
      <div>
        <h1>Musicfun</h1>
        <span>loading...</span>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div>
        <h1>Musicfun</h1>
        <span>No tracks found</span>
      </div>
    );
  }

  

  return (
    <div>
      <h1>Musicfun</h1>

      <button onClick={() => {
        setSelectedTrackId(null)
        setSelectedTrack(null)
      }}>
        reset selection
      </button>

      <div style={{ display: "flex", gap: "30px" }}>
        <ul>
          {tracks.map((track) => {
            return (
              <li
                key={track.id}
                style={{
                  border:
                    track.id === selectedTrackId
                      ? "1px solid orange"
                      : "none",
                }}
              >
                <div onClick={() => { 
                  setSelectedTrackId(track.id)
                  setSelectedTrack(null); // Очищаем предыдущий трек



                }}>
                  {track.attributes.title}
                </div>

                <audio src={track.attributes.attachments?.[0]?.url} controls />
              </li>
            );
          })}
        </ul>

        <div>
          <h2>Details</h2>

          { !selectedTrack && !selectedTrackId && 'Track is not selected'} 
          { !selectedTrack && selectedTrackId && 'Loading...'}
          { selectedTrack && selectedTrackId && selectedTrack.id !== selectedTrackId && 'Loading...'}
          { selectedTrack && <div>
              <h3>{selectedTrack.attributes.title}</h3>
              <h4>Lyrics:</h4>
              <p>
                {selectedTrack.attributes.lyrics ?? "No lyrics"}
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
