import React from 'react';
import { Play, Heart, Sparkles, X } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useLibrary } from '@/context/LibraryContext';
import type { VisualizationPoint } from '@/lib/api/visualization';
import type { MegasetTrack } from '@/types/api';

interface TrackCardProps {
  point: VisualizationPoint;
  onClose: () => void;
  onFindSimilar: (trackId: number) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ point, onClose, onFindSimilar }) => {
  const { playTrack } = usePlayer();
  const { isFavorite, addFavorite, removeFavorite } = useLibrary();

  const handlePlay = () => {
    // Convert to MegasetTrack only when needed
    const track: MegasetTrack = {
      id: point.id,
      title: point.title,
      artist: point.artist,
      album: point.album,
      genre: point.genre,
      year: point.year,
      filename: '',
      filepath: '',
      relative_path: '',
      filesize: 0,
      created_at: '',
      tracknumber: null,
    };
    playTrack(track);
  };

  const handleToggleFavorite = async () => {
    if (isFavorite(point.id)) {
      await removeFavorite(point.id);
    } else {
      await addFavorite(point.id);
    }
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-background/90 backdrop-blur-md border border-primary/20 rounded-xl shadow-2xl p-4 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={20} />
      </button>

      <div className="mt-2">
        <h3 className="text-lg font-bold text-primary truncate" title={point.title}>
          {point.title}
        </h3>
        <p className="text-sm font-medium text-foreground/80 truncate">
          {point.artist}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {point.album} • {point.year}
        </p>
        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {point.genre}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          onClick={handlePlay}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Play size={18} className="fill-current" />
          Play
        </button>

        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-lg border transition-colors ${
            isFavorite(point.id)
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-input hover:bg-accent hover:text-accent-foreground'
          }`}
          title={isFavorite(point.id) ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={20} className={isFavorite(point.id) ? "fill-current" : ""} />
        </button>

        <button
          onClick={() => onFindSimilar(point.id)}
          className="p-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
          title="Find neighbors"
        >
          <Sparkles size={20} />
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
        <span>Cluster: {point.cluster}</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: point.cluster_color }}></span>
          Color
        </span>
      </div>
    </div>
  );
};

export default TrackCard;
