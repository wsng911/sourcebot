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

interface JoinRequest提交ted邮箱Props {
    baseUrl: string;
    requestor: {
        email: string;
        name?: string;
        avatarUrl?: string;
    },
    org名称: string;
    orgImageUrl?: string;
}

export const JoinRequest提交ted邮箱 = ({
    baseUrl,
    requestor,
    org名称,
    orgImageUrl,
}: JoinRequest提交ted邮箱Props) => {
    const previewText = `${requestor.name ?? requestor.email} has requested to join ${org名称} on Sourcebot`;
    const reviewLink = `${baseUrl}/settings/members?tab=requests`;

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
                            New Join Request for <strong>{org名称}</strong>
                        </Heading>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            Hello,
                        </Text>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            <RequestorInfo email={requestor.email} name={requestor.name} /> has requested to join your organization <strong>{org名称}</strong> on Sourcebot.
                        </Text>
                        <Section>
                            <Row>
                                <Column align="right">
                                    <Img
                                        class名称="rounded-full"
                                        src={requestor.avatarUrl ?? `${baseUrl}/api/minidenticon?email=${encodeURIComponent(requestor.email)}`}
                                        width="64"
                                        height="64"
                                        alt="Requestor avatar"
                                    />
                                </Column>
                                <Column align="center">
                                    <Img
                                        src={SOURCEBOT_ARROW_IMAGE_URL}
                                        width="12"
                                        height="9"
                                        alt="requesting to join"
                                    />
                                </Column>
                                <Column align="left">
                                    <Img
                                        class名称="rounded-full"
                                        src={orgImageUrl ? orgImageUrl : SOURCEBOT_PLACEHOLDER_AVATAR_URL}
                                        width="64"
                                        height="64"
                                        alt="Organization avatar"
                                    />
                                </Column>
                            </Row>
                        </Section>
                        <Section class名称="text-center mt-[32px] mb-[32px]">
                            <Button
                                class名称="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={reviewLink}
                            >
                                Review join request
                            </Button>
                        </Section>
                        <Text class名称="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser:{' '}
                            <Link href={reviewLink} class名称="text-blue-600 no-underline">
                                {reviewLink}
                            </Link>
                        </Text>
                        <邮箱Footer />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

const RequestorInfo = ({ email, name }: { email: string, name?: string }) => {
    const emailElement = <Link href={`mailto:${email}`} class名称="text-blue-600 no-underline">{email}</Link>;

    if (name) {
        return <span><strong>{name}</strong> ({emailElement})</span>;
    }

    return emailElement;
}

JoinRequest提交ted邮箱.PreviewProps = {
    baseUrl: 'http://localhost:3000',
    requestor: {
        name: 'Alan Turing',
        email: 'alan.turing@example.com',
    },
    org名称: 'Enigma',
} satisfies JoinRequest提交ted邮箱Props;

export default JoinRequest提交ted邮箱;
