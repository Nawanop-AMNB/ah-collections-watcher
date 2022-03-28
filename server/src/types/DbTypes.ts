
export type CollectionSchema = { collections: string[] | undefined };

export type FollowUpSchema = {
  followUps: Record<string, string[]> | undefined;
};

export type DiscordSessionSchema = {
  sessions: string[] | undefined;
};
