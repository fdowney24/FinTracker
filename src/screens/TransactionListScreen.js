import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { COLORS, SIZES, formatCurrency, formatDate } from '../theme';

export default function TransactionListScreen({ navigation }) {
  // Re-render whenever this component is focused by pulling fresh data each render.
 
  const { getTransactions, deleteTransaction } = useTransactions();
  const transactions = getTransactions();

  // Track deletions locally so the list updates instantly
  const [, forceUpdate] = useState(0);

  function handleDelete(tx) {
    Alert.alert(
      'Delete Transaction',
      `Delete "${tx.description}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(tx.id);
            forceUpdate(n => n + 1);
          },
        },
      ]
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('EditTransaction', { transaction: item })}
      activeOpacity={0.7}
    >
      <View style={[styles.icon, { backgroundColor: item.category.color + '22' }]}>
        <Text style={styles.emoji}>{item.category.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.meta}>{item.category.name} · {formatDate(item.date)}</Text>
      </View>
      <Text style={[styles.amount, { color: item.type === 'income' ? COLORS.income : COLORS.expense }]}>
        {item.type === 'income' ? '+' : '−'}{formatCurrency(item.amount)}
      </Text>
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No transactions yet</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <Text style={styles.emptyBtnText}>Add your first transaction</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  list: { padding: SIZES.padding },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 14,
    gap: 12,
  },
  icon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 20 },
  info: { flex: 1 },
  desc: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '600' },
  deleteBtn: { padding: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '500' },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
  },
  emptyBtnText: { color: COLORS.white, fontWeight: '600' },
});
