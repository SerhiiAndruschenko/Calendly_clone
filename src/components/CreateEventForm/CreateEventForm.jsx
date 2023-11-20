import { useEffect } from "react";
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
import { EventActions } from "../../store/EventSlice";
import { usersList } from "../../store/selectors";
import { fetchUsers } from "../../store/UserSlice";

const validationSchema = Yup.object({
  eventName: Yup.string()
    .required("This field is required")
    .min(3, "Minimum 3 characters"),
  description: Yup.string()
    .required("This field is required")
    .min(10, "Minimum 10 characters"),
  selectedUser: Yup.string().required("This field is required"),
  dateTime: Yup.date().required("This field is required"),
});

const CreateEventForm = ({ onCloseModal }) => {
  const users = useSelector(usersList);
  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(UserActions.getUserList());
    dispatch(fetchUsers());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      eventName: "",
      description: "",
      selectedUser: "",
      dateTime: new Date(),
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(EventActions.addEvent(values));
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
              <InputLabel id="selectedUser-label">Select User</InputLabel>
              <Select
                labelId="selectedUser-label"
                id="selectedUser"
                name="selectedUser"
                label="Select User"
                value={formik.values.selectedUser}
                onChange={formik.handleChange}
                error={
                  formik.touched.selectedUser &&
                  Boolean(formik.errors.selectedUser)
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.name}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="dateTime"
              name="dateTime"
              label="Date and Time"
              type="datetime-local"
              value={formik.values.dateTime}
              onChange={formik.handleChange}
              error={formik.touched.dateTime && Boolean(formik.errors.dateTime)}
              helperText={formik.touched.dateTime && formik.errors.dateTime}
              InputLabelProps={{
                shrink: true,
              }}
            />
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
