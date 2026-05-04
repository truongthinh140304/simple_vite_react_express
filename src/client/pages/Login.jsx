import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../services/auth";
import { useAppContext } from "../context";

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useAppContext();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const { token, user } = await login(form.email, form.password);
            setAuth(user, token);
            navigate("/");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Không thể đăng nhập");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 4,
                background:
                    "radial-gradient(circle at top left, rgba(170, 199, 255, 0.35), transparent 35%), radial-gradient(circle at bottom right, rgba(190, 198, 220, 0.35), transparent 30%), linear-gradient(180deg, #f7f9ff 0%, #eef3ff 100%)",
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={10}
                    sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.55)",
                    }}
                >
                    <Box
                        sx={{
                            px: 4,
                            py: 4,
                            background:
                                "linear-gradient(135deg, rgba(123,156,255,0.18) 0%, rgba(222,229,255,0.8) 100%)",
                            borderBottom: "1px solid rgba(0,0,0,0.06)",
                        }}
                    >

                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 1, textAlign: "center" }}>
                            Đăng nhập
                        </Typography>

                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        {errorMessage ? (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {errorMessage}
                            </Alert>
                        ) : null}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="Nhập email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                name="password"
                                type={showPassword ? "text" : "password"}
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                value={form.password}
                                onChange={handleChange}
                                fullWidth
                                required
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    py: 1.4,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    boxShadow: "0 12px 24px rgba(123, 156, 255, 0.28)",
                                }}
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }}>hoặc</Divider>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Chưa có tài khoản?
                            </Typography>
                            <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700 }}>
                                Tạo tài khoản mới
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;