import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";

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

  const CourseCard = () => {
    return (
      <View style={styles.horizontal}>
        <View style={styles.verticalBar} />
        <View style={styles.flexItem}>
          <Text variant="bodySmall">课程名</Text>
          <Text variant="bodyLarge">5104 教师名</Text>
          <Text variant="bodySmall">08:30 - 11:45</Text>
        </View>
      </View>
    );
  };

  const CurriculumCard = ({ title = "Today" }: { title?: string }) => {
    return (
      <Card>
        <Card.Title titleVariant={"titleMedium"} title={title} />
        <Card.Content>
          <View style={{ gap: 10 }}>
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const ExamCard = () => {
    return (
      <Card>
        <Card.Title titleVariant={"titleMedium"} title={"Exams"} />
        <Card.Content>
          <View style={{ gap: 10 }}>
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const HomeworkCard = () => {
    return (
      <Card>
        <Card.Title titleVariant={"titleMedium"} title={"Homework"} />
        <Card.Content>
          <View style={{ gap: 10 }}>
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.background} edges={["top"]}>
      <View style={styles.container}>
        <View style={{ paddingBottom: 10 }}>
          <Text variant="headlineMedium" style={styles.title}>Home</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalWithGap}>
              <Button mode="outlined">Curriculum</Button>
              <Button mode="outlined">Exams</Button>
              <Button mode="outlined">Homeworks</Button>
              <Button mode="outlined">News</Button>
            </View>
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ gap: 20, flex: 1 }}>
            <View style={styles.horizontalWithGap}>
              <View style={styles.flexItem}>
                <CurriculumCard />
              </View>
              <View style={styles.flexItem}>
                <CurriculumCard title="Tomorrow" />
              </View>
            </View>

            <ExamCard />

            <HomeworkCard />

            <View style={{ height: 20 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
