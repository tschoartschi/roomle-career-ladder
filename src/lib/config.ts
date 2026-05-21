export interface Config {
  confluenceBaseUrl: string;
  confluenceParentId: string;
  confluenceSpaceKey: string;
  confluenceArchiveParentId: string;
  atlassianUserName: string;
  atlassianApiToken: string;
}

export function loadConfig(): Config {
  const required = [
    'CONFLUENCE_BASE_URL',
    'CONFLUENCE_PARENT_ID',
    'CONFLUENCE_SPACE_KEY',
    'CONFLUENCE_ARCHIVE_PARENT_ID',
    'ATLASSIAN_USER_NAME',
    'ATLASSIAN_API_TOKEN',
  ] as const;

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    confluenceBaseUrl: process.env.CONFLUENCE_BASE_URL!.replace(/\/+$/, ''),
    confluenceParentId: process.env.CONFLUENCE_PARENT_ID!,
    confluenceSpaceKey: process.env.CONFLUENCE_SPACE_KEY!,
    confluenceArchiveParentId: process.env.CONFLUENCE_ARCHIVE_PARENT_ID!,
    atlassianUserName: process.env.ATLASSIAN_USER_NAME!,
    atlassianApiToken: process.env.ATLASSIAN_API_TOKEN!,
  };
}
