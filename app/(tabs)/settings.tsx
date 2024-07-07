import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const colors = useTheme().colors;
  const styles = StyleSheet.create({
    background: {
      backgroundColor: colors.background,
      flex: 1
    },
    container: {
      flex: 1,
      paddingHorizontal: 10
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "flex-start"
    },
    horizontalWithGap: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: 10
    },
    flexItem: {
      flex: 1
    },
    title: {
      paddingVertical: 10,
      fontWeight: "bold"
    },
    verticalBar: {
      backgroundColor: colors.primary,
      width: 5,
      height: "100%",
      borderRadius: 5,
      marginRight: 10
    }
  });

  return (
    <SafeAreaView style={styles.background} edges={["top"]}>
      <View style={styles.container}>
        <Text>TBC</Text>
      </View>
    </SafeAreaView>
  );
}
