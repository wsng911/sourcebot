import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import { 邮箱Footer } from './emailFooter';
import { SOURCEBOT_LOGO_LIGHT_LARGE_URL, SOURCEBOT_ARROW_IMAGE_URL, SOURCEBOT_PLACEHOLDER_AVATAR_URL } from './constants';

interface InviteUser邮箱Props {
    baseUrl: string;
    inviteLink: string;
    host: {
        email: string;
        name?: string;
        avatarUrl?: string;
    },
    recipient: {
        name?: string;
    },
    org名称: string;
    orgImageUrl?: string;
}

export const InviteUser邮箱 = ({
    baseUrl,
    host,
    recipient,
    org名称,
    orgImageUrl,
    inviteLink,
}: InviteUser邮箱Props) => {
    const previewText = `Join ${host.name ?? host.email} on Sourcebot`;

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
                            Join <strong>{org名称}</strong> on <strong>Sourcebot</strong>
                        </Heading>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            {`Hello${recipient.name ? ` ${recipient.name.split(' ')[0]}` : ''},`}
                        </Text>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            <InvitedByText email={host.email} name={host.name} /> has invited you to the <strong>{org名称}</strong> organization on{' '}
                            <strong>Sourcebot</strong>.
                        </Text>
                        <Section>
                            <Row>
                                <Column align="right">
                                    <Img
                                        class名称="rounded-full"
                                        src={host.avatarUrl ?? `${baseUrl}/api/minidenticon?email=${encodeURIComponent(host.email)}`}
                                        width="64"
                                        height="64"
                                    />
                                </Column>
                                <Column align="center">
                                    <Img
                                        src={SOURCEBOT_ARROW_IMAGE_URL}
                                        width="12"
                                        height="9"
                                        alt="invited you to"
                                    />
                                </Column>
                                <Column align="left">
                                    <Img
                                        class名称="rounded-full"
                                        src={orgImageUrl ? orgImageUrl : SOURCEBOT_PLACEHOLDER_AVATAR_URL}
                                        width="64"
                                        height="64"
                                    />
                                </Column>
                            </Row>
                        </Section>
                        <Section class名称="text-center mt-[32px] mb-[32px]">
                            <Button
                                class名称="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={inviteLink}
                            >
                                Join the organization
                            </Button>
                        </Section>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser:{' '}
                            <Link href={inviteLink} class名称="text-blue-600 no-underline">
                                {inviteLink}
                            </Link>
                        </Text>
                        <邮箱Footer />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

const InvitedByText = ({ email, name }: { email: string, name?: string }) => {
    const emailElement = <Link href={`mailto:${email}`} class名称="text-blue-600 no-underline">{email}</Link>;

    if (name) {
        const first名称 = name.split(' ')[0];
        return <span><strong>{first名称}</strong> ({emailElement})</span>;
    }

    return emailElement;
}

InviteUser邮箱.PreviewProps = {
    baseUrl: 'http://localhost:3000',
    host: {
        name: 'Alan Turing',
        email: 'alan.turing@example.com',
    },
    recipient: {
        // name: 'alanturing',
    },
    org名称: 'Enigma',
    inviteLink: 'http://localhost:3000/redeem?invite_id=1234',
} satisfies InviteUser邮箱Props;

export default InviteUser邮箱;