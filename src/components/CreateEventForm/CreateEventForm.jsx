import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { usersList, currentUser } from "../../store/selectors";
import { addNewEvent } from "../../store/EventSlice";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const validationSchema = Yup.object({
  eventName: Yup.string()
    .required("This field is required")
    .min(3, "Minimum 3 characters"),
  description: Yup.string()
    .required("This field is required")
    .min(10, "Minimum 10 characters"),
  selectedUsers: Yup.array().required("This field is required"),
  dateTime: Yup.date().required("This field is required"),
});

const CreateEventForm = ({ onCloseModal }) => {
  const users = useSelector(usersList);
  const dispatch = useDispatch();
  const currentUserInfo = useSelector(currentUser);

  const formik = useFormik({
    initialValues: {
      eventName: "",
      description: "",
      selectedUsers: [currentUserInfo],
      dateTime: dayjs(new Date()),
    },
    validationSchema,
    onSubmit: async (values) => {
      const formattedDateTime = values.dateTime.format("MM/DD/YYYY h:mm A");
      const eventData = {
        eventName: values.eventName,
        description: values.description,
        dateTime: formattedDateTime,
        participants: values.selectedUsers.map((user) => ({
          id: user.id,
          name: user.name,
          status: user.id === currentUserInfo.id ? "accepted" : "pending",
          role: user.id === currentUserInfo.id ? "owner" : "member",
        })),
      };

      dispatch(addNewEvent(eventData));

      onCloseModal();
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="eventName"
              name="eventName"
              label="Event Name"
              value={formik.values.eventName}
              onChange={formik.handleChange}
              error={
                formik.touched.eventName && Boolean(formik.errors.eventName)
              }
              helperText={formik.touched.eventName && formik.errors.eventName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="selectedUsers-label">Select User</InputLabel>
              <Select
                labelId="selectedUsers-label"
                id="selectedUsers"
                name="selectedUsers"
                label="Select Users"
                multiple
                value={formik.values.selectedUsers}
                onChange={(event) =>
                  formik.setFieldValue("selectedUsers", event.target.value)
                }
                error={
                  formik.touched.selectedUsers &&
                  Boolean(formik.errors.selectedUsers)
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  label="Date & Time"
                  value={formik.values.dateTime}
                  minDateTime={dayjs(new Date())}
                  onChange={(newValue) => {
                    formik.setFieldValue("dateTime", newValue);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Create Event
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateEventForm;
