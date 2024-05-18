import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  createTheme,
  ThemeProvider,
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useUser } from "../contexts/UserContext";

const defaultTheme = createTheme();

export default function SignIn() {
  const { setUser } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email").trim();
    const password = data.get("password").trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError("Email and password cannot be empty.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email format. Please enter a correct email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/v1/user/login", {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setUser({
          userId: result.userId,
          isAdmin: result.isAdmin,
          username: result.username,
          email: result.email,
        });
        setSuccessMessage("Login successful! Welcome back.");
        setError("");
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        if (result.code === 402) {
          setError("Incorrect password or email. Please try again.");
        } else if (result.code === 401) {
          setError("Account not found. Please check your email or sign up.");
        } else {
          setError("An error occurred during login. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Failed to login:", error);
      setError("Network error or server is unreachable.");
    }
  };

  return (
    <>
      <div className="background background-image-blur-whitewash"></div>
      <header className="top-bar">
        <h1>Cartoonopia</h1>
        <p>The home of characters and cartoons!</p>
      </header>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {error && (
                <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
                  {successMessage}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/signup" passHref>
                    <Typography variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
