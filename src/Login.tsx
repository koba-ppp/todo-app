import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { Button, FormControl, TextField, Typography } from "@material-ui/core";
import { auth } from "./firebase";

const Login: React.FC = (props: any) => {
  //routerのhistoryという属性にアクセスすることができる。ページの履歴を記録してる。

  const [isLogin, setIsLogin] = useState(true); //ログインしている時はtrue,してない時はfalse
  const [email, setEmail] = useState(""); //emailを入力してもらうときのステイト
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      if (user) {
        props.history.push("/");
      }
      return () => unSub();
    }); //ログイン関係に変化があった時にその都度呼び出されるメソッド
  }, [props.history]);

  return (
    <div className={styles.login__root}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="email"
          label="E-mail"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </FormControl>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="password"
          label="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </FormControl>
      <br />
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={
          isLogin
            ? async () => {
                try {
                  await auth.signInWithEmailAndPassword(email, password);
                  props.history.push("/");
                } catch (error) {
                  alert(error.message);
                }
              }
            : async () => {
                try {
                  await auth.createUserWithEmailAndPassword(email, password);
                  props.history.push("/");
                } catch (error) {
                  alert(error.message);
                }
              }
        }
      >
        {isLogin ? "login" : "register"}
      </Button>
      <br />
      <Typography align="center">
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account ?" : "Back to login"}
        </span>
      </Typography>
    </div>
  );
};

export default Login;
