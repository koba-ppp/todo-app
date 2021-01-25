import { FormControl, List, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { db } from "./firebase";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";
import { auth } from "./firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});

const App: React.FC = (props: any) => {
  //Qなんでpropsを受け取ってるのか？ A
  const [tasks, setTasks] = useState([{ id: "", title: "" }]); //複数のオブジェクトを内包した配列
  const [input, setInput] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      //onAuthStateChangedで認証関係に変化があった時にユーザーの情報をとってくる
      !user && props.history.push("login");
    });
    return () => unSub(); //useEffectではマウント時に実行した処理をアンマウント時に解除する処理が必要となる
  }, [props.history]);
  //useEffectに渡された関数はレンダーの結果が画面に反映された後に動作する
  //つまり上の関数はレンダーの結果が画面に反映された後に認証関係に変化があったかを調べて

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    }); //データベースに何らかの変化があったときにsnapshotが起動して内容を取得してくれる
    return () => unSub();
  }, []);

  const newTask = (e: React.DOMAttributes<HTMLButtonElement>) => {
    db.collection("tasks").add({ title: input });
    setInput("");
  };

  return (
    <div className={styles.app_root}>
      <h1>Todo App by React/Firebase</h1>
      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            await auth.signOut();
            props.history.push("login");
          } catch (error) {
            alert(error.message);
          }
        }}
      >
        <ExitToAppIcon />
      </button>
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          className={classes.field}
          label="New task ?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button disabled={!input} onClick={newTask} className={styles.app_icon}>
        <AddToPhotosIcon />
      </button>
      <List className={classes.field}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};

export default App;
