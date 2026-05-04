"use client"

import { useState } from "react"
import { MemberApprovalRequiredToggle } from "./memberApprovalRequiredToggle"
import { InviteLinkToggle } from "./inviteLinkToggle"

interface OrganizationAccess设置WrapperProps {
    memberApprovalRequired: boolean
    inviteLinkEnabled: boolean
    inviteLink: string | null
    memberApprovalEnvVarSet: boolean
}

export function OrganizationAccess设置Wrapper({ 
    memberApprovalRequired, 
    inviteLinkEnabled, 
    inviteLink,
    memberApprovalEnvVarSet
}: OrganizationAccess设置WrapperProps) {
    const [showInviteLink, setShowInviteLink] = useState(memberApprovalRequired)
    
    const handleMemberApprovalToggle = (checked: boolean) => {
        setShowInviteLink(checked)
    }

    return (
        <>
            <div class名称={`transition-all duration-300 ease-in-out overflow-hidden max-h-96 opacity-100`}>
                <MemberApprovalRequiredToggle 
                    memberApprovalRequired={memberApprovalRequired}
                    onToggleChange={handleMemberApprovalToggle}
                    isControlledByEnvVar={memberApprovalEnvVarSet}
                />
            </div>
            
            <div class名称={`transition-all duration-300 ease-in-out overflow-hidden ${
                showInviteLink 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0 pointer-events-none'
            }`}>
                <InviteLinkToggle 
                    inviteLinkEnabled={inviteLinkEnabled} 
                    inviteLink={inviteLink} 
                />
            </div>
        </>
    )
}