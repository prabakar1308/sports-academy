import {
  setDoc,
  deleteDoc,
  doc,
  Timestamp,
  WriteBatch,
  writeBatch,
} from "firebase/firestore/lite";
import { db } from "../../database/firebase.db";

export const updatePlayersFirebase = async (players) => {
  try {
    const batch = writeBatch(db);
    players.forEach((player) => {
      setDoc(doc(db, "players", player.id), player);
    });
    // await setDoc(doc(db, "matches", scoreboard.matchId), data);
    // Commit the batch
    await batch.commit();
  } catch (err) {
    alert(err);
  }
};

// export const updatePlayersFB = (players) => {
//   const playerIds = players.map(player => player.id);
//   db.collection("players")
//     .where("uid", "in", playerIds)
//     .get()
//     .then(async (snapshots) => {
//       const updates = [];
//       snapshots.forEach((doc) =>
//         updates.push(
//           doc.ref.update({
//             username: username,
//           })
//         )
//       );
//       await Promise.all(updates);
//     });
// }

// export const updatePlayersDB = async (players) => {
//   // Create a reference to the SF doc.
//   const sfDocRef = doc(db, "players");

//   try {
//     const newPopulation = await runTransaction(db, async (transaction) => {
//       const sfDoc = await transaction.get(sfDocRef);
//       if (!sfDoc.exists()) {
//         throw "Document does not exist!";
//       }

//       const newPop = sfDoc.data().population + 1;
//       if (newPop <= 1000000) {
//         transaction.update(sfDocRef, { population: newPop });
//         return newPop;
//       } else {
//         return Promise.reject("Sorry! Population is too big");
//       }
//     });

//     console.log("Population increased to ", newPopulation);
//   } catch (e) {
//     // This will be a "population is too big" error.
//     console.error(e);
//   }
// };
