import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Button, Card, Checkbox, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import {
  Exam,
  examDateLeftString,
  examDateString,
  getExams,
  getHomeworks,
  getTodayLectures,
  getTomorrowLectures,
  getUnfinishedExams,
  getUnfinishedHomeworks,
  Homework,
  homeworkDateLeftString,
  homeworkDeadlineString,
  Lecture,
  lectureDateString
} from "@/models/course";

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

  const CourseCard = ({ lecture }: { lecture: Lecture }) => {
    return (
      <View style={styles.horizontal}>
        <View style={styles.verticalBar} />
        <View style={styles.flexItem}>
          <Text variant="bodyLarge">{lecture!.name}</Text>
          <Text variant="bodySmall">{lecture!.location}</Text>
          <Text variant="bodySmall">{lectureDateString(lecture!)}</Text>
        </View>
      </View>
    );
  };

  const CurriculumCard = ({ type = "today" }: { type: "today" | "tomorrow" }) => {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (type === "today") {
        getTodayLectures().then((lectures) => {
          setLectures(lectures);
          setLoading(false);
        });
      }
      if (type === "tomorrow") {
        getTomorrowLectures().then((lectures) => {
          setLectures(lectures);
          setLoading(false);
        });
      }
    }, []);

    const title = type === "today" ? "Today" : "Tomorrow";

    return (
      <Card>
        <Card.Title titleVariant={"titleMedium"} title={title} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator />
          ) : (
            lectures.length === 0 ? (
              <Text>No lectures</Text>
            ) : (
              <View style={{ gap: 10 }}>
                {lectures.map((lecture, index) => (
                  <CourseCard key={index} lecture={lecture} />
                ))}
              </View>
            )
          )}
        </Card.Content>
      </Card>
    );
  };

  const SingleExamCard = ({ exam }: { exam: Exam }) => {
    return (
      <View style={{ ...styles.horizontal, alignItems: "flex-end" }}>
        <View style={styles.verticalBar} />
        <View style={styles.flexItem}>
          <Text variant="bodyLarge">{`${exam.name} - ${exam.examType}`}</Text>
          <Text variant="bodySmall">{exam.location}</Text>
          <Text variant="bodySmall">{examDateString(exam)}</Text>
        </View>
        <Text variant="bodyLarge">{examDateLeftString(exam)}</Text>
      </View>
    );
  };

  const ExamCard = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFinished, setShowFinished] = useState(false);

    useEffect(() => {
      getUnfinishedExams().then((exams) => {
        setExams(exams);
        setLoading(false);
      });
    }, []);

    return (
      <Card>
        <Card.Title titleVariant="titleMedium" title={"Exam"} right={() => {
          return <Button
            mode="text"
            compact={true}
            icon={showFinished ? "eye-off" : "eye"}
            onPress={() => {
              setLoading(true);
              if (!showFinished) {
                getExams().then((exams) => {
                  setExams(exams);
                  setShowFinished(!showFinished);
                  setLoading(false);
                });
              } else {
                getUnfinishedExams().then((exams) => {
                  setExams(exams);
                  setShowFinished(!showFinished);
                  setLoading(false);
                });
              }
            }}
          >
            {showFinished ? "Hide finished" : "Show finished"}
          </Button>;
        }} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator />
          ) : (
            exams.length === 0 ? (
              <Text>No exams</Text>
            ) : (
              <View style={{ gap: 10 }}>
                {exams.map((exam, index) => (
                  <SingleExamCard key={index} exam={exam} />
                ))}
              </View>
            )
          )}
        </Card.Content>
      </Card>
    );
  };

  // const SingleHomeworkCard = () => {
  //   return (
  //     <View style={{ ...styles.horizontal, alignItems: "flex-end" }}>
  //       <View style={styles.verticalBar} />
  //       <View style={{ ...styles.flexItem }}>
  //         <Text variant="bodyLarge">数学分析 作业 1</Text>
  //         <Text variant="bodySmall" numberOfLines={1}>DDL: 07-04 08:30 - 11:45</Text>
  //       </View>
  //       <Text variant="bodyLarge">3 days left</Text>
  //     </View>
  //   );
  // };
  //
  // const HomeworkCard = () => {
  //   return (
  //     <Card>
  //       <Card.Title titleVariant={"titleMedium"} title={"Homework"} />
  //       <Card.Content>
  //         <View style={{ gap: 10 }}>
  //           <SingleHomeworkCard />
  //           <SingleHomeworkCard />
  //           <SingleHomeworkCard />
  //         </View>
  //       </Card.Content>
  //     </Card>
  //   );
  // };

  const SingleHomeworkCard = ({ homework }: { homework: Homework }) => {
    return (
      <View style={{ ...styles.horizontal, alignItems: "flex-end" }}>
        <View style={styles.verticalBar} />
        <View style={{ ...styles.flexItem }}>
          <Text variant="bodyLarge">{homework.name}</Text>
          <Text variant="bodySmall" numberOfLines={1}>{`DDL: ${homeworkDeadlineString(homework)}`}</Text>
        </View>
        <Text variant="bodyLarge">{homeworkDateLeftString(homework)}</Text>
      </View>
    );
  };

  const HomeworkCard = () => {
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [loading, setLoading] = useState(true);
    const [showOverdue, setShowOverdue] = useState(false);

    useEffect(() => {
      getUnfinishedHomeworks().then((homeworks) => {
        setHomeworks(homeworks);
        setLoading(false);
      });
    }, []);

    return (
      <Card>
        <Card.Title titleVariant="titleMedium" title="Homework" right={() => {
          return <Button
            mode="text"
            compact={true}
            icon={showOverdue ? "eye-off" : "eye"}
            onPress={() => {
              setLoading(true);
              if (!showOverdue) {
                getHomeworks().then((homeworks) => {
                  setHomeworks(homeworks);
                  setShowOverdue(!showOverdue);
                  setLoading(false);
                });
              } else {
                getUnfinishedHomeworks().then((homeworks) => {
                  setHomeworks(homeworks);
                  setShowOverdue(!showOverdue);
                  setLoading(false);
                });
              }
            }}
          >
            {showOverdue ? "Hide overdue" : "Show overdue"}
          </Button>;
        }} />
        <Card.Content>
          {loading ? (
            <ActivityIndicator />
          ) : (
            homeworks.length === 0 ? (
              <Text>No homework</Text>
            ) : (
              <View style={{ gap: 10 }}>
                {homeworks.map((homework, index) => (
                  <SingleHomeworkCard key={index} homework={homework} />
                ))}
              </View>
            )
          )}
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
                  <CurriculumCard type="today" />
                </View>
                <View style={styles.flexItem}>
                  <CurriculumCard type="tomorrow" />
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
