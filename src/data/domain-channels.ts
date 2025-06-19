export interface Channel {
  id: string;
  name: string;
  description: string;
}

export type DomainChannels = Record<string, Channel[]>;

export const domainChannelsData: DomainChannels = {
  "pse.dev": [
    {
      id: "pse",
      name: "PSE",
      description: "Privacy & Scaling Explorations community channel"
    }
  ]
};