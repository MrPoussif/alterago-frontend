import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const STATUS_BAR_H =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 44;

const ALL_EMOJIS = [
  "🍎",
  "🍊",
  "🍋",
  "🍇",
  "🍓",
  "🫐",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥝",
  "🍌",
  "🍉",
  "🍐",
  "🥥",
  "🥕",
  "🍆",
  "🥦",
  "🌽",
  "🍅",
  "🥑",
  "🧅",
  "🧄",
  "🫑",
  "🥬",
  "🍠",
  "🌶️",
  "🫒",
  "🥜",
  "🍈",
];

const LEVELS = [
  { label: "Facile", pairs: 6, cols: 3, emoji: "🌱" },
  { label: "Moyen", pairs: 10, cols: 4, emoji: "🌿" },
  { label: "Difficile", pairs: 15, cols: 5, emoji: "🌳" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs) {
  const picked = shuffle(ALL_EMOJIS).slice(0, pairs);
  return shuffle(
    picked.flatMap((emoji, i) => [
      { id: i * 2, emoji, pairId: i, flipped: false, matched: false },
      { id: i * 2 + 1, emoji, pairId: i, flipped: false, matched: false },
    ]),
  );
}

// ── Carte ────────────────────────────────────────────────────────────────────
function Card({ card, onPress, disabled, cardSize }) {
  const flipAnim = useRef(
    new Animated.Value(card.flipped || card.matched ? 1 : 0),
  ).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const shouldShow = card.flipped || card.matched;
    Animated.spring(flipAnim, {
      toValue: shouldShow ? 1 : 0,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [card.flipped, card.matched]);

  useEffect(() => {
    if (card.matched) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.25,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [card.matched]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
  });
  const fontSize = cardSize > 70 ? 36 : cardSize > 55 ? 28 : 22;

  return (
    <TouchableOpacity
      onPress={() =>
        !disabled && !card.matched && !card.flipped && onPress(card.id)
      }
      activeOpacity={0.85}
      style={{ margin: 3 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Animated.View
          style={[
            styles.card,
            {
              width: cardSize,
              height: cardSize,
              transform: [{ rotateY: backRotate }],
              opacity: backOpacity,
              position: "absolute",
              backgroundColor: "#1e3a5f",
              borderColor: "#2d5f9a",
            },
          ]}
        >
          <Text style={{ fontSize: fontSize - 4 }}>🎴</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            {
              width: cardSize,
              height: cardSize,
              transform: [{ rotateY: frontRotate }],
              opacity: frontOpacity,
              backgroundColor: card.matched ? "#1a4a2e" : "#1e3a5f",
              borderColor: card.matched ? "#4caf50" : "#4a9eff",
              borderWidth: card.matched ? 2.5 : 1.5,
            },
          ]}
        >
          <Text style={{ fontSize }}>{card.emoji}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Écran victoire ───────────────────────────────────────────────────────────
function WinScreen({ moves, time, level, onReplay, onMenu }) {
  const popAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(popAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);
  const stars =
    moves <= level.pairs * 2 + 2 ? 3 : moves <= level.pairs * 3 ? 2 : 1;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <View style={styles.winOverlay}>
      <Animated.View
        style={[styles.winCard, { transform: [{ scale: popAnim }] }]}
      >
        <Text style={styles.winEmoji}>🏆</Text>
        <Text style={styles.winTitle}>Bravo !</Text>
        <Text style={styles.winStars}>
          {"⭐".repeat(stars)}
          {"🌑".repeat(3 - stars)}
        </Text>
        <View style={styles.winStats}>
          <View style={styles.winStat}>
            <Text style={styles.winStatVal}>{moves}</Text>
            <Text style={styles.winStatLabel}>coups</Text>
          </View>
          <View style={styles.winStatDivider} />
          <View style={styles.winStat}>
            <Text style={styles.winStatVal}>{fmt(time)}</Text>
            <Text style={styles.winStatLabel}>temps</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.winBtn} onPress={onReplay}>
          <Text style={styles.winBtnText}>🔄 Rejouer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.winBtn, styles.winBtnSecondary]}
          onPress={onMenu}
        >
          <Text style={[styles.winBtnText, { color: "#4a9eff" }]}>🏠 Menu</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── Menu ─────────────────────────────────────────────────────────────────────
function MenuScreen({ onStart }) {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>🍓 Memory</Text>
      <Text style={styles.menuSubtitle}>Fruits & Légumes</Text>
      <Text style={styles.menuDesc}>Retrouve toutes les paires cachées !</Text>
      <View style={styles.menuLevels}>
        {LEVELS.map((lvl, i) => (
          <TouchableOpacity
            key={i}
            style={styles.levelBtn}
            onPress={() => onStart(lvl)}
            activeOpacity={0.8}
          >
            <Text style={styles.levelEmoji}>{lvl.emoji}</Text>
            <View>
              <Text style={styles.levelLabel}>{lvl.label}</Text>
              <Text style={styles.levelDetail}>
                {lvl.pairs} paires · grille {lvl.cols}×
                {Math.ceil((lvl.pairs * 2) / lvl.cols)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Jeu ──────────────────────────────────────────────────────────────────────
function GameScreen({ level, onWin, onMenu }) {
  const [deck, setDeck] = useState(() => buildDeck(level.pairs));
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [time, setTime] = useState(0);
  const [checking, setChecking] = useState(false);
  const timerRef = useRef(null);
  const deckRef = useRef(deck);
  deckRef.current = deck;

  useEffect(() => {
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (matched === level.pairs) {
      clearInterval(timerRef.current);
      setTimeout(() => onWin(moves, time), 700);
    }
  }, [matched]);

  const handlePress = useCallback(
    (id) => {
      if (checking) return;

      setDeck((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
      );

      setSelected((prev) => {
        const next = [...prev, id];
        if (next.length === 2) {
          setChecking(true);
          setMoves((m) => m + 1);
          const [idA, idB] = next;
          const cardA = deckRef.current.find((c) => c.id === idA);
          const cardB = deckRef.current.find((c) => c.id === idB);
          const isMatch =
            cardA &&
            cardB &&
            cardA.pairId === cardB.pairId &&
            cardA.id !== cardB.id;

          setTimeout(() => {
            if (isMatch) {
              Vibration.vibrate(40);
              setDeck((d) =>
                d.map((c) =>
                  next.includes(c.id)
                    ? { ...c, matched: true, flipped: true }
                    : c,
                ),
              );
              setMatched((m) => m + 1);
            } else {
              setDeck((d) =>
                d.map((c) =>
                  next.includes(c.id) ? { ...c, flipped: false } : c,
                ),
              );
            }
            setSelected([]);
            setChecking(false);
          }, 900);
          return next;
        }
        return next;
      });
    },
    [checking],
  );

  const cardMargin = 3;
  const cardSize = Math.floor(
    (SW - 32 - cardMargin * 2 * level.cols) / level.cols,
  );
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const rows = [];
  for (let i = 0; i < deck.length; i += level.cols)
    rows.push(deck.slice(i, i + level.cols));

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <TouchableOpacity onPress={onMenu} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Menu</Text>
        </TouchableOpacity>
        <View style={styles.headerStats}>
          <Text style={styles.statChip}>🎯 {moves}</Text>
          <Text style={styles.statChip}>⏱ {fmt(time)}</Text>
          <Text style={styles.statChip}>
            ✅ {matched}/{level.pairs}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.gridScroll}
        scrollEnabled={false}
      >
        <View style={styles.grid}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.gridRow}>
              {row.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onPress={handlePress}
                  disabled={checking || selected.length >= 2}
                  cardSize={cardSize}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: `${(matched / level.pairs) * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("menu");
  const [level, setLevel] = useState(null);
  const [result, setResult] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = (lvl) => {
    setLevel(lvl);
    setScreen("game");
    setGameKey((k) => k + 1);
  };
  const handleWin = (moves, time) => {
    setResult({ moves, time });
    setScreen("win");
  };
  const handleReplay = () => {
    setScreen("game");
    setGameKey((k) => k + 1);
  };
  const handleMenu = () => setScreen("menu");

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#060d1f"
        translucent={false}
      />
      {screen === "menu" && <MenuScreen onStart={handleStart} />}
      {screen === "game" && (
        <GameScreen
          key={gameKey}
          level={level}
          onWin={handleWin}
          onMenu={handleMenu}
        />
      )}
      {screen === "win" && (
        <WinScreen
          moves={result.moves}
          time={result.time}
          level={level}
          onReplay={handleReplay}
          onMenu={handleMenu}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#060d1f", paddingTop: STATUS_BAR_H },

  // Menu
  menuContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  menuTitle: {
    fontSize: 52,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "#4a9eff55",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  menuSubtitle: {
    fontSize: 18,
    color: "#4a9eff",
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 8,
  },
  menuDesc: { fontSize: 14, color: "#556", marginBottom: 40 },
  menuLevels: { width: "100%", gap: 14 },
  levelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#0d1f3c",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: "#1a3a6a",
  },
  levelEmoji: { fontSize: 32 },
  levelLabel: { fontSize: 18, fontWeight: "800", color: "#e8f0ff" },
  levelDetail: { fontSize: 12, color: "#4a7abf", marginTop: 2 },

  // Game
  gameContainer: { flex: 1 },
  gameHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#0d1f3c",
  },
  backBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  backBtnText: { color: "#4a9eff", fontSize: 16, fontWeight: "700" },
  headerStats: { flexDirection: "row", gap: 8 },
  statChip: {
    backgroundColor: "#0d1f3c",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#a0c4ff",
    fontSize: 13,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#1a3a6a",
  },
  gridScroll: { flexGrow: 1, justifyContent: "center" },
  grid: { alignItems: "center", paddingVertical: 12, paddingHorizontal: 16 },
  gridRow: { flexDirection: "row" },

  // Card
  card: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    backfaceVisibility: "hidden",
    shadowColor: "#4a9eff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Progress
  progressBar: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0d1f3c",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: "#4caf50" },

  // Win
  winOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#060d1fee",
  },
  winCard: {
    backgroundColor: "#0d1f3c",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    width: SW * 0.82,
    borderWidth: 1.5,
    borderColor: "#1a3a6a",
    shadowColor: "#4a9eff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  winEmoji: { fontSize: 60, marginBottom: 8 },
  winTitle: { fontSize: 34, fontWeight: "900", color: "#fff", marginBottom: 6 },
  winStars: { fontSize: 28, marginBottom: 20 },
  winStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#060d1f",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 20,
  },
  winStat: { alignItems: "center" },
  winStatVal: { fontSize: 26, fontWeight: "900", color: "#4a9eff" },
  winStatLabel: { fontSize: 12, color: "#556", marginTop: 2 },
  winStatDivider: { width: 1, height: 36, backgroundColor: "#1a3a6a" },
  winBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#4a9eff",
    alignItems: "center",
    marginBottom: 10,
  },
  winBtnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#1a3a6a",
  },
  winBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});
