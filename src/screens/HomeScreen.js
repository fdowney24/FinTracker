import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { COLORS, SIZES, formatCurrency, formatDate } from '../theme';

export default function HomeScreen({ navigation }) {
  const { getTransactions, getMonthlySummary } = useTransactions();

  const allTransactions = getTransactions();
  const recent = allTransactions.slice(0, 5);

  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthlySummary = getMonthlySummary();
  const thisMonth = monthlySummary.find(m => m.month === currentMonth) ?? { income: 0, expense: 0 };
  const net = thisMonth.income - thisMonth.expense;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
            <Text style={styles.appName}>FinTracker</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>This Month's Balance</Text>
          <Text style={[styles.balanceAmount, { color: net >= 0 ? '#A7F3D0' : '#FCA5A5' }]}>
            {net >= 0 ? '+' : ''}{formatCurrency(net)}
          </Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Ionicons name="arrow-up-circle" size={16} color="#A7F3D0" />
              <Text style={styles.balanceStatLabel}>Income</Text>
              <Text style={[styles.balanceStatValue, { color: '#A7F3D0' }]}>
                {formatCurrency(thisMonth.income)}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <Ionicons name="arrow-down-circle" size={16} color="#FCA5A5" />
              <Text style={styles.balanceStatLabel}>Expenses</Text>
              <Text style={[styles.balanceStatValue, { color: '#FCA5A5' }]}>
                {formatCurrency(thisMonth.expense)}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recent.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={40} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubText}>Tap + to add your first one</Text>
            </View>
          ) : (
            recent.map((tx, index) => (
              <TouchableOpacity
                key={tx.id}
                style={[styles.txItem, index < recent.length - 1 && styles.txBorder]}
                onPress={() => navigation.navigate('EditTransaction', { transaction: tx })}
              >
                <View style={[styles.txIcon, { backgroundColor: tx.category.color + '22' }]}>
                  <Text style={styles.txEmoji}>{tx.category.icon}</Text>
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txDesc}>{tx.description}</Text>
                  <Text style={styles.txMeta}>{tx.category.name} · {formatDate(tx.date)}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? COLORS.income : COLORS.expense }]}>
                  {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: SIZES.padding },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  greeting: { fontSize: 13, color: COLORS.textSecondary },
  appName: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  balanceAmount: { fontSize: 36, fontWeight: '700', marginVertical: 4 },
  balanceRow: { flexDirection: 'row', marginTop: 8 },
  balanceStat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  balanceDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 8 },
  balanceStatLabel: { flex: 1, color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  balanceStatValue: { fontWeight: '600', fontSize: 14 },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  seeAll: { color: COLORS.primary, fontSize: 13 },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txIcon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  txEmoji: { fontSize: 20 },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  txMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '500', color: COLORS.textSecondary },
  emptySubText: { fontSize: 13, color: COLORS.textSecondary },
});
