import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlbums } from "@/hooks/useAlbums";
import LibraryHeader from "@/components/library/LibraryHeader";
import AlbumsView from "@/components/library/views/AlbumsView";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

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

  if (loading) {
    return <LoadingSpinner message={`Loading albums for ${decodedArtistName}...`} />;
  }

  if (error) {
    return <ErrorMessage title="Error loading albums" message={error} />;
  }

  return (
    <div className="space-y-6">
      <LibraryHeader 
        title={`Albums by ${decodedArtistName}`} 
        subtitle="Browse albums"
        showBack
      />
      
      <div className="backdrop-blur-lg rounded-2xl p-6 bg-background border border-border">
        <AlbumsView
          albums={albums}
          selectedArtist={decodedArtistName}
          onAlbumClick={handleAlbumClick}
        />
      </div>
    </div>
  );
};

export default LibraryAlbumsPage;
