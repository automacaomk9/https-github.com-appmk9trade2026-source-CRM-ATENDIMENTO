/**
 * Synthesizes a beautiful, subtle, high-quality double-chime notification sound.
 * Uses Web Audio API dynamically to ensure 100% reliable execution with zero external asset dependencies.
 */
export const playSubtleNotificationSound = (force = false) => {
  // Respect the user's sound enabling preference unless forced (for a test beep)
  const isSoundEnabled = localStorage.getItem("mk9_sound_enabled") !== "false";
  if (!isSoundEnabled && !force) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a gentle double electronic chime (Slack-like premium notification tone)
    // Note 1: Clear, crisp A5 pitch
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime); 
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02); // gentle ramp in
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22); // sweet decay
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // Note 2: Harmonious perfect-fifth E6 pitch with short overlap
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.08); 
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.08);
    gain2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.10); 
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.38);
  } catch (e) {
    console.warn("Audio playback gesture restricted or interface context suspended:", e);
  }
};
