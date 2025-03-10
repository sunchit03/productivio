import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
  } from '@react-email/components';
  
export default function Invitation({email}) {
    return (
        <Html>
        <Head />
        <Preview>You're invited to join our Productivio!</Preview>
        <Body style={main}>
            <Container style={container}>
            <Heading style={h1}>You're Invited to Join Us!</Heading>
            <Text style={text}>
                Hi {email},
                <br /><br />
                You've been invited to join our platform! To get started, please click the button below to create your account.
                <br /><br />
                <Button href={process.env.NEXT_PUBLIC_APP_URL} style={{ color: "#61dafb" }}>
                    Create Your Account
                </Button>
                <br /><br />
                If you have any questions, feel free to reach out to us.
                <br /><br />
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
backgroundColor: '#000000',
margin: '0 auto',
fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
margin: 'auto',
padding: '96px 20px 64px',
};

const h1 = {
color: '#ffffff',
fontSize: '24px',
fontWeight: '600',
lineHeight: '40px',
margin: '0 0 20px',
};

const text = {
color: '#aaaaaa',
fontSize: '14px',
lineHeight: '24px',
margin: '0 0 40px',
};