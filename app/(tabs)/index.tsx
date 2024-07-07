import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Checkbox, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";

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
          <Text variant="bodyLarge">数学分析</Text>
          <Text variant="bodySmall">5104</Text>
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
          </View>
        </Card.Content>
      </Card>
    );
  };

  const SingleExamCard = () => {
    return (
      <View style={{ ...styles.horizontal, alignItems: "flex-end" }}>
        <View style={styles.verticalBar} />
        <View style={styles.flexItem}>
          <Text variant="bodyLarge">数学分析 期中考试</Text>
          <Text variant="bodySmall">5104</Text>
          <Text variant="bodySmall">07-04 08:30 - 11:45</Text>
        </View>
        <Text variant="bodyLarge">3 days left</Text>
      </View>
    );
  };

  const ExamCard = () => {
    return (
      <Card>
        <Card.Title titleVariant="titleLarge" title={"Exams"} />
        <Card.Content>
          <View style={{ gap: 10 }}>
            <SingleExamCard />
            <SingleExamCard />
            <SingleExamCard />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const SingleHomeworkCard = () => {
    return (
      <View style={{ ...styles.horizontal, alignItems: "flex-end" }}>
        <View style={styles.verticalBar} />
        <View style={{ ...styles.flexItem }}>
          <Text variant="bodyLarge">数学分析 作业 1</Text>
          <Text variant="bodySmall" numberOfLines={1}>DDL: 07-04 08:30 - 11:45</Text>
        </View>
        <Text variant="bodyLarge">3 days left</Text>
      </View>
    );
  };

  const HomeworkCard = () => {
    return (
      <Card>
        <Card.Title titleVariant={"titleLarge"} title={"Homework"} />
        <Card.Content>
          <View style={{ gap: 10 }}>
            <SingleHomeworkCard />
            <SingleHomeworkCard />
            <SingleHomeworkCard />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const [showMenu, setShowMenu] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(true);
  const [showExam, setShowExam] = useState(true);
  const [showHomework, setShowHomework] = useState(true);

  return (
    <SafeAreaView style={styles.background} edges={["top"]}>
      <View style={styles.container}>
        <View style={{ ...styles.horizontal, paddingBottom: 10, alignItems: "center" }}>
          <Text variant="headlineMedium" style={styles.title}>Home</Text>
          <View style={{ flex: 1 }} />
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor={
              <IconButton onPress={() => setShowMenu(true)} icon="format-list-bulleted" />
            }>
            <Checkbox.Item status={showCurriculum ? "checked" : "unchecked"} label="Curriculum"
                           onPress={() => setShowCurriculum(!showCurriculum)} />
            <Checkbox.Item status={showExam ? "checked" : "unchecked"} label="Exam"
                           onPress={() => setShowExam(!showExam)} />
            <Checkbox.Item status={showHomework ? "checked" : "unchecked"} label="Homework"
                           onPress={() => setShowHomework(!showHomework)} />
          </Menu>

        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ gap: 20, flex: 1 }}>

            {showCurriculum && (
              <View style={styles.horizontalWithGap}>
                <View style={styles.flexItem}>
                  <CurriculumCard />
                </View>
                <View style={styles.flexItem}>
                  <CurriculumCard title="Tomorrow" />
                </View>
              </View>
            )}

            {showExam && (<ExamCard />)}
            {showHomework && (<HomeworkCard />)}

            <View style={{ height: 20 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
