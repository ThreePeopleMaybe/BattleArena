import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { addToWallet, getWalletBalance } from '../storage/walletStorage';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, isLoggedIn, logout, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [addFundModalVisible, setAddFundModalVisible] = useState(false);
  const [addFundCustomAmount, setAddFundCustomAmount] = useState('');
  const [addFundPreset, setAddFundPreset] = useState<number | null>(10);
  const [linkAccountModalVisible, setLinkAccountModalVisible] = useState(false);
  const [linkAccountType, setLinkAccountType] = useState<'venmo' | 'bank'>('venmo');
  const [linkAccountVenmoUser, setLinkAccountVenmoUser] = useState('');
  const [linkAccountBankName, setLinkAccountBankName] = useState('');
  const [linkAccountRouting, setLinkAccountRouting] = useState('');
  const [linkAccountAccountNumber, setLinkAccountAccountNumber] = useState('');

  const ADD_FUND_PRESETS = [25, 50, 100];

  useEffect(() => {
    let cancelled = false;
    getWalletBalance().then((b) => {
      if (!cancelled) setWalletBalance(b);
    });
    return () => { cancelled = true; };
  }, []);

  const handleAddFunds = async (amount: number) => {
    const newBalance = await addToWallet(amount);
    setWalletBalance(newBalance);
  };

  const openAddFundModal = () => {
    setAddFundCustomAmount('');
    setAddFundPreset(10);
    setAddFundModalVisible(true);
  };

  const openLinkAccountModal = () => {
    setLinkAccountType('venmo');
    setLinkAccountVenmoUser('');
    setLinkAccountBankName('');
    setLinkAccountRouting('');
    setLinkAccountAccountNumber('');
    setLinkAccountModalVisible(true);
  };

  const closeLinkAccountModal = () => {
    setLinkAccountModalVisible(false);
  };

  const handleLinkAccountSubmit = () => {
    if (linkAccountType === 'venmo') {
      if (!linkAccountVenmoUser.trim()) {
        Alert.alert('Missing info', 'Please enter your Venmo username or email.');
        return;
      }
      Alert.alert('Link account', `Venmo account (${linkAccountVenmoUser}) link requested. This feature will be available soon.`, [{ text: 'OK', onPress: closeLinkAccountModal }]);
    } else {
      if (!linkAccountBankName.trim() || !linkAccountRouting.trim() || !linkAccountAccountNumber.trim()) {
        Alert.alert('Missing info', 'Please fill in account holder name, routing number, and account number.');
        return;
      }
      Alert.alert('Link account', 'Bank account link requested. This feature will be available soon.', [{ text: 'OK', onPress: closeLinkAccountModal }]);
    }
  };

  const formatMoneyInput = (raw: string): string => {
    const digitsAndDot = raw.replace(/[^\d.]/g, '');
    const parts = digitsAndDot.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('').slice(0, 2);
    }
    if (parts.length === 2 && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    return digitsAndDot;
  };

  const formatWithCommas = (raw: string): string => {
    const stripped = raw.replace(/,/g, '');
    const parts = stripped.split('.');
    const intPart = parts[0] || '0';
    const decPart = parts[1]?.slice(0, 2) ?? '';
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart ? `${withCommas}.${decPart}` : withCommas;
  };

  const confirmAddFund = async () => {
    const amount = addFundCustomAmount.trim() !== ''
      ? parseFloat(addFundCustomAmount.replace(/,/g, ''))
      : addFundPreset;

    if (amount == null || Number.isNaN(amount) || amount <= 0) return;
    await handleAddFunds(amount);
    setAddFundModalVisible(false);
    setAddFundCustomAmount('');
  };

  const hasStoredPassword = isLoggedIn && user?.password != null && user.password !== '';

  const handleUpdatePassword = async () => {
    setPwError('');
    setPwSuccess(false);

    if (hasStoredPassword && !currentPassword) {
      setPwError('Please enter your current password.');
      return;
    }
    if (hasStoredPassword && user?.password !== currentPassword) {
      setPwError('Current password is incorrect.');
      return;
    }
    if (!newPassword) {
      setPwError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    const ok = await updatePassword(currentPassword, newPassword);
    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwSuccess(true);
    } else {
      setPwError('Failed to update password.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your stats and settings</Text>

        <View style={styles.card}>
          <View style={styles.walletRow}>
            <View>
              <Text style={styles.cardLabel}>Wallet</Text>
              <Text style={styles.cardValue}>
                {walletBalance !== null ? `$${walletBalance.toFixed(2)}` : '...'}
              </Text>
            </View>
            <View style={styles.walletButtonsRow}>
              <TouchableOpacity style={styles.addFundButton} onPress={openAddFundModal} activeOpacity={0.8}>
                <Text style={styles.addFundButtonText}>Add Fund</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkPaymentButton} onPress={openLinkAccountModal} activeOpacity={0.8}>
                <Text style={styles.linkPaymentButtonText}>Link Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          visible={addFundModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAddFundModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setAddFundModalVisible(false)}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Add fund</Text>
              <Text style={styles.modalLabel}>Preset amount</Text>
              <View style={styles.modalChips}>
                {ADD_FUND_PRESETS.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.presetChip,
                      (addFundPreset === amount || (addFundCustomAmount !== '' && parseFloat(addFundCustomAmount.replace(/,/g, '')) === amount)) && styles.presetChipSelected
                    ]}
                    onPress={() => {
                      setAddFundPreset(amount);
                      setAddFundCustomAmount(formatWithCommas(String(amount)));
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.presetChipText,
                      (addFundPreset === amount || (addFundCustomAmount !== '' && parseFloat(addFundCustomAmount.replace(/,/g, '')) === amount)) && styles.presetChipTextSelected
                    ]}>
                      ${amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modalLabel}>Or enter amount</Text>
              <View style={styles.moneyInputWrapper}>
                <Text style={styles.moneyInputPrefix}>$</Text>
                <TextInput
                  style={styles.moneyInput}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textMuted}
                  value={addFundCustomAmount}
                  onChangeText={(t) => {
                    const raw = formatMoneyInput(t);
                    setAddFundCustomAmount(formatWithCommas(raw));
                    setAddFundPreset(null);
                  }}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[globalStyles.secondaryButton, styles.modalActionButton, styles.compactButton]}
                  onPress={() => setAddFundModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[globalStyles.secondaryButtonText, styles.modalActionButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.primaryButton, styles.modalActionButton, styles.compactButton]}
                  onPress={confirmAddFund}
                  activeOpacity={0.8}
                >
                  <Text style={[globalStyles.primaryButtonText, styles.modalActionButtonText]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal
          visible={linkAccountModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeLinkAccountModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeLinkAccountModal}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Link Venmo account</Text>
              <Text style={styles.modalLabel}>Venmo username or email</Text>
              <TextInput
                style={[globalStyles.input, styles.compactInput]}
                placeholder="username or email"
                placeholderTextColor={theme.colors.textMuted}
                value={linkAccountVenmoUser}
                onChangeText={setLinkAccountVenmoUser}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[globalStyles.secondaryButton, styles.modalActionButton, styles.compactButton]}
                  onPress={closeLinkAccountModal}
                  activeOpacity={0.8}
                >
                  <Text style={[globalStyles.secondaryButtonText, styles.modalActionButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.primaryButton, styles.modalActionButton, styles.compactButton]}
                  onPress={handleLinkAccountSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={[globalStyles.primaryButtonText, styles.modalActionButtonText]}>Link account</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardValue}>{isLoggedIn && user ? user.email : 'Not signed in'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Battles played</Text>
          <Text style={styles.cardValue}>-</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Quizzes completed</Text>
          <Text style={styles.cardValue}>-</Text>
        </View>

        {isLoggedIn && (
          <View style={styles.passwordSection}>
            <Text style={styles.sectionTitle}>Update password</Text>
            {pwError ? <Text style={globalStyles.errorText}>{pwError}</Text> : null}
            {pwSuccess ? <Text style={globalStyles.successText}>Password updated.</Text> : null}
            {hasStoredPassword && (
              <TextInput
                style={[globalStyles.input, styles.compactInput]}
                placeholder="Current password"
                placeholderTextColor={theme.colors.textMuted}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            )}
            <TextInput
              style={[globalStyles.input, styles.compactInput]}
              placeholder="New password"
              placeholderTextColor={theme.colors.textMuted}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={[globalStyles.input, styles.compactInput]}
              placeholder="Confirm new password"
              placeholderTextColor={theme.colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={[globalStyles.secondaryButton, styles.compactButton]}
              onPress={handleUpdatePassword}
              activeOpacity={0.8}
            >
              <Text style={[globalStyles.secondaryButtonText, styles.compactButtonText]}>
                {hasStoredPassword ? 'Update password' : 'Set password'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoggedIn ? (
          <TouchableOpacity
            style={[globalStyles.primaryButton, styles.compactButton, styles.primaryButtonMargin]}
            onPress={() => logout().then(() => navigation.navigate('Home'))}
            activeOpacity={0.8}
          >
            <Text style={[globalStyles.primaryButtonText, styles.compactButtonText]}>Log out</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[globalStyles.primaryButton, styles.compactButton, styles.primaryButtonMargin]}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={[globalStyles.primaryButtonText, styles.compactButtonText]}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.secondaryButton, styles.compactButton, styles.secondaryButtonMargin]}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.8}
            >
              <Text style={[globalStyles.secondaryButtonText, styles.compactButtonText]}>Sign up</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  avatarText: {
    fontSize: 28,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  cardLabel: {
    fontSize: theme.fontSize.sm,
    marginBottom: 2,
    color: theme.colors.textMuted,
  },
  cardValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  addFundButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  addFundButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  linkPaymentButton: {
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  linkPaymentButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    width: '100%',
    maxWidth: 280,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  modalTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  moneyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
    marginBottom: theme.spacing.sm,
  },
  moneyInputPrefix: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    paddingLeft: theme.spacing.sm,
  },
  moneyInput: {
    flex: 1,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  modalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  presetChip: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  presetChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  presetChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  presetChipTextSelected: {
    color: theme.colors.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  modalActionButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  modalActionButtonText: {
    fontSize: 12,
  },
  compactInput: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
  },
  compactButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  compactButtonText: {
    fontSize: theme.fontSize.sm,
  },
  primaryButtonMargin: { marginTop: theme.spacing.md },
  secondaryButtonMargin: { marginTop: theme.spacing.xs },
  passwordSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
});

