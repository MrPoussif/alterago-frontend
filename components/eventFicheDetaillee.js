import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";

const ActionButton = ({ icon, onPress, label }) => (
  <TouchableOpacity
    style={styles.actionBtn}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <FontAwesome6 name={icon} size={16} color="#FFA85C" />
    {label && <Text style={styles.actionBtnLabel}>{label}</Text>}
  </TouchableOpacity>
);

export default function FicheDetail({
  ficheDetail,
  distance,
  duration,
  onClose,
  onInvite,
  onGo,
  onCall,
}) {
  // formatage de la distance
  const formatDistance = () => {
    if (!distance) return "";
    if (distance < 1) return `${parseFloat((distance * 1000).toFixed(1))} m`;
    return `${parseFloat(distance.toFixed(1))} km`;
  };

  // formatage de la durée
  const formatDuration = () => {
    if (!duration) return "";
    return Math.ceil(duration);
  };

  const horaires = ficheDetail?.hours?.map((data, i) => (
    <Text key={i} style={styles.ficheHoraire}>
      {data}
    </Text>
  ));

  return (
    <View style={styles.ficheContainer}>
      {/* Header : nom + rating + bouton fermer */}
      <View style={styles.ficheHeader}>
        <View style={styles.ficheTitleBlock}>
          <Text style={styles.ficheName}>{ficheDetail?.name}</Text>
          {ficheDetail?.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{ficheDetail?.rating}</Text>
              <Text style={styles.ratingMax}>/5</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <FontAwesome6 name="xmark" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Distance & durée */}
      {(distance || duration) && (
        <View style={styles.ficheMetrics}>
          {distance && (
            <View style={styles.metricItem}>
              <FontAwesome6 name="location-dot" size={12} color="#FFA85C" />
              <Text style={styles.metricText}>{formatDistance()}</Text>
            </View>
          )}
          {duration && (
            <View style={styles.metricItem}>
              <FontAwesome6 name="clock" size={12} color="#FFA85C" />
              <Text style={styles.metricText}>{formatDuration()} min</Text>
            </View>
          )}
        </View>
      )}

      {/* Horaires */}
      {ficheDetail?.hours?.length > 0 && (
        <View style={styles.ficheHoraires}>{horaires}</View>
      )}

      {/* Boutons d'action */}
      <View style={styles.ficheActions}>
        <ActionButton icon="user-group" onPress={onInvite} label="Partager" />
        <ActionButton
          icon="diamond-turn-right"
          onPress={onGo}
          label="Y aller"
        />
        <ActionButton icon="phone" onPress={onCall} label="Appeler" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ficheContainer: {
    gap: 10,
  },
  ficheHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ficheTitleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  ficheName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.3,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#FFF4EA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFA85C",
  },
  ratingMax: {
    fontSize: 11,
    color: "#FFA85C",
    marginLeft: 1,
  },
  closeBtn: {
    padding: 4,
  },
  ficheMetrics: {
    flexDirection: "row",
    gap: 16,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metricText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  ficheHoraires: {
    gap: 2,
  },
  ficheHoraire: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  ficheActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#FFA85C",
    borderRadius: 12,
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFA85C",
    letterSpacing: 0.2,
  },
});
