import {
    Hr,
    Link,
    Section,
    Text,
} from '@react-email/components';

export const 邮箱Footer = () => {
    return (
        <Section class名称="mt-[10px]">
            <Hr class名称="border border-solid border-[#eaeaea] mx-0 w-full" />
            <Text class名称="text-[#666666] text-[12px] leading-[24px]">
                <Link href="https://sourcebot.dev" class名称="underline text-[#666666]" target="_blank">
                    Sourcebot.dev,
                </Link>
                &nbsp;blazingly fast code search.
            </Text>
        </Section>
    )
}