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
  Snackbar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const defaultTheme = createTheme();

export default function UserProfile() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false); // New state variable to control Snackbar display

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let tempErrors = {};
    let valid = true;
    if (!form.firstname) {
      tempErrors.firstname = "First name is required";
      valid = false;
    }
    if (!form.lastname) {
      tempErrors.lastname = "Last name is required";
      valid = false;
    }
    if (!form.email) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      tempErrors.email = "Email format is incorrect";
      valid = false;
    }
    if (!form.password) {
      tempErrors.password = "Password is required";
      valid = false;
    } else if (
      form.password.length < 8 ||
      !/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(form.password)
    ) {
      tempErrors.password =
        "Password must be at least 8 characters long and include both letters and numbers";
      valid = false;
    }
    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      console.log(form);
      const response = await fetch(
        "http://localhost:3001/api/v1/user/register",
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }

      );

      const result = await response.json();
      if (result.code === 201) {
        setOpenSnackbar(true); // Set the Snackbar to open
        setTimeout(() => {
          router.push("/signin"); // Delayed jump
        }, 1000); // Jump in 1 seconds
      } else {
        throw new Error(result.msg);
      }
    } catch (error) {
      const errorMessage = error.message.includes("duplicate key error")
        ? "Email already registered. Please sign in."
        : error.message;
      setErrors((prev) => ({ ...prev, api: errorMessage }));
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
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              {errors.api && <Alert severity="error">{errors.api}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstname"
                    required
                    fullWidth
                    id="firstname"
                    label="First Name"
                    autoFocus
                    value={form.firstname}
                    onChange={handleChange}
                    error={!!errors.firstname}
                    helperText={errors.firstname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    autoComplete="family-name"
                    value={form.lastname}
                    onChange={handleChange}
                    error={!!errors.lastname}
                    helperText={errors.lastname}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" passHref>
                    <Typography variant="body2">
                      Already have an account? Sign in
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Registration successful!
        </Alert>
      </Snackbar>
    </>
  );
}
