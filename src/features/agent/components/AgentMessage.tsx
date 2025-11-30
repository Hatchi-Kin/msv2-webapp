import React from "react";
import { Brain, Sparkles, Music } from "lucide-react";

interface AgentMessageProps {
  message: string;
  understanding?: string;
  selection?: string;
}

export const AgentMessage: React.FC<AgentMessageProps> = ({
  message,
  understanding,
  selection,
}) => {
  // Use structured data if available, otherwise fallback to regex parsing
  let part1Text = understanding;
  let part2Text = selection;

  if (!part1Text || !part2Text) {
    // Check if message follows the Part 1 / Part 2 structure (handling optional bold markers and variations)
    // Matches: "**PART 1 (Understanding):**", "**Understanding:**", "Understanding:", etc.
    const part1Match = message.match(
      /(?:\*\*)?(?:PART 1\s*\(?)?Understanding(?:\))?:?(?:\*\*)?\s*(.*?)(?=(?:\*\*)?(?:PART 2\s*\(?)?Selection|$)/is
    );
    const part2Match = message.match(
      /(?:\*\*)?(?:PART 2\s*\(?)?Selection(?:\))?:?(?:\*\*)?\s*(.*)/is
    );

    if (part1Match) part1Text = part1Match[1].trim();
    if (part2Match) part2Text = part2Match[1].trim();
  }

  if (part1Text && part2Text) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Part 1: Understanding */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12">
            <Brain className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                Understanding Your Vibe
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {part1Text}
            </p>
          </div>
        </div>

        {/* Part 2: Selection */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group border-primary/20">
          <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12">
            <Music className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-secondary rounded-2xl text-foreground">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                My Selection
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {part2Text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for standard messages (questions, intermediate steps)
  return (
    <div className="glass-card p-8 rounded-3xl w-full animate-in fade-in duration-500">
      <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
        {message}
      </p>
    </div>
  );
};
