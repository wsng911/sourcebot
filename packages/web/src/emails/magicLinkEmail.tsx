import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import { SOURCEBOT_LOGO_LIGHT_LARGE_URL } from './constants';

interface MagicLink邮箱Props {
    token: string,
}

export const MagicLink邮箱 = ({
    token,
}: MagicLink邮箱Props) => (
    <Html>
        <Head />
        <Preview>Use this code {token} to log in to Sourcebot</Preview>
        <Tailwind>
            <Body class名称="bg-white font-sans m-0 p-0">
                <Container class名称="mx-auto max-w-[600px] p-6">
                    <Section class名称="mb-4">
                        <Img
                            src={SOURCEBOT_LOGO_LIGHT_LARGE_URL}
                            alt="Sourcebot Logo"
                            width="auto"
                            height="40"
                            class名称="mx-0"
                        />
                    </Section>

                    <Section class名称="mb-4">
                        <Text class名称="text-base text-black">
                            Use the code below to log in to Sourcebot.
                        </Text>
                    </Section>

                    <Section class名称="bg-[#f4f7fa] py-4 px-2 rounded mb-4 text-center">
                        <Text class名称="text-xl font-bold text-black tracking-[0.5em]">
                            {token}
                        </Text>
                    </Section>

                    <Section>
                        <Text class名称="text-sm text-gray-600 leading-6">
                            This code is only valid for the next 10 minutes. If you didn&apos;t try to log in,
                            you can safely ignore this email.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

MagicLink邮箱.PreviewProps = {
    token: '123456',
} as MagicLink邮箱Props;

export default MagicLink邮箱;
