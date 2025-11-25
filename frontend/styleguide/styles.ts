import { StyleSheet } from 'react-native'
import COLORS from './colors'
import TYPOGRAPHY from './typgraphy';
import SPACING from './spacing'


const styles = StyleSheet.create({
 

  // ===== SCREEN LAYOUT =====
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.lightBg,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },

  // ===== FORM =====
  form: {
    width: '100%',
    marginBottom: SPACING.lg,
  },

  label: {

  },

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: "row", // Arrange items horizontally
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  listContainer: {
    paddingBottom: SPACING.lg,
  },
  itemContainer: {
    backgroundColor: COLORS.lightBg,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkText,
  },
  stats: {
    fontSize: 14,
    paddingLeft: SPACING.md,
    color: COLORS.lightText
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
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.md
  },
  gameSelectionButton: {
    height: 100,
    width: 100,
    borderRadius: 15,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.md
  },
});

export default styles;