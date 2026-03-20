import React, { useState, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  Music,
  Play,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { libraryApi } from "@/lib/api/library";
import { useAuth } from "@/context/AuthContext";
import { usePlayer } from "@/context/PlayerContext";
import type { MegasetTrack } from "@/types/api";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { PlaylistDropdown } from "./PlaylistDropdown";

const SciFiLibraryView: React.FC = () => {
  const { accessToken } = useAuth();
  const { playQueue } = usePlayer();
  const navigate = useNavigate();

  // Navigation State
  const [artists, setArtists] = useState<string[]>([]);
  const [expandedArtists, setExpandedArtists] = useState<
    Record<string, string[]>
  >({}); // artist -> albums
  const [expandedAlbums, setExpandedAlbums] = useState<
    Record<string, MegasetTrack[]>
  >({}); // albumKey -> tracks

  // Main View State
  const [selectedTracks, setSelectedTracks] = useState<MegasetTrack[]>([]);
  const [viewTitle, setViewTitle] = useState("Root Level");

  // Load Initial Artists
  useEffect(() => {
    if (!accessToken) return;
    libraryApi
      .getArtists(accessToken, 50, 0)
      .then((res) => setArtists(res.artists));
  }, [accessToken]);

  const toggleArtist = async (artist: string) => {
    if (expandedArtists[artist]) {
      const newExp = { ...expandedArtists };
      delete newExp[artist];
      setExpandedArtists(newExp);
    } else {
      if (!accessToken) return;
      const res = await libraryApi.getAlbumsByArtist(artist, accessToken);
      setExpandedArtists({ ...expandedArtists, [artist]: res.albums });
    }
  };

  const toggleAlbum = async (artist: string, album: string) => {
    const key = `${artist}|${album}`;
    if (expandedAlbums[key]) {
      const newExp = { ...expandedAlbums };
      delete newExp[key];
      setExpandedAlbums(newExp);
    } else {
      if (!accessToken) return;
      // Depending on API, we might use getTracksByArtistAndAlbum
      try {
        const res = await libraryApi.getTracksByArtistAndAlbum(
          artist,
          album,
          accessToken,
        );
        setExpandedAlbums({ ...expandedAlbums, [key]: res.tracks });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const viewAlbum = (artist: string, album: string, tracks: MegasetTrack[]) => {
    setViewTitle(`${artist} - ${album}`);
    setSelectedTracks(tracks);
  };

  return (
    <div className="flex h-[80vh] w-full gap-6 mt-6">
      {/* Left Sidebar - Tree Structure */}
      <div className="w-1/3 glass-panel rounded-3xl p-4 overflow-y-auto border-r border-border-glow shadow-2xl">
        <h2 className="text-xl font-heading font-bold mb-4 text-accent-cyan uppercase tracking-widest pl-2">
          Systems
        </h2>
        <ul className="space-y-1">
          {artists.map((artist) => {
            const isArtistOpen = !!expandedArtists[artist];
            const albums = expandedArtists[artist] || [];

            return (
              <li key={artist} className="text-sm">
                <div
                  className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded-lg cursor-pointer text-text-primary transition-colors"
                  onClick={() => toggleArtist(artist)}
                >
                  {isArtistOpen ? (
                    <ChevronDown className="w-4 h-4 text-accent-amber" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  )}
                  {isArtistOpen ? (
                    <FolderOpen className="w-4 h-4 text-accent-amber" />
                  ) : (
                    <Folder className="w-4 h-4 text-text-muted" />
                  )}
                  <span className="truncate">{artist}</span>
                </div>

                {isArtistOpen && albums.length > 0 && (
                  <ul className="pl-6 space-y-1 border-l border-border/20 ml-4 mt-1">
                    {albums.map((album) => {
                      const albumKey = `${artist}|${album}`;
                      const isAlbumOpen = !!expandedAlbums[albumKey];
                      const tracks = expandedAlbums[albumKey] || [];

                      return (
                        <li key={albumKey}>
                          <div
                            className="flex items-center justify-between p-2 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
                            onClick={() => {
                              toggleAlbum(artist, album);
                              if (tracks.length > 0)
                                viewAlbum(artist, album, tracks);
                            }}
                          >
                            <div className="flex items-center gap-2 text-text-primary truncate">
                              {isAlbumOpen ? (
                                <ChevronDown className="w-4 h-4 text-accent-cyan" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-text-muted" />
                              )}
                              <Music
                                className={cn(
                                  "w-4 h-4",
                                  isAlbumOpen
                                    ? "text-accent-cyan"
                                    : "text-text-muted",
                                )}
                              />
                              <span className="truncate">
                                {album || "Unknown Album"}
                              </span>
                            </div>
                          </div>

                          {/* Inner Tracks (optional in tree, mostly just logic trigger) */}
                          {isAlbumOpen && tracks.length > 0 && (
                            <div className="pl-6 mt-1 mb-2">
                              <button
                                onClick={() => viewAlbum(artist, album, tracks)}
                                className="text-xs text-accent-cyan hover:underline border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-1 rounded"
                              >
                                Load into Main Panel
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Data Table */}
      <div className="w-2/3 glass-panel rounded-3xl p-6 flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-text-primary">
            {viewTitle}
          </h2>
          {selectedTracks.length > 0 && (
            <button
              onClick={() => playQueue(selectedTracks)}
              className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-black font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              <Play className="w-4 h-4" /> Play System
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {selectedTracks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-4">
              <Music className="w-16 h-16 opacity-20" />
              <p>Select a subsystem (album) to browse records.</p>
            </div>
          ) : (
            <table className="w-full text-left font-mono text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-glow text-accent-amber uppercase tracking-wider text-xs">
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Artist</th>
                  <th className="p-3 w-20">Year</th>
                  <th className="p-3 w-20">Format</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedTracks.map((track, idx) => (
                  <tr
                    key={track.id}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td
                      className="p-3 text-center text-text-muted group-hover:text-accent-cyan"
                      onClick={() => playQueue(selectedTracks, idx)}
                    >
                      <div className="hidden group-hover:block">
                        <Play className="w-4 h-4 mx-auto" />
                      </div>
                      <div className="group-hover:hidden">{idx + 1}</div>
                    </td>
                    <td
                      className="p-3 text-text-primary truncate max-w-[200px]"
                      onClick={() => playQueue(selectedTracks, idx)}
                    >
                      {track.title || track.filename}
                    </td>
                    <td
                      className="p-3 text-text-muted truncate max-w-[150px]"
                      onClick={() => playQueue(selectedTracks, idx)}
                    >
                      {track.artist || "Unknown"}
                    </td>
                    <td
                      className="p-3 text-text-muted"
                      onClick={() => playQueue(selectedTracks, idx)}
                    >
                      {track.year || "N/A"}
                    </td>
                    <td
                      className="p-3 text-accent-cyan opacity-80"
                      onClick={() => playQueue(selectedTracks, idx)}
                    >
                      {track.relative_path.split(".").pop()?.toUpperCase()}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FavoriteButton trackId={track.id} variant="icon" />
                        <PlaylistDropdown trackId={track.id} variant="button" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/library/similar/${track.id}`);
                          }}
                          className="p-2 hover:bg-white/10 rounded-full text-accent-cyan transition-colors"
                          title="Find Similar Nodes"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SciFiLibraryView;
