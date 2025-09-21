// src/Login.js
import React, { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";

export default function Login({ goToTest }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // 🔐 Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
      goToTest(); // ✅ Redirect to Personality Test
    } catch (error) {
      alert("❌ Login error: " + error.message);
    }
  };

  // 📝 Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("🎉 Signup successful! You can now login.");
      setIsNewUser(false); // Switch to login view
    } catch (error) {
      alert("❌ Signup error: " + error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {isNewUser ? "Sign Up" : "Login"}
        </Typography>

        <form onSubmit={isNewUser ? handleSignup : handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            {isNewUser ? "Sign Up" : "Login"}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            {isNewUser ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsNewUser(!isNewUser)}
            >
              {isNewUser ? "Login here" : "Sign up here"}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
