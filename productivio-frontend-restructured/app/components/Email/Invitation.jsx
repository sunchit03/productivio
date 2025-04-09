import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from '@react-email/components';

export default function Invitation({ email }) {
  return (
    <Html>
      <Head />
      <Preview>You're invited to join Productivio!</Preview>
      <Body style={main}>
        <Container style={container}>
        <Img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/logo.png`}
            alt="Productivio Logo"
            width="120"
            style={{
                margin: '0 auto 40px',
                display: 'block'
            }}
            />

          <Heading style={h1}>You're Invited to Join Us!</Heading>
          <Text style={text}>
            Hi {email},
            <br />
            <br />
            You've been invited to join our platform! To get started, please click the button below to create your account.
            <br />
            <br />
            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL}`}
              style={button}
            >
              Create Your Account
            </Button>
            <br />
            <br />
            If you have any questions, feel free to reach out to us.
            <br />
            <br />
            Best regards,
            <br />
            The Productivio Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
const main = {
  backgroundColor: '#1f1f2e',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: 'auto',
  padding: '64px 20px 48px',
  textAlign: 'center',
};

const h1 = {
  color: '#ffffff',
  fontSize: '26px',
  fontWeight: '700',
  lineHeight: '36px',
  margin: '0 0 20px',
};

const text = {
  color: '#cccccc',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 40px',
};

const button = {
  backgroundColor: '#7f5af0',
  color: '#ffffff',
  padding: '14px 28px',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
};

const img = {
  margin: '0 auto 40px',
  display: 'block',
}
