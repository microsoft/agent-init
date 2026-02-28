import { Box, Text, useIsScreenReaderEnabled } from "ink";
import React, { useState, useEffect } from "react";

/**
 * Animation frames for the AGENTRC banner fly-in effect.
 * Uses frame-based architecture from GitHub Copilot CLI patterns.
 * ~75ms per frame = ~13fps (optimal for terminal rendering).
 */

// The final banner text
const FULL_BANNER = [
  " █████╗  ██████╗ ███████╗███╗   ██╗████████╗██████╗  ██████╗",
  "██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔════╝",
  "███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ██████╔╝██║     ",
  "██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗██║     ",
  "██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ██║  ██║╚██████╗",
  "╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝"
];

// Animation frames - slide in from right with progressive reveal
const generateFrames = (): string[][] => {
  const frames: string[][] = [];
  const width = FULL_BANNER[0].length;

  // Frame 0-4: Empty -> sparkles appearing
  frames.push(["", "", "", "", "", ""]);
  frames.push(["", "", "    ✦", "", "", ""]);
  frames.push(["  ✦", "", "    ✦  ✧", "", "      ✦", ""]);

  // Frame 5-15: Slide in from right
  for (let offset = width; offset >= 0; offset -= 4) {
    const frame = FULL_BANNER.map((line) => {
      if (offset >= line.length) return "";
      return " ".repeat(Math.max(0, offset)) + line.slice(0, Math.max(0, line.length - offset));
    });
    frames.push(frame);
  }

  // Final frame: Full banner
  frames.push([...FULL_BANNER]);

  return frames;
};

const FRAMES = generateFrames();
const FRAME_DURATION = 75; // ~13fps

// Semantic color roles for theme compatibility (4-bit ANSI)
type ColorRole = "primary" | "accent" | "sparkle";

const THEME_DARK: Record<ColorRole, string> = {
  primary: "magentaBright",
  accent: "cyanBright",
  sparkle: "yellowBright"
};

const THEME_LIGHT: Record<ColorRole, string> = {
  primary: "magenta",
  accent: "cyan",
  sparkle: "yellow"
};

type AnimatedBannerProps = {
  onComplete?: () => void;
  skipAnimation?: boolean;
  darkMode?: boolean;
  maxWidth?: number;
};

export function AnimatedBanner({
  onComplete,
  skipAnimation = false,
  darkMode = true,
  maxWidth
}: AnimatedBannerProps): React.JSX.Element {
  const accessible = useIsScreenReaderEnabled();
  const [frameIndex, setFrameIndex] = useState(skipAnimation || accessible ? FRAMES.length - 1 : 0);
  const [isComplete, setIsComplete] = useState(skipAnimation || accessible);

  const theme = darkMode ? THEME_DARK : THEME_LIGHT;

  useEffect(() => {
    if (skipAnimation || accessible || isComplete) return;

    const interval = setInterval(() => {
      setFrameIndex((current) => {
        const next = current + 1;
        if (next >= FRAMES.length) {
          clearInterval(interval);
          setIsComplete(true);
          return FRAMES.length - 1;
        }
        return next;
      });
    }, FRAME_DURATION);

    return () => clearInterval(interval);
  }, [skipAnimation, isComplete]);

  // Call onComplete in a separate effect to avoid setState during render
  useEffect(() => {
    if (isComplete && !skipAnimation && !accessible) {
      onComplete?.();
    }
  }, [isComplete, skipAnimation, accessible, onComplete]);

  if (accessible) {
    return (
      <Box flexDirection="column">
        <Text bold>AGENTRC</Text>
      </Box>
    );
  }

  const currentFrame = FRAMES[frameIndex];
  const showSparkles = frameIndex < 3;
  const bannerWidth = FULL_BANNER[0].length;
  const shouldTruncate = maxWidth != null && maxWidth < bannerWidth;

  return (
    <Box flexDirection="column">
      {currentFrame.map((line, i) => (
        <Text
          key={i}
          color={showSparkles && line.includes("✦") ? theme.sparkle : theme.primary}
          bold={!showSparkles}
        >
          {(shouldTruncate ? line.slice(0, maxWidth) : line) || " "}
        </Text>
      ))}
    </Box>
  );
}

/**
 * Static banner for use after animation or when animation is disabled.
 */
export function StaticBanner({
  darkMode = true,
  maxWidth
}: {
  darkMode?: boolean;
  maxWidth?: number;
}): React.JSX.Element {
  const accessible = useIsScreenReaderEnabled();

  if (accessible) {
    return (
      <Box flexDirection="column">
        <Text bold>AGENTRC</Text>
      </Box>
    );
  }

  const color = darkMode ? "magentaBright" : "magenta";
  const bannerWidth = FULL_BANNER[0].length;
  const shouldTruncate = maxWidth != null && maxWidth < bannerWidth;

  return (
    <Box flexDirection="column">
      {FULL_BANNER.map((line, i) => (
        <Text key={i} color={color} bold>
          {(shouldTruncate ? line.slice(0, maxWidth) : line) || " "}
        </Text>
      ))}
    </Box>
  );
}
