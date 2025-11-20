import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlbums } from "@/hooks/useAlbums";
import LibraryHeader from "./LibraryHeader";
import AlbumsView from "./views/AlbumsView";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

const LibraryAlbumsPage: React.FC = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const navigate = useNavigate();
  const decodedArtistName = artistName ? decodeURIComponent(artistName) : "";
  
  const { albums, loading, error } = useAlbums(decodedArtistName);

  const handleAlbumClick = (albumTitle: string) => {
    // We navigate to the album page. 
    // Note: In the original code, we just selected the album. 
    // Here we assume album titles are unique enough or we might need to pass artist context.
    // For now, let's stick to the plan: /library/albums/:albumName
    // Ideally, it should be /library/artists/:artist/albums/:album but let's follow the plan first.
    navigate(`/library/albums/${encodeURIComponent(albumTitle)}`);
  };

  return (
    <div className="space-y-6 pt-6">
      <LibraryHeader 
        title={`Albums by ${decodedArtistName}`} 
        subtitle="Browse albums"
        showBack
      />
      
      <div className="glass-panel p-6 rounded-3xl min-h-[650px]">
        {loading ? (
          <LoadingSpinner message={`Loading albums for ${decodedArtistName}...`} />
        ) : error ? (
          <ErrorMessage title="Error loading albums" message={error} />
        ) : (
          <AlbumsView
            albums={albums}
            selectedArtist={decodedArtistName}
            onAlbumClick={handleAlbumClick}
          />
        )}
      </div>
    </div>
  );
};

export default LibraryAlbumsPage;
