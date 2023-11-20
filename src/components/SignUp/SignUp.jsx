import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Paper from '@mui/material/Paper';
import { Alert, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from '../../store/UserSlice';
import { LOCAL_STORAGE_NAME } from '../../common/constants';
import { addUser } from '../../store/UserSlice';
import { fetchUsers } from '../../store/UserSlice';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('This field is required'),
  email: Yup.string()
    .email('Email is not valid')
    .required('This field is required'),
  password: Yup.string()
    .required('This field is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      'Password must contain at least 1 uppercase letter, 1 special character, and 1 number'
    ),
});

const SignUp = ( { setVisibility } ) => {
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState('');
  const users = useSelector((state) => state.user.users);
  const tempEmail = localStorage.getItem(LOCAL_STORAGE_NAME.TEMP_EMAIL);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const formik = useFormik({
    initialValues:{
      name: '',
      email: tempEmail || '',
      password: '',
    }, 
    validationSchema: validationSchema,
    onSubmit: () => {
      const { name, email, password } = formik.values;

      const newUser = {
        name,
        email,
        password,
      };
      
      const foundUser = users.find(user => user.email === email);

      if (!foundUser) {
        dispatch(addUser(newUser));
        formik.resetForm();
        dispatch(UserActions.logIn({ ...newUser }));
        localStorage.removeItem(LOCAL_STORAGE_NAME.TEMP_EMAIL);
      } else {
        setAlertMessage('User already exist. Please sign in.')
      }
      
    }
  })

  return(
    <>
      <Paper sx={{ maxWidth: 350, marginLeft: 'auto', marginRight: 'auto', padding: '20px'}} elevation={3}>
        <form onSubmit={formik.handleSubmit}>
          <h2>Sign Up</h2>

          <div>
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </div>

          <div>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>

          <div>
            <TextField
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>

          { alertMessage && (
            <>
              <Alert severity="error">{alertMessage}</Alert>
            </>
          )}

          <div>
            <Button 
              fullWidth
              variant="contained" 
              color="primary" 
              type="submit"
              size="large"
            >
              Sign Up
            </Button>
          </div>

          <div>
           <Button variant="text" onClick={setVisibility}>Sign In</Button>
          </div>

        </form>
      </Paper>
    </>
  )
}

export default SignUp;