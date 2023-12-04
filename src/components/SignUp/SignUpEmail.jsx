import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

export function SignUpEmail(props) {
  return (
    <Html lang="en">
      <Text>Thank you for registration</Text>
    </Html>
  );
}

export default SignUpEmail;
