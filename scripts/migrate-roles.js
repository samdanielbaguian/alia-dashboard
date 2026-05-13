/**
 * Script de migration MongoDB — Normalisation des rôles utilisateurs
 * Exécuter avec: node scripts/migrate-roles.js
 * Ou coller directement dans MongoDB Compass > Shell
 *
 * Rôles officiels Alia: "merchant" | "buyer"
 * Rôles obsolètes à migrer: "customer", "client", "user", "buyer_old"
 */

// ─── 1. Voir tous les rôles existants ────────────────────────────────────────
db.users.aggregate([
  { $group: { _id: '$role', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);

// ─── 2. Migrer les rôles obsolètes vers "buyer" ───────────────────────────────
const migrationResult = db.users.updateMany(
  { role: { $in: ['customer', 'client', 'user', 'buyer_old'] } },
  { $set: { role: 'buyer' } }
);
print(`✅ Migration: ${migrationResult.modifiedCount} utilisateur(s) mis à jour`);

// ─── 3. Vérifier qu'il ne reste que "merchant" et "buyer" ─────────────────────
const remainingRoles = db.users.distinct('role');
const invalidRoles = remainingRoles.filter((r) => r !== 'merchant' && r !== 'buyer');
if (invalidRoles.length > 0) {
  print('❌ Rôles invalides encore présents: ' + invalidRoles.join(', '));
} else {
  print('✅ Tous les rôles sont valides: ' + remainingRoles.join(', '));
}

// ─── 4. Supprimer les merchants orphelins (user_id sans User correspondant) ───
const validUserIds = db.users.distinct('_id').map((id) => id.toString());
const orphanResult = db.merchants.deleteMany({
  user_id: { $nin: validUserIds },
});
print(`✅ Merchants orphelins supprimés: ${orphanResult.deletedCount}`);

// ─── 5. Créer les index manquants ─────────────────────────────────────────────
db.users.createIndex({ email: 1 }, { unique: true, name: 'email_unique' });
db.merchants.createIndex({ user_id: 1 }, { unique: true, name: 'user_id_unique' });
print('✅ Index créés: email (unique) sur users, user_id (unique) sur merchants');

// ─── 6. Rapport final ─────────────────────────────────────────────────────────
print('\n=== RAPPORT FINAL ===');
db.users.aggregate([
  { $group: { _id: '$role', count: { $sum: 1 } } },
  { $sort: { _id: 1 } },
]).forEach((r) => print(`  ${r._id}: ${r.count} utilisateur(s)`));
