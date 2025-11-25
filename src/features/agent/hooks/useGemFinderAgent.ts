import { useState } from "react";
import { api } from "@/lib/api";
import { UIState, ButtonOption } from "@/lib/api/agent";

export const useGemFinderAgent = () => {
  const [uiState, setUiState] = useState<UIState | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    "The agent is thinking..."
  );
  const [pendingFunFact, setPendingFunFact] = useState<string | null>(null);

  // Update UI state and capture any fun_fact from the AgentState response
  const updateState = (newState: any) => {
    if (!newState) return;
    // The backend returns an AgentState dict with a 'ui_state' key
    const ui = newState.ui_state ?? newState;
    setUiState(ui);
    // Prefer the most recent fun fact (fun_fact_2 overrides fun_fact_1, then fun_fact)
    const fact =
      newState.fun_fact_2 ?? newState.fun_fact_1 ?? newState.fun_fact ?? null;
    setPendingFunFact(fact);
  };

  const startAgent = async (playlistId: number) => {
    setLoading(true);
    setLoadingMessage(
      "🎵 Analyzing your playlist...\n\n💡 Did you know? Our AI uses 512-dimensional audio embeddings to understand the sonic fingerprint of each track!"
    );
    setPendingFunFact(null); // Clear any previous fun fact
    try {
      const state = await api.agent.startRecommendation(playlistId);
      console.log("🎬 Agent started, received state:", state);
      updateState(state);
    } catch (error) {
      console.error("Agent failed to start:", error);
      setUiState(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (option: ButtonOption, playlistId: number) => {
    console.log("🔵 Button clicked:", option);

    // Determine default message based on action
    let defaultMessage = "🔮 Processing your request...";
    if (
      option.action === "submit_knowledge" ||
      option.action === "mark_known" ||
      option.action === "continue"
    ) {
      defaultMessage = "🎸 Enriching tracks with Spotify metadata...";
    } else if (option.action === "set_vibe") {
      defaultMessage = "🎨 Crafting personalized pitches...";
    } else if (option.action === "add") {
      defaultMessage = "✨ Adding track to your playlist...";
    }

    // Use pendingFunFact if available, otherwise fallback to default + generic fact
    if (pendingFunFact) {
      setLoadingMessage(pendingFunFact);
    } else {
      setLoadingMessage(
        `${defaultMessage}\n\n💡 Did you know? Our AI uses 512-dimensional audio embeddings to understand the sonic fingerprint of each track!`
      );
    }

    setLoading(true);
    try {
      console.log("📤 Sending resume request:", {
        action: option.action,
        playlistId: playlistId,
        payload: option.payload,
      });
      const newState = await api.agent.resumeAgent(
        option.action,
        playlistId,
        option.payload
      );
      console.log("📥 Received new state:", newState);
      updateState(newState);
    } catch (error) {
      console.error("❌ Agent action failed:", error);
      setUiState(null);
    } finally {
      setLoading(false);
      console.log("🏁 Loading complete");
    }
  };

  const resetAgent = () => {
    setUiState(null);
    setPendingFunFact(null);
  };

  return {
    uiState,
    loading,
    loadingMessage,
    pendingFunFact,
    startAgent,
    handleAction,
    resetAgent,
  };
};
