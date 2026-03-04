// reducers/defis.js

import { createSlice } from "@reduxjs/toolkit";

/* ---------------- Défis fixes ---------------- */
// Ce sont les défis qui apparaissent toujours et qui ne peuvent pas être supprimés
const DEFIS_FIXES_INITIAL = [
  {
    id: "hydratation",
    nom: "Hydratation",
    icone: "🥤",
    max: 2000,
    min: 0,
    pas: 200, // combien on ajoute/enlève quand on clique + ou -
    unite: "L",
    diviseur: 1000,
    maxAffiche: 2,
    valeur: 0, // valeur actuelle du défi
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

/* ---------------- Slice Redux ---------------- */
// Ici on crée notre slice pour gérer les défis
const defisSlice = createSlice({
  name: "defis", // nom du slice
  initialState: {
    fixes: DEFIS_FIXES_INITIAL, // défis fixes
    personnalises: [], // défis ajoutés par l'utilisateur
  },
  reducers: {
    // Modifier la valeur d'un défi
    modifierValeur: (state, action) => {
      const { id, delta } = action.payload;

      // Cherche le défi dans les fixes
      const defiFixe = state.fixes.find((d) => d.id === id);
      if (defiFixe) {
        // On met à jour la valeur tout en restant entre min et max
        defiFixe.valeur = Math.max(
          defiFixe.min,
          Math.min(defiFixe.max, defiFixe.valeur + delta),
        );
        return; // on sort de la fonction si on a trouvé
      }

      // Sinon, cherche le défi dans les personnalisés
      const defiPerso = state.personnalises.find((d) => d.id === id);
      if (defiPerso) {
        defiPerso.valeur = Math.max(
          defiPerso.min,
          Math.min(defiPerso.max, defiPerso.valeur + delta),
        );
      }
    },

    // Ajouter un nouveau défi personnalisé
    ajouterDefi: (state, action) => {
      const { nom } = action.payload;
      state.personnalises.push({
        id: Date.now().toString(), // id unique
        nom: nom,
        valeur: 0, // valeur initiale
        max: 100,
        min: 0,
        pas: 10, // valeur par défaut à ajouter/enlever
      });
    },

    // Supprimer un défi personnalisé
    supprimerDefi: (state, action) => {
      const idASupprimer = action.payload.id;
      // On garde tous les défis sauf celui qu'on veut supprimer
      state.personnalises = state.personnalises.filter(
        (d) => d.id !== idASupprimer,
      );
    },
  },
});

/* ---------------- Sélecteur ---------------- */
// Sélecteur simple qui combine les défis fixes et personnalisés
// ⚠️ Si un jour vous avez beaucoup de défis et que vous voulez optimiser
// la performance, vous pouvez utiliser `createSelector` pour mémoriser le résultat
export const selectTousLesDefis = (state) => {
  const fixes = state.defis.fixes;
  const personnalises = state.defis.personnalises;
  return fixes.concat(personnalises); // concat évite le spread [...]
};

// ---------------- Export ----------------
export const { modifierValeur, ajouterDefi, supprimerDefi } =
  defisSlice.actions;
export default defisSlice.reducer;
