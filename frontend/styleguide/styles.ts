import { StyleSheet } from 'react-native'
import COLORS from './colors'
import TYPOGRAPHY from './typgraphy';
import SPACING from './spacing'


const styles = StyleSheet.create({
 

  // ===== SCREEN LAYOUT =====
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },

  // ===== FORM =====
  form: {
    width: '100%',
    marginBottom: SPACING.lg,
  },

  // ===== BODY =====
  body: {

  },

  // ===== LABEL ====
  label: {

  },

  // ===== INPUT =====
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontSize: 14,
    color: COLORS.darkText,
  },

  // ===== BUTTONS =====
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.md
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
});

export default styles;