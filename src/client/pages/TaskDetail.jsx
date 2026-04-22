import React, { useMemo, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import FlagIcon from "@mui/icons-material/Flag";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UpdateIcon from "@mui/icons-material/Update";
import { tasksService } from "../services";

const STATUS_META = {
    TODO: { label: "To do", color: "default" },
    IN_PROGRESS: { label: "In progress", color: "info" },
    REVIEW: { label: "In review", color: "warning" },
    DONE: { label: "Done", color: "success" },
};

const PRIORITY_META = {
    LOW: { label: "Low", color: "default" },
    MEDIUM: { label: "Medium", color: "primary" },
    HIGH: { label: "High", color: "warning" },
    URGENT: { label: "Urgent", color: "error" },
    ULTRA: { label: "Ultra", color: "error" },
};

const formatDateTime = (value) => {
    if (!value) {
        return "Chua co";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Khong hop le";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const buildAssigneeName = (assignee) => {
    if (!assignee) {
        return "Chua gan";
    }

    const fullName = [assignee.firstName, assignee.lastName].filter(Boolean).join(" ").trim();
    return fullName || assignee.email || "Chua gan";
};

const DetailRow = ({ icon, label, value, children }) => (
    <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.8 }}>
            {icon}
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4, textTransform: "uppercase" }}>
                {label}
            </Typography>
        </Box>
        {children || (
            <Typography variant="body1" sx={{ pl: 4 }}>
                {value || "Chua co"}
            </Typography>
        )}
    </Box>
);

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const statusMeta = useMemo(() => STATUS_META[task?.status] || { label: task?.status || "Unknown", color: "default" }, [task?.status]);
    const priorityMeta = useMemo(() => PRIORITY_META[task?.priority] || { label: task?.priority || "Unknown", color: "default" }, [task?.priority]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setIsLoading(true);
                setError("");
                const response = await tasksService.getById(id);
                setTask(response.data || null);
            } catch (err) {
                console.error("Error fetching task details:", err);
                setError("Khong the tai thong tin task. Vui long thu lai.");
            }
            setIsLoading(false);
        };

        fetchTask();
    }, [id]);

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                    <Skeleton variant="text" width="35%" height={54} />
                    <Skeleton variant="text" width="22%" height={30} sx={{ mb: 2 }} />
                    <Skeleton variant="rounded" width="100%" height={180} />
                </Card>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!task) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="warning">Khong tim thay task.</Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                py: 4,
                background:
                    "radial-gradient(circle at top right, rgba(255, 198, 132, 0.2), transparent 38%), radial-gradient(circle at bottom left, rgba(97, 205, 255, 0.2), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #edf3fa 100%)",
            }}
        >
            <Container maxWidth="lg">
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        mb: 3,
                        border: "1px solid rgba(20, 45, 90, 0.12)",
                        background:
                            "linear-gradient(130deg, rgba(255,255,255,0.95) 0%, rgba(244,249,255,0.95) 100%)",
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }}>
                            <Avatar sx={{ bgcolor: "primary.main", width: 62, height: 62, boxShadow: "0 10px 24px rgba(0, 97, 255, 0.28)" }}>
                                <TaskAltIcon sx={{ fontSize: 34 }} />
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                                    {task.title || "Untitled task"}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", rowGap: 1 }}>
                                    <Chip label={`Task #${task.id}`} size="small" variant="outlined" />
                                    <Chip label={statusMeta.label} size="small" color={statusMeta.color} />
                                    <Chip label={`Priority: ${priorityMeta.label}`} size="small" color={priorityMeta.color} variant="outlined" />
                                </Stack>
                            </Box>

                            <Button component={RouterLink} to="/tasks" variant="outlined" sx={{ borderRadius: 999 }}>
                                Quay lai danh sach
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
                    <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                                Tong quan
                            </Typography>

                            <Stack spacing={2.5}>
                                <DetailRow icon={<DescriptionIcon fontSize="small" color="action" />} label="Mo ta" value={task.description || "Chua co mo ta"} />

                                <Divider />

                                <DetailRow
                                    icon={<PersonOutlineIcon fontSize="small" color="action" />}
                                    label="Nguoi duoc giao"
                                    value={buildAssigneeName(task.assignee)}
                                >
                                    <Box sx={{ pl: 4 }}>
                                        <Typography variant="body1">{buildAssigneeName(task.assignee)}</Typography>
                                        {task.assignee?.email ? (
                                            <Typography variant="body2" color="text.secondary">
                                                {task.assignee.email}
                                            </Typography>
                                        ) : null}
                                        {task.assignee?.id ? (
                                            <Button
                                                component={RouterLink}
                                                to={`/contact/${task.assignee.id}`}
                                                size="small"
                                                sx={{ mt: 1, px: 0, minWidth: 0 }}
                                            >
                                                Xem chi tiet contact
                                            </Button>
                                        ) : null}
                                    </Box>
                                </DetailRow>

                                <Divider />

                                <DetailRow
                                    icon={<FolderOpenIcon fontSize="small" color="action" />}
                                    label="Project"
                                    value={task.project?.name || "Chua gan project"}
                                >
                                    <Box sx={{ pl: 4 }}>
                                        <Typography variant="body1">{task.project?.name || "Chua gan project"}</Typography>
                                        {task.project?.status ? (
                                            <Typography variant="body2" color="text.secondary">
                                                Trang thai: {task.project.status}
                                            </Typography>
                                        ) : null}
                                        {task.project?.description ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {task.project.description}
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </DetailRow>

                                <Divider />

                                <DetailRow
                                    icon={<BadgeIcon fontSize="small" color="action" />}
                                    label="Nguoi tao"
                                    value={task.createdByName || "Khong xac dinh"}
                                />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: { xs: "100%", md: 360 }, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                                Moc thoi gian
                            </Typography>

                            <Stack spacing={2.2}>
                                <DetailRow
                                    icon={<CalendarMonthIcon fontSize="small" color="action" />}
                                    label="Deadline"
                                    value={formatDateTime(task.dueDate)}
                                />

                                <Divider />

                                <DetailRow
                                    icon={<AccessTimeIcon fontSize="small" color="action" />}
                                    label="Tao luc"
                                    value={formatDateTime(task.createdAt)}
                                />

                                <Divider />

                                <DetailRow
                                    icon={<UpdateIcon fontSize="small" color="action" />}
                                    label="Cap nhat lan cuoi"
                                    value={formatDateTime(task.updatedAt)}
                                />

                                <Divider />

                                <DetailRow
                                    icon={<FlagIcon fontSize="small" color="action" />}
                                    label="Ma uu tien"
                                    value={task.priority || "Chua co"}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </Box>
    );
};

export default TaskDetail;
