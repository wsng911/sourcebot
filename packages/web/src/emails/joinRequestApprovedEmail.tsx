import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import { 邮箱Footer } from './emailFooter';
import { SOURCEBOT_LOGO_LIGHT_LARGE_URL, SOURCEBOT_PLACEHOLDER_AVATAR_URL } from './constants';

interface JoinRequestApproved邮箱Props {
    baseUrl: string;
    user: {
        email: string;
        name?: string;
        avatarUrl?: string;
    },
    org名称: string;
}

export const JoinRequestApproved邮箱 = ({
    baseUrl,
    user,
    org名称,
}: JoinRequestApproved邮箱Props) => {
    const previewText = `Your request to join ${org名称} on Sourcebot has been approved`;
    const orgLink = baseUrl;

    return (
        <Html>
            <Head />
            <Tailwind>
                <Body class名称="bg-white my-auto mx-auto font-sans px-2">
                    <Preview>{previewText}</Preview>
                    <Container class名称="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section class名称="mt-[32px]">
                            <Img
                                src={SOURCEBOT_LOGO_LIGHT_LARGE_URL}
                                width="auto"
                                height="60"
                                alt="Sourcebot Logo"
                                class名称="my-0 mx-auto"
                            />
                        </Section>
                        <Heading class名称="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to <strong>{org名称}</strong>
                        </Heading>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            Hello{user.name ? ` ${user.name}` : ''},
                        </Text>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            Your request to join <strong>{org名称}</strong> on Sourcebot has been approved. You now have access to the organization.
                        </Text>
                        <Section class名称="text-center mt-[32px] mb-[32px]">
                            <Button
                                class名称="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={orgLink}
                            >
                                Go to {org名称}
                            </Button>
                        </Section>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser:{' '}
                            <Link href={orgLink} class名称="text-blue-600 no-underline">
                                {orgLink}
                            </Link>
                        </Text>
                        <邮箱Footer />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

JoinRequestApproved邮箱.PreviewProps = {
    baseUrl: 'https://sourcebot.example.com',
    user: {
        name: 'Alan Turing',
        email: 'alan.turing@example.com',
        avatarUrl: SOURCEBOT_PLACEHOLDER_AVATAR_URL,
    },
    org名称: 'Enigma',
} satisfies JoinRequestApproved邮箱Props;

export default JoinRequestApproved邮箱; 