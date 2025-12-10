import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: "thDrive",
  access: (allow) => ({
    // Public assets
    "public/*": [
      allow.guest.to(["read"]),                 // guests can read public/*
      allow.authenticated.to(["read", "write"]) // authed users can read/write
    ],

    // Protected assets (only for authenticated users)
    "protected/*": [
      allow.authenticated.to(["read", "write"])
    ]
  })
});