// reducers/defis.js

import { createSlice } from "@reduxjs/toolkit";

/* ---------------- Défis fixes ---------------- */
const DEFIS_FIXES_INITIAL = [
  {
    id: "hydratation",
    nom: "Hydratation",
    icone: "🥤",
    max: 2000,
    min: 0,
    pas: 200,
    unite: "L",
    diviseur: 1000,
    maxAffiche: 2,
    valeur: 0,
  },
  {
    id: "pas",
    nom: "Nombre de pas",
    icone: "🚶",
    max: 10000,
    min: 0,
    pas: 1000,
    unite: "pas",
    diviseur: 1,
    maxAffiche: 10000,
    valeur: 0,
  },
];

const initialState = {
  fixes: DEFIS_FIXES_INITIAL,
  personnalises: [],
};

const iconesMap = {
  Écriture: "✍️",
  Lecture: "📚",
  Musique: "🎶",
  Vélo: "🚲",
  Natation: "🏊",
};

/* ---------------- Slice Redux ---------------- */
const defisSlice = createSlice({
  name: "defis",
  initialState,
  reducers: {
    // Ajoute ou retire de la valeur sur un défi (boutons + et -)
    modifierValeur: (state, action) => {
      const { id, delta } = action.payload;

      const defiFixe = state.fixes.find((defi) => defi.id === id);
      if (defiFixe) {
        defiFixe.valeur = Math.max(
          defiFixe.min,
          Math.min(defiFixe.max, defiFixe.valeur + delta),
        );
        return;
      }

      const defiPerso = state.personnalises.find((defi) => defi.id === id);
      if (defiPerso) {
        defiPerso.valeur = Math.max(
          defiPerso.min,
          Math.min(defiPerso.max, defiPerso.valeur + delta),
        );
      }
    },

    // Ajoute un défi personnalisé
    ajouterDefi: (state, action) => {
      const { nom } = action.payload;
      state.personnalises.push({
        id: Date.now().toString(),
        nom: nom,
        valeur: 0,
        max:
          nom === "Musique"
            ? 30
            : nom === "Écriture" || nom === "Lecture"
              ? 5
              : 60,
        unite: nom === "Écriture" || nom === "Lecture" ? "pages" : "min",
        min: 0,
        pas: 1,
        icone: iconesMap[nom],
      });
    },

    // Supprime un défi personnalisé par son id
    supprimerDefi: (state, action) => {
      const idASupprimer = action.payload.id;
      state.personnalises = state.personnalises.filter(
        (defi) => defi.id !== idASupprimer,
      );
    },

    // Modifie l'objectif (max) d'un défi fixe
    // Par exemple passer l'objectif d'eau de 2000ml à 3000ml
    modifierMax: (state, action) => {
      const { id, nouveauMax } = action.payload;

      // On cherche le défi par son id
      const defi = state.fixes.find((d) => d.id === id);
      const defiPerso = state.personnalises.find((p) => p.id === id);

      // Si on le trouve, on change son max
      if (defi) {
        defi.max = nouveauMax;
      }
      if (defiPerso) {
        defiPerso.max = nouveauMax;
      }
    },
  },
});

/* ---------------- Sélecteur ---------------- */
// Reçoit le state Redux réel, pas initialState figé
export const selectTousLesDefis = (state) => {
  return state.defis.fixes.concat(state.defis.personnalises);
};

// ---------------- Export ----------------
export const { modifierValeur, ajouterDefi, supprimerDefi, modifierMax } =
  defisSlice.actions;
export default defisSlice.reducer;
