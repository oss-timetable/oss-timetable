import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function TabTwoScreen() {
  const colors = useTheme().colors;
  const [value, setValue] = useState("curriculum");

  const styles = StyleSheet.create({
    background: {
      backgroundColor: colors.background,
      flex: 1
    },
    container: {
      flex: 1,
      paddingHorizontal: 10
    },
    title: {
      paddingVertical: 10,
      fontWeight: "bold"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "flex-start"
    }
  });
  const buttons = [
    {
      icon: "calendar-month",
      value: "curriculum"
    },
    {
      icon: "card-bulleted",
      value: "exam"
    },
    {
      icon: "format-list-bulleted-type",
      value: "homework"
    },
    {
      icon: "newspaper-variant-outline",
      value: "feed"
    }
  ];

  const CourseCard = () => {
    return (
      <Card mode="outlined">
        <Card.Title titleVariant={"titleMedium"} title={"数学分析"} />
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <Text variant={"headlineSmall"}>09:45 - 11:20</Text>
            <View style={{ flex: 1 }} />
            <Text variant={"headlineSmall"}>5103</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const ExamCard = () => {
    return (
      <Card mode="contained">
        <Card.Title titleVariant={"titleMedium"} title={"数学分析 - 期中考试"} />
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <Text variant={"headlineSmall"}>09:45 - 11:20</Text>
            <View style={{ flex: 1 }} />
            <Text variant={"headlineSmall"}>5103</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const HomeworkCard = () => {
    return (
      <Card mode="elevated">
        <Card.Title titleVariant={"titleMedium"} title={"数学分析 - Homework 1"} />
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <Text variant={"bodyLarge"}>作业内容: ???</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button icon="trash-can-outline" onPress={() => {
            console.log("Delete");
          }}>Delete</Button>
        </Card.Actions>
      </Card>
    );
  };

  const SectView = ({ defaultExpanded = false }: { defaultExpanded?: boolean }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
      <View style={{ gap: 20 }}>
        <Card mode="outlined">
          <Card.Title
            titleVariant="headlineSmall"
            title="Today"
            subtitle="2024-07-07"
            right={() => <IconButton size={35} style={{ marginRight: 20 }} icon="dots-horizontal" onPress={() => {
              setExpanded(!expanded);
            }} />}
          />
        </Card>
        {expanded && (
          <View style={{ ...styles.horizontal }}>
            <View style={{ width: 10, backgroundColor: colors.onSurfaceDisabled, marginRight: 15, borderRadius: 20 }}>
            </View>
            <View style={{ flex: 1, gap: 20 }}>
              <CourseCard />
              <CourseCard />
              <ExamCard />
              <HomeworkCard />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.background} edges={["top"]}>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Explore</Text>


        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ gap: 20, flex: 1 }}>
            <SectView defaultExpanded={true} />
            <SectView />

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>

        <View style={{ paddingBottom: 10 }}>
          <SegmentedButtons
            value={value}

            onValueChange={setValue}
            buttons={buttons}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
