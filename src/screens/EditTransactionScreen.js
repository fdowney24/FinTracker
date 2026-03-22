import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { CATEGORIES } from '../data/data';
import { COLORS, SIZES } from '../theme';

//   UPDATE transactions SET amount=?, description=?, categoryId=?, date=?, type=? WHERE id = ?
//   DELETE FROM transactions WHERE id = ?  (with cascade note)

export default function EditTransactionScreen({ navigation, route }) {
  const { transaction } = route.params;
  const { updateTransaction, deleteTransaction } = useTransactions();

  const [type, setType] = useState(transaction.type);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [description, setDescription] = useState(transaction.description);
  const [categoryId, setCategoryId] = useState(transaction.categoryId);
  const [date, setDate] = useState(transaction.date);

  const filteredCategories = CATEGORIES.filter(c => c.type === type);

  function handleTypeChange(newType) {
    setType(newType);
    const first = CATEGORIES.find(c => c.type === newType);
    if (first) setCategoryId(first.id);
  }

  function handleSave() {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Invalid Date', 'Date must be in YYYY-MM-DD format (e.g. 2026-03-22).');
      return;
    }

    updateTransaction(transaction.id, {
      amount: parsed, description: description.trim(), categoryId, date, type,
    });
    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert(
      'Delete Transaction',
      `Delete "${description}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(transaction.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

          {/* Type toggle */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'expense' && { backgroundColor: COLORS.expense }]}
              onPress={() => handleTypeChange('expense')}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={18}
                color={type === 'expense' ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.typeBtnText, type === 'expense' && { color: COLORS.white }]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'income' && { backgroundColor: COLORS.income }]}
              onPress={() => handleTypeChange('income')}
            >
              <Ionicons
                name="arrow-up-circle-outline"
                size={18}
                color={type === 'income' ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.typeBtnText, type === 'income' && { color: COLORS.white }]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <View style={styles.field}>
            <Text style={styles.label}>Amount (€)</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={COLORS.textSecondary}
              returnKeyType="done"
            />
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categories}>
              {filteredCategories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    { borderColor: cat.color },
                    categoryId === cat.id && { backgroundColor: cat.color },
                  ]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catName, categoryId === cat.id && { color: COLORS.white }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} style={styles.dateIcon} />
              <TextInput
                style={styles.dateInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={COLORS.expense} />
            <Text style={styles.deleteBtnText}>Delete Transaction</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SIZES.padding },
  typeToggle: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderRadius: SIZES.radius, padding: 4, marginBottom: SIZES.padding, gap: 4,
  },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: SIZES.radiusSm, gap: 6,
  },
  typeBtnText: { fontWeight: '600', color: COLORS.textSecondary, fontSize: 15 },
  field: { marginBottom: SIZES.padding },
  label: {
    fontSize: 12, fontWeight: '600', color: COLORS.textSecondary,
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  amountInput: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 28, fontWeight: '700', color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, gap: 4, backgroundColor: COLORS.card,
  },
  catIcon: { fontSize: 14 },
  catName: { fontSize: 13, fontWeight: '500', color: COLORS.text },
  dateRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: SIZES.radius,
    borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14,
  },
  dateIcon: { marginRight: 8 },
  dateInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: COLORS.text },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 12,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, gap: 8, marginBottom: 40,
  },
  deleteBtnText: { color: COLORS.expense, fontSize: 15, fontWeight: '600' },
});
