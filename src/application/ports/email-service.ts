export interface EmailService {
  sendMagicLink(email: string, link: string): Promise<void>
  sendGroupInvite(
    email: string,
    inviterName: string,
    groupName: string,
    link: string,
  ): Promise<void>
}
