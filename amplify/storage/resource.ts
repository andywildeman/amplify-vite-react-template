import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: "thDrive",
  access: (allow) => ({
    "*": [
      allow.authenticated.to(["read", "write"])  // allow ALL authenticated access
    ],
    "public/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write"])
    ]
  })
});